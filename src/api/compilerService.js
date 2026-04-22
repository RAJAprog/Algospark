

// ============================================================
// src/api/compilerService.js  —  Mind Code Platform
//
// .env MUST have:
//   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
//
// HOW IT WORKS (LeetCode-style):
//   1. Faculty sets methodName="twoSum" and testCases with Python/JS syntax
//   2. Student writes only the Solution class (or standalone function)
//   3. runWithTestCases() wraps code with auto-imports + driver for each language
//   4. normalise() comparison handles [0, 1] == [0,1] == true
//
// LANGUAGE-AWARE TRANSFORMATION:
//   Python / JS  →  pass-through (Python/JS array syntax matches storage)
//   Java         →  [1,3,5,6]  →  new int[]{1,3,5,6}
//   C++          →  named variables to fix rvalue reference error
//   C            →  compound literals + array size injection
//
// JAVASCRIPT — supports ALL coding styles:
//   class Solution { twoSum(...) { } }   ← LeetCode class style
//   function twoSum(...) { }              ← standalone function
//   var twoSum = function(...) { }        ← var assignment
//   const twoSum = (...) => { }           ← arrow function
//
// C++ — C++14 compatible (no if constexpr / is_same_v / requires)
//   Named variable declarations prevent rvalue reference binding error.
//   Overloaded _print::out() functions handle all return types.
// ============================================================

const JUDGE0_BASE = (import.meta.env.VITE_COMPILER_API_URL || '').replace(/\/+$/, '');
const RAPID_KEY   = import.meta.env.VITE_COMPILER_API_KEY;

export const LANGUAGE_IDS = {
  python:     71,
  javascript: 93,
  c:          50,
  cpp:        54,
  java:       62,
};

const encode = (str) => {
  if (!str && str !== 0) return '';
  try { return btoa(unescape(encodeURIComponent(String(str)))); }
  catch { return btoa(String(str)); }
};
const decode = (str) => {
  if (!str) return '';
  try { return decodeURIComponent(escape(atob(str))); }
  catch { return str; }
};

const getHeaders = () => {
  const h = { 'Content-Type': 'application/json' };
  if (RAPID_KEY) {
    h['x-rapidapi-key']  = RAPID_KEY;
    h['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
  }
  return h;
};

const ensureConfig = () => {
  if (!JUDGE0_BASE) throw new Error('VITE_COMPILER_API_URL not set in .env');
};

// ─────────────────────────────────────────────────────────────
// ARG PARSING UTILITIES
// ─────────────────────────────────────────────────────────────

/**
 * Split top-level comma-separated arguments respecting:
 *   - Quoted strings (no splitting inside "hello, world")
 *   - Nested arrays  (no splitting inside [1,[2,3]])
 *   - Char literals  ('a', 'b')
 */
const splitTopLevelArgs = (s) => {
  const args = [];
  let depth = 0, cur = '', inStr = false, strChar = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!inStr && (c === '"' || c === "'")) { inStr = true; strChar = c; cur += c; continue; }
    if (inStr && c === strChar && s[i - 1] !== '\\') { inStr = false; cur += c; continue; }
    if (inStr) { cur += c; continue; }
    if (c === '[' || c === '(') { depth++; cur += c; continue; }
    if (c === ']' || c === ')') { depth--; cur += c; continue; }
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
};

/** Detect element type from array inner content */
const detectArrayElementType = (inner) => {
  const s = inner.trim();
  if (!s) return 'int';
  if (s.startsWith('[')) return 'nested';
  const items = splitTopLevelArgs(s);
  const first = (items[0] || '').trim();
  if (first.startsWith('"'))                       return 'string';
  if (first.startsWith("'") && first.length === 3) return 'char';
  if (first === 'true' || first === 'false')        return 'bool';
  if (first.match(/^-?\d+\.\d+$/))                 return 'double';
  return 'int';
};

/** Count top-level elements (for C size injection) */
const countArrayElements = (inner) => {
  if (!inner.trim()) return 0;
  return splitTopLevelArgs(inner).length;
};

// ─────────────────────────────────────────────────────────────
// JAVA TRANSFORMER
// ─────────────────────────────────────────────────────────────
const transformJavaArg = (arg) => {
  const a = arg.trim();
  if (!a) return a;
  if (a.startsWith('[') && a.endsWith(']')) {
    const inner = a.slice(1, -1).trim();
    if (!inner) return 'new int[]{}';
    const type = detectArrayElementType(inner);
    if (type === 'nested') {
      const rows = splitTopLevelArgs(inner);
      const converted = rows.map(r => {
        const t = r.trim();
        return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
      });
      return `new int[][]{ ${converted.join(', ')} }`;
    }
    if (type === 'string') return `new String[]{${inner}}`;
    if (type === 'char')   return `new char[]{${inner}}`;
    if (type === 'bool')   return `new boolean[]{${inner}}`;
    if (type === 'double') return `new double[]{${inner}}`;
    return `new int[]{${inner}}`;
  }
  // Single-quoted multi-char → Java String
  if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;
  return a;
};

const transformArgsForJava = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '';
  return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
};

// ─────────────────────────────────────────────────────────────
// C++ TRANSFORMER — Named variables to fix rvalue reference error
// Returns { decls: string[], callArgs: string[] }
// ─────────────────────────────────────────────────────────────
const buildCppNamedVars = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
  const args = splitTopLevelArgs(inputArgs);
  const decls = [], callArgs = [];
  args.forEach((arg, i) => {
    const a = arg.trim();
    if (a.startsWith('[') && a.endsWith(']')) {
      const inner = a.slice(1, -1).trim();
      const type  = detectArrayElementType(inner);
      const name  = `_a${i}`;
      if (!inner) { decls.push(`vector<int> ${name} = {};`); callArgs.push(name); return; }
      if (type === 'nested') {
        const rows = splitTopLevelArgs(inner);
        const cv = rows.map(r => {
          const t = r.trim();
          return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
        });
        decls.push(`vector<vector<int>> ${name} = {${cv.join(', ')}};`);
        callArgs.push(name); return;
      }
      const cppType = { string:'vector<string>', char:'vector<char>', bool:'vector<bool>', double:'vector<double>', int:'vector<int>' }[type] || 'vector<int>';
      decls.push(`${cppType} ${name} = {${inner}};`);
      callArgs.push(name);
    } else {
      callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
    }
  });
  return { decls, callArgs };
};

// ─────────────────────────────────────────────────────────────
// C TRANSFORMER — Compound literals + size injection
// ─────────────────────────────────────────────────────────────
const transformArgsForC = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '&returnSize';
  const args = splitTopLevelArgs(inputArgs);
  const result = [];
  args.forEach(arg => {
    const a = arg.trim();
    if (a.startsWith('[') && a.endsWith(']')) {
      const inner = a.slice(1, -1).trim();
      result.push(`(int[]){${inner}}`);
      result.push(String(countArrayElements(inner)));
    } else {
      result.push(a);
    }
  });
  result.push('&returnSize');
  return result.join(', ');
};

const transformArgsForPython = (inputArgs) => inputArgs || '';
const transformArgsForJs     = (inputArgs) => (inputArgs || '').replace(/'/g, '"');

// ─────────────────────────────────────────────────────────────
// LANGUAGE WRAPPERS
// ─────────────────────────────────────────────────────────────
const WRAPPERS = {

  // ── Python ─────────────────────────────────────────────────
  python: (userCode, inputArgs, methodName) => {
    const args = transformArgsForPython(inputArgs);
    return `import sys
from typing import List, Dict, Optional, Tuple, Set, Any, Union
from collections import defaultdict, deque, Counter, OrderedDict
import heapq, math, itertools, functools, bisect, re, string

${userCode}

if __name__ == "__main__":
    try:
        _sol = Solution()
        _result = _sol.${methodName}(${args})
        def _fmt(v):
            if isinstance(v, list): return "[" + ",".join(_fmt(x) for x in v) + "]"
            if isinstance(v, bool): return "true" if v else "false"
            if v is None: return "null"
            if isinstance(v, str): return v
            return str(v)
        print(_fmt(_result))
    except Exception as _e:
        print(f"Error: {_e}", file=sys.stderr)`;
  },

  // ── JavaScript ─────────────────────────────────────────────
  // Supports ALL styles with nested try-catch for robust detection:
  //   class Solution { twoSum(...) }     → class style
  //   function twoSum(...) {}             → function declaration
  //   var/let/const twoSum = function(){} → variable assignment
  //   const twoSum = (...) => {}          → arrow function
  javascript: (userCode, inputArgs, methodName) => {
    const args = transformArgsForJs(inputArgs);
    return `${userCode}

(function () {
  try {
    let _result;
    let _called = false;

    // Attempt 1: class Solution { ${methodName}() {} }
    try {
      if (typeof Solution !== "undefined") {
        const _sol = new Solution();
        if (typeof _sol["${methodName}"] === "function") {
          _result = _sol["${methodName}"](${args});
          _called = true;
        }
      }
    } catch (_ignore) { /* class not in scope or has no method, try function */ }

    // Attempt 2: standalone function ${methodName}(...) or var ${methodName} = ...
    if (!_called) {
      try {
        if (typeof ${methodName} !== "undefined" && typeof ${methodName} === "function") {
          _result = ${methodName}(${args});
          _called = true;
        }
      } catch (_ignore2) { /* not a function */ }
    }

    if (!_called) {
      throw new Error("Solution not found. Write either:\\n  class Solution { ${methodName}(...) { } }\\nor:\\n  function ${methodName}(...) { }");
    }

    function _fmt(v) {
      if (Array.isArray(v)) return "[" + v.map(_fmt).join(",") + "]";
      if (v === null || v === undefined) return "null";
      if (typeof v === "boolean") return v ? "true" : "false";
      return String(v);
    }
    console.log(_fmt(_result));
  } catch (e) {
    process.stderr.write("Error: " + e.message + "\\n");
  }
})();`;
  },

  // ── Java ───────────────────────────────────────────────────
  java: (userCode, inputArgs, methodName) => {
    const args = transformArgsForJava(inputArgs);
    return `import java.util.*;
import java.util.stream.*;

${userCode}

class Main {
    public static void main(String[] args) {
        try {
            Solution sol = new Solution();
            Object result = sol.${methodName}(${args});
            System.out.println(fmt(result));
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    static String fmt(Object r) {
        if (r == null) return "null";
        if (r instanceof boolean[]) {
            boolean[] a = (boolean[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof int[]) {
            int[] a = (int[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof long[]) {
            long[] a = (long[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof double[]) {
            double[] a = (double[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof char[]) {
            char[] a = (char[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof String[]) {
            String[] a = (String[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof List) {
            return ((List<?>) r).stream().map(Main::fmt).collect(Collectors.joining(",", "[", "]"));
        }
        if (r instanceof Boolean) return (Boolean) r ? "true" : "false";
        return r.toString();
    }
}`;
  },

  // ── C++ ────────────────────────────────────────────────────
  // Fix 1 (rvalue ref): named variable declarations before call.
  // Fix 2 (C++17 features): overloaded _print::out() — C++14 compatible.
  cpp: (userCode, inputArgs, methodName) => {
    const { decls, callArgs } = buildCppNamedVars(inputArgs);
    // Build the declaration block — each decl on its own line, indented
    const declBlock = decls.map(d => `    ${d}`).join('\n');
    const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;

    return `#include <bits/stdc++.h>
using namespace std;

${userCode}

// C++14-compatible output helpers
// No if constexpr, no is_same_v, no requires — works on gcc-9 default
namespace _print {
    void out(int v)               { cout << v; }
    void out(long v)              { cout << v; }
    void out(long long v)         { cout << v; }
    void out(unsigned int v)      { cout << v; }
    void out(unsigned long v)     { cout << v; }
    void out(unsigned long long v){ cout << v; }
    void out(double v)            { cout << v; }
    void out(float v)             { cout << v; }
    void out(bool v)              { cout << (v ? "true" : "false"); }
    void out(char v)              { cout << v; }
    void out(const string& v)     { cout << v; }
    void out(const char* v)       { cout << v; }
    // 1-D vector
    template<typename T>
    void out(const vector<T>& v) {
        cout << "[";
        for (size_t i = 0; i < v.size(); i++) {
            if (i) cout << ",";
            out(v[i]);
        }
        cout << "]";
    }
    // 2-D vector
    template<typename T>
    void out(const vector<vector<T>>& v) {
        cout << "[";
        for (size_t i = 0; i < v.size(); i++) {
            if (i) cout << ",";
            out(v[i]);
        }
        cout << "]";
    }
    // pair
    template<typename A, typename B>
    void out(const pair<A,B>& p) {
        cout << "["; out(p.first); cout << ","; out(p.second); cout << "]";
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    Solution sol;
${declBlock}
    auto result = ${callExpr};
    _print::out(result);
    cout << endl;
    return 0;
}`;
  },

  // ── C ──────────────────────────────────────────────────────
  // Compound literals (int[]){...} + auto-injected array sizes
  c: (userCode, inputArgs, methodName) => {
    const args = transformArgsForC(inputArgs);
    return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

int main() {
    int returnSize = 0;
    int* result = ${methodName}(${args});
    if (result == NULL || returnSize == 0) { printf("null\\n"); return 0; }
    printf("[");
    for (int i = 0; i < returnSize; i++) { if (i) printf(","); printf("%d", result[i]); }
    printf("]\\n");
    if (result) free(result);
    return 0;
}`;
  },
};

// ─────────────────────────────────────────────────────────────
// Normalise output for comparison
// ─────────────────────────────────────────────────────────────
const normalise = (raw) => {
  if (!raw && raw !== 0) return '';
  return String(raw)
    .trim()
    .replace(/\s+/g,  '')
    .replace(/True/g,  'true')
    .replace(/False/g, 'false')
    .replace(/None/g,  'null')
    .toLowerCase();
};

// ─────────────────────────────────────────────────────────────
// POST to Judge0
// ─────────────────────────────────────────────────────────────
const _submit = async (sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb) => {
  ensureConfig();
  const url = `${JUDGE0_BASE}/submissions?base64_encoded=true&wait=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      source_code:    encode(sourceCode),
      language_id:    languageId,
      stdin:          encode(stdin),
      cpu_time_limit: timeLimitMs / 1000,
      memory_limit:   memoryLimitKb,
      stack_limit:    64000,
      enable_network: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) throw new Error('Judge0: Quota exceeded or not subscribed.');
    if (res.status === 401) throw new Error('Judge0: Invalid API key.');
    throw new Error(`Compiler API error ${res.status}: ${text}`);
  }
  let data = await res.json();
  if (data.status?.id <= 2 && data.token) data = await _pollRaw(data.token);
  return data;
};

// ─────────────────────────────────────────────────────────────
// executeCode — raw execution (custom Run button, no wrapper)
// ─────────────────────────────────────────────────────────────
export const executeCode = async (
  language,
  sourceCode,
  stdin         = '',
  timeLimitMs   = 2000,
  memoryLimitKb = 128000,
) => {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);
  const raw = await _submit(sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb);
  return _normalizeResult(raw);
};

// ─────────────────────────────────────────────────────────────
// runWithTestCases — LeetCode-style wrapped execution
// ─────────────────────────────────────────────────────────────
export const runWithTestCases = async (
  language,
  sourceCode,
  question,
  options = {},
) => {
  ensureConfig();
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const { memoryLimitKb = 128000 } = options;
  const testCases  = (question?.testCases || []).filter(tc => (tc.input || '').trim() || (tc.expectedOutput || '').trim());
  const methodName = question?.methodName  || 'solution';
  const timeLimit  = question?.timeLimitMs || 2000;
  const wrapFn     = WRAPPERS[language];

  const hasHiddenFlags = testCases.some(tc => tc.isHidden === true);
  const isVisible = (tc, idx) => hasHiddenFlags ? !tc.isHidden : idx < 3;

  if (!testCases.length) {
    const r = await executeCode(language, sourceCode, '', timeLimit, memoryLimitKb);
    return { results: [], passedCount: 0, totalCount: 0, allPassed: false, visiblePassed: 0, visibleTotal: 0, rawResult: r, noTestCases: true };
  }

  const runOne = async (tc, idx) => {
    const visible = isVisible(tc, idx);
    let finalCode = sourceCode;
    if (wrapFn && methodName) {
      try { finalCode = wrapFn(sourceCode, tc.input || '', methodName); } catch (_) { finalCode = sourceCode; }
    }
    let raw;
    try {
      raw = await _submit(finalCode, languageId, '', timeLimit, memoryLimitKb);
    } catch (err) {
      return {
        caseIndex: idx, isVisible: visible,
        input: visible ? tc.input : null,
        expectedOutput: visible ? (tc.expectedOutput || '').trim() : null,
        actualOutput: null, passed: false,
        statusId: 13, statusLabel: 'Network Error', statusColor: '#6b7280',
        error: err.message, time: null, memory: null,
      };
    }
    const stdout     = decode(raw.stdout)?.trim()         || '';
    const stderr     = decode(raw.stderr)?.trim()         || '';
    const compileErr = decode(raw.compile_output)?.trim() || '';
    const expected   = (tc.expectedOutput || '').toString().trim();
    const passed     = raw.status?.id === 3 && normalise(stdout) === normalise(expected);
    const det        = getStatusDetails(raw.status?.id);
    return {
      caseIndex:      idx,
      isVisible:      visible,
      input:          visible ? tc.input : null,
      expectedOutput: visible ? expected  : null,
      actualOutput:   visible ? stdout    : (passed ? '✓' : '✗'),
      passed,
      statusId:       raw.status?.id,
      statusLabel:    raw.status?.description || det.label,
      statusColor:    det.color,
      time:           raw.time,
      memory:         raw.memory,
      error:          (compileErr || stderr) || null,
    };
  };

  const results = [];
  for (let i = 0; i < testCases.length; i++) {
    results.push(await runOne(testCases[i], i));
    if (i < testCases.length - 1) await new Promise(r => setTimeout(r, 250));
  }

  const passedCount   = results.filter(r => r.passed).length;
  const visibleCases  = results.filter(r => r.isVisible);
  const visiblePassed = visibleCases.filter(r => r.passed).length;
  const firstFailure  = results.find(r => !r.passed && r.isVisible) || results.find(r => !r.passed) || null;

  return { results, passedCount, totalCount: testCases.length, allPassed: passedCount === testCases.length, visiblePassed, visibleTotal: visibleCases.length, firstFailure };
};

const _pollRaw = async (token, max = 12) => {
  const url = `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true`;
  for (let i = 0; i < max; i++) {
    await new Promise(r => setTimeout(r, 700));
    try {
      const res  = await fetch(url, { headers: getHeaders() });
      const data = await res.json();
      if (data.status?.id >= 3) return data;
    } catch {}
  }
  return { status: { id: 13, description: 'Timeout' }, stdout: null, stderr: 'Execution timed out', compile_output: null };
};

const _normalizeResult = (data) => ({
  stdout:         decode(data.stdout),
  stderr:         decode(data.stderr),
  compile_output: decode(data.compile_output),
  message:        decode(data.message),
  time:           data.time,
  memory:         data.memory,
  status:         data.status,
});

export const getStatusDetails = (id) => ({
  1:  { label: 'In Queue',                color: '#8b949e' },
  2:  { label: 'Processing',              color: '#58a6ff' },
  3:  { label: 'Accepted',                color: '#22c55e' },
  4:  { label: 'Wrong Answer',            color: '#ef4444' },
  5:  { label: 'Time Limit Exceeded',     color: '#f59e0b' },
  6:  { label: 'Compilation Error',       color: '#ef4444' },
  7:  { label: 'Runtime Error (SIGSEGV)', color: '#ef4444' },
  8:  { label: 'Runtime Error (SIGXFSZ)', color: '#ef4444' },
  9:  { label: 'Runtime Error (SIGFPE)',  color: '#ef4444' },
  10: { label: 'Runtime Error (SIGABRT)', color: '#ef4444' },
  11: { label: 'Runtime Error (NZEC)',    color: '#ef4444' },
  12: { label: 'Runtime Error (Other)',   color: '#ef4444' },
  13: { label: 'Internal Error',          color: '#6b7280' },
  14: { label: 'Exec Format Error',       color: '#6b7280' },
}[id] || { label: 'Unknown', color: '#6b7280' });

/**
 * Preview how inputArgs transforms in each language.
 * Useful in QuestionForm for faculty validation.
 */
export const previewInputTransform = (inputArgs) => {
  const { decls, callArgs } = buildCppNamedVars(inputArgs);
  return {
    python:     transformArgsForPython(inputArgs),
    javascript: transformArgsForJs(inputArgs),
    java:       transformArgsForJava(inputArgs),
    cpp:        decls.length ? `${decls.join('\n')} → call: (${callArgs.join(', ')})` : `(${callArgs.join(', ')})`,
    c:          transformArgsForC(inputArgs),
  };
};