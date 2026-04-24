

// // // ============================================================
// // // src/api/compilerService.js  —  Mind Code Platform
// // //
// // // .env MUST have:
// // //   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
// // //
// // // HOW IT WORKS (LeetCode-style):
// // //   1. Faculty sets methodName="twoSum" and testCases with Python/JS syntax
// // //   2. Student writes only the Solution class (or standalone function)
// // //   3. runWithTestCases() wraps code with auto-imports + driver for each language
// // //   4. normalise() comparison handles [0, 1] == [0,1] == true
// // //
// // // LANGUAGE-AWARE TRANSFORMATION:
// // //   Python / JS  →  pass-through (Python/JS array syntax matches storage)
// // //   Java         →  [1,3,5,6]  →  new int[]{1,3,5,6}
// // //   C++          →  named variables to fix rvalue reference error
// // //   C            →  compound literals + array size injection
// // //
// // // JAVASCRIPT — supports ALL coding styles:
// // //   class Solution { twoSum(...) { } }   ← LeetCode class style
// // //   function twoSum(...) { }              ← standalone function
// // //   var twoSum = function(...) { }        ← var assignment
// // //   const twoSum = (...) => { }           ← arrow function
// // //
// // // C++ — C++14 compatible (no if constexpr / is_same_v / requires)
// // //   Named variable declarations prevent rvalue reference binding error.
// // //   Overloaded _print::out() functions handle all return types.
// // // ============================================================

// // const JUDGE0_BASE = (import.meta.env.VITE_COMPILER_API_URL || '').replace(/\/+$/, '');
// // const RAPID_KEY   = import.meta.env.VITE_COMPILER_API_KEY;

// // export const LANGUAGE_IDS = {
// //   python:     71,
// //   javascript: 93,
// //   c:          50,
// //   cpp:        54,
// //   java:       62,
// // };

// // const encode = (str) => {
// //   if (!str && str !== 0) return '';
// //   try { return btoa(unescape(encodeURIComponent(String(str)))); }
// //   catch { return btoa(String(str)); }
// // };
// // const decode = (str) => {
// //   if (!str) return '';
// //   try { return decodeURIComponent(escape(atob(str))); }
// //   catch { return str; }
// // };

// // const getHeaders = () => {
// //   const h = { 'Content-Type': 'application/json' };
// //   if (RAPID_KEY) {
// //     h['x-rapidapi-key']  = RAPID_KEY;
// //     h['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
// //   }
// //   return h;
// // };

// // const ensureConfig = () => {
// //   if (!JUDGE0_BASE) throw new Error('VITE_COMPILER_API_URL not set in .env');
// // };

// // // ─────────────────────────────────────────────────────────────
// // // ARG PARSING UTILITIES
// // // ─────────────────────────────────────────────────────────────

// // /**
// //  * Split top-level comma-separated arguments respecting:
// //  *   - Quoted strings (no splitting inside "hello, world")
// //  *   - Nested arrays  (no splitting inside [1,[2,3]])
// //  *   - Char literals  ('a', 'b')
// //  */
// // const splitTopLevelArgs = (s) => {
// //   const args = [];
// //   let depth = 0, cur = '', inStr = false, strChar = '';
// //   for (let i = 0; i < s.length; i++) {
// //     const c = s[i];
// //     if (!inStr && (c === '"' || c === "'")) { inStr = true; strChar = c; cur += c; continue; }
// //     if (inStr && c === strChar && s[i - 1] !== '\\') { inStr = false; cur += c; continue; }
// //     if (inStr) { cur += c; continue; }
// //     if (c === '[' || c === '(') { depth++; cur += c; continue; }
// //     if (c === ']' || c === ')') { depth--; cur += c; continue; }
// //     if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
// //     cur += c;
// //   }
// //   if (cur.trim()) args.push(cur.trim());
// //   return args;
// // };

// // /** Detect element type from array inner content */
// // const detectArrayElementType = (inner) => {
// //   const s = inner.trim();
// //   if (!s) return 'int';
// //   if (s.startsWith('[')) return 'nested';
// //   const items = splitTopLevelArgs(s);
// //   const first = (items[0] || '').trim();
// //   if (first.startsWith('"'))                       return 'string';
// //   if (first.startsWith("'") && first.length === 3) return 'char';
// //   if (first === 'true' || first === 'false')        return 'bool';
// //   if (first.match(/^-?\d+\.\d+$/))                 return 'double';
// //   return 'int';
// // };

// // /** Count top-level elements (for C size injection) */
// // const countArrayElements = (inner) => {
// //   if (!inner.trim()) return 0;
// //   return splitTopLevelArgs(inner).length;
// // };

// // // ─────────────────────────────────────────────────────────────
// // // JAVA TRANSFORMER
// // // ─────────────────────────────────────────────────────────────
// // const transformJavaArg = (arg) => {
// //   const a = arg.trim();
// //   if (!a) return a;
// //   if (a.startsWith('[') && a.endsWith(']')) {
// //     const inner = a.slice(1, -1).trim();
// //     if (!inner) return 'new int[]{}';
// //     const type = detectArrayElementType(inner);
// //     if (type === 'nested') {
// //       const rows = splitTopLevelArgs(inner);
// //       const converted = rows.map(r => {
// //         const t = r.trim();
// //         return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
// //       });
// //       return `new int[][]{ ${converted.join(', ')} }`;
// //     }
// //     if (type === 'string') return `new String[]{${inner}}`;
// //     if (type === 'char')   return `new char[]{${inner}}`;
// //     if (type === 'bool')   return `new boolean[]{${inner}}`;
// //     if (type === 'double') return `new double[]{${inner}}`;
// //     return `new int[]{${inner}}`;
// //   }
// //   // Single-quoted multi-char → Java String
// //   if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;
// //   return a;
// // };

// // const transformArgsForJava = (inputArgs) => {
// //   if (!inputArgs || !inputArgs.trim()) return '';
// //   return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
// // };

// // // ─────────────────────────────────────────────────────────────
// // // C++ TRANSFORMER — Named variables to fix rvalue reference error
// // // Returns { decls: string[], callArgs: string[] }
// // // ─────────────────────────────────────────────────────────────
// // const buildCppNamedVars = (inputArgs) => {
// //   if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
// //   const args = splitTopLevelArgs(inputArgs);
// //   const decls = [], callArgs = [];
// //   args.forEach((arg, i) => {
// //     const a = arg.trim();
// //     if (a.startsWith('[') && a.endsWith(']')) {
// //       const inner = a.slice(1, -1).trim();
// //       const type  = detectArrayElementType(inner);
// //       const name  = `_a${i}`;
// //       if (!inner) { decls.push(`vector<int> ${name} = {};`); callArgs.push(name); return; }
// //       if (type === 'nested') {
// //         const rows = splitTopLevelArgs(inner);
// //         const cv = rows.map(r => {
// //           const t = r.trim();
// //           return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
// //         });
// //         decls.push(`vector<vector<int>> ${name} = {${cv.join(', ')}};`);
// //         callArgs.push(name); return;
// //       }
// //       const cppType = { string:'vector<string>', char:'vector<char>', bool:'vector<bool>', double:'vector<double>', int:'vector<int>' }[type] || 'vector<int>';
// //       decls.push(`${cppType} ${name} = {${inner}};`);
// //       callArgs.push(name);
// //     } else {
// //       callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
// //     }
// //   });
// //   return { decls, callArgs };
// // };

// // // ─────────────────────────────────────────────────────────────
// // // C TRANSFORMER — Compound literals + size injection
// // // ─────────────────────────────────────────────────────────────
// // const transformArgsForC = (inputArgs) => {
// //   if (!inputArgs || !inputArgs.trim()) return '&returnSize';
// //   const args = splitTopLevelArgs(inputArgs);
// //   const result = [];
// //   args.forEach(arg => {
// //     const a = arg.trim();
// //     if (a.startsWith('[') && a.endsWith(']')) {
// //       const inner = a.slice(1, -1).trim();
// //       result.push(`(int[]){${inner}}`);
// //       result.push(String(countArrayElements(inner)));
// //     } else {
// //       result.push(a);
// //     }
// //   });
// //   result.push('&returnSize');
// //   return result.join(', ');
// // };

// // const transformArgsForPython = (inputArgs) => inputArgs || '';
// // const transformArgsForJs     = (inputArgs) => (inputArgs || '').replace(/'/g, '"');

// // // ─────────────────────────────────────────────────────────────
// // // LANGUAGE WRAPPERS
// // // ─────────────────────────────────────────────────────────────
// // const WRAPPERS = {

// //   // ── Python ─────────────────────────────────────────────────
// //   python: (userCode, inputArgs, methodName) => {
// //     const args = transformArgsForPython(inputArgs);
// //     return `import sys
// // from typing import List, Dict, Optional, Tuple, Set, Any, Union
// // from collections import defaultdict, deque, Counter, OrderedDict
// // import heapq, math, itertools, functools, bisect, re, string

// // ${userCode}

// // if __name__ == "__main__":
// //     try:
// //         _sol = Solution()
// //         _result = _sol.${methodName}(${args})
// //         def _fmt(v):
// //             if isinstance(v, list): return "[" + ",".join(_fmt(x) for x in v) + "]"
// //             if isinstance(v, bool): return "true" if v else "false"
// //             if v is None: return "null"
// //             if isinstance(v, str): return v
// //             return str(v)
// //         print(_fmt(_result))
// //     except Exception as _e:
// //         print(f"Error: {_e}", file=sys.stderr)`;
// //   },

// //   // ── JavaScript ─────────────────────────────────────────────
// //   // Supports ALL styles with nested try-catch for robust detection:
// //   //   class Solution { twoSum(...) }     → class style
// //   //   function twoSum(...) {}             → function declaration
// //   //   var/let/const twoSum = function(){} → variable assignment
// //   //   const twoSum = (...) => {}          → arrow function
// //   javascript: (userCode, inputArgs, methodName) => {
// //     const args = transformArgsForJs(inputArgs);
// //     return `${userCode}

// // (function () {
// //   try {
// //     let _result;
// //     let _called = false;

// //     // Attempt 1: class Solution { ${methodName}() {} }
// //     try {
// //       if (typeof Solution !== "undefined") {
// //         const _sol = new Solution();
// //         if (typeof _sol["${methodName}"] === "function") {
// //           _result = _sol["${methodName}"](${args});
// //           _called = true;
// //         }
// //       }
// //     } catch (_ignore) { /* class not in scope or has no method, try function */ }

// //     // Attempt 2: standalone function ${methodName}(...) or var ${methodName} = ...
// //     if (!_called) {
// //       try {
// //         if (typeof ${methodName} !== "undefined" && typeof ${methodName} === "function") {
// //           _result = ${methodName}(${args});
// //           _called = true;
// //         }
// //       } catch (_ignore2) { /* not a function */ }
// //     }

// //     if (!_called) {
// //       throw new Error("Solution not found. Write either:\\n  class Solution { ${methodName}(...) { } }\\nor:\\n  function ${methodName}(...) { }");
// //     }

// //     function _fmt(v) {
// //       if (Array.isArray(v)) return "[" + v.map(_fmt).join(",") + "]";
// //       if (v === null || v === undefined) return "null";
// //       if (typeof v === "boolean") return v ? "true" : "false";
// //       return String(v);
// //     }
// //     console.log(_fmt(_result));
// //   } catch (e) {
// //     process.stderr.write("Error: " + e.message + "\\n");
// //   }
// // })();`;
// //   },

// //   // ── Java ───────────────────────────────────────────────────
// //   java: (userCode, inputArgs, methodName) => {
// //     const args = transformArgsForJava(inputArgs);
// //     return `import java.util.*;
// // import java.util.stream.*;

// // ${userCode}

// // class Main {
// //     public static void main(String[] args) {
// //         try {
// //             Solution sol = new Solution();
// //             Object result = sol.${methodName}(${args});
// //             System.out.println(fmt(result));
// //         } catch (Exception e) {
// //             System.err.println("Error: " + e.getMessage());
// //         }
// //     }
// //     static String fmt(Object r) {
// //         if (r == null) return "null";
// //         if (r instanceof boolean[]) {
// //             boolean[] a = (boolean[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof int[]) {
// //             int[] a = (int[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof long[]) {
// //             long[] a = (long[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof double[]) {
// //             double[] a = (double[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof char[]) {
// //             char[] a = (char[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof String[]) {
// //             String[] a = (String[]) r; StringBuilder sb = new StringBuilder("[");
// //             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
// //             return sb.append("]").toString();
// //         }
// //         if (r instanceof List) {
// //             return ((List<?>) r).stream().map(Main::fmt).collect(Collectors.joining(",", "[", "]"));
// //         }
// //         if (r instanceof Boolean) return (Boolean) r ? "true" : "false";
// //         return r.toString();
// //     }
// // }`;
// //   },

// //   // ── C++ ────────────────────────────────────────────────────
// //   // Fix 1 (rvalue ref): named variable declarations before call.
// //   // Fix 2 (C++17 features): overloaded _print::out() — C++14 compatible.
// //   cpp: (userCode, inputArgs, methodName) => {
// //     const { decls, callArgs } = buildCppNamedVars(inputArgs);
// //     // Build the declaration block — each decl on its own line, indented
// //     const declBlock = decls.map(d => `    ${d}`).join('\n');
// //     const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;

// //     return `#include <bits/stdc++.h>
// // using namespace std;

// // ${userCode}

// // // C++14-compatible output helpers
// // // No if constexpr, no is_same_v, no requires — works on gcc-9 default
// // namespace _print {
// //     void out(int v)               { cout << v; }
// //     void out(long v)              { cout << v; }
// //     void out(long long v)         { cout << v; }
// //     void out(unsigned int v)      { cout << v; }
// //     void out(unsigned long v)     { cout << v; }
// //     void out(unsigned long long v){ cout << v; }
// //     void out(double v)            { cout << v; }
// //     void out(float v)             { cout << v; }
// //     void out(bool v)              { cout << (v ? "true" : "false"); }
// //     void out(char v)              { cout << v; }
// //     void out(const string& v)     { cout << v; }
// //     void out(const char* v)       { cout << v; }
// //     // 1-D vector
// //     template<typename T>
// //     void out(const vector<T>& v) {
// //         cout << "[";
// //         for (size_t i = 0; i < v.size(); i++) {
// //             if (i) cout << ",";
// //             out(v[i]);
// //         }
// //         cout << "]";
// //     }
// //     // 2-D vector
// //     template<typename T>
// //     void out(const vector<vector<T>>& v) {
// //         cout << "[";
// //         for (size_t i = 0; i < v.size(); i++) {
// //             if (i) cout << ",";
// //             out(v[i]);
// //         }
// //         cout << "]";
// //     }
// //     // pair
// //     template<typename A, typename B>
// //     void out(const pair<A,B>& p) {
// //         cout << "["; out(p.first); cout << ","; out(p.second); cout << "]";
// //     }
// // }

// // int main() {
// //     ios_base::sync_with_stdio(false);
// //     cin.tie(NULL);
// //     Solution sol;
// // ${declBlock}
// //     auto result = ${callExpr};
// //     _print::out(result);
// //     cout << endl;
// //     return 0;
// // }`;
// //   },

// //   // ── C ──────────────────────────────────────────────────────
// //   // Compound literals (int[]){...} + auto-injected array sizes
// //   c: (userCode, inputArgs, methodName) => {
// //     const args = transformArgsForC(inputArgs);
// //     return `#include <stdio.h>
// // #include <stdlib.h>
// // #include <string.h>
// // #include <stdbool.h>

// // ${userCode}

// // int main() {
// //     int returnSize = 0;
// //     int* result = ${methodName}(${args});
// //     if (result == NULL || returnSize == 0) { printf("null\\n"); return 0; }
// //     printf("[");
// //     for (int i = 0; i < returnSize; i++) { if (i) printf(","); printf("%d", result[i]); }
// //     printf("]\\n");
// //     if (result) free(result);
// //     return 0;
// // }`;
// //   },
// // };

// // // ─────────────────────────────────────────────────────────────
// // // Normalise output for comparison
// // // ─────────────────────────────────────────────────────────────
// // const normalise = (raw) => {
// //   if (!raw && raw !== 0) return '';
// //   return String(raw)
// //     .trim()
// //     .replace(/\s+/g,  '')
// //     .replace(/True/g,  'true')
// //     .replace(/False/g, 'false')
// //     .replace(/None/g,  'null')
// //     .toLowerCase();
// // };

// // // ─────────────────────────────────────────────────────────────
// // // POST to Judge0
// // // ─────────────────────────────────────────────────────────────
// // const _submit = async (sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb) => {
// //   ensureConfig();
// //   const url = `${JUDGE0_BASE}/submissions?base64_encoded=true&wait=true`;
// //   const res = await fetch(url, {
// //     method: 'POST',
// //     headers: getHeaders(),
// //     body: JSON.stringify({
// //       source_code:    encode(sourceCode),
// //       language_id:    languageId,
// //       stdin:          encode(stdin),
// //       cpu_time_limit: timeLimitMs / 1000,
// //       memory_limit:   memoryLimitKb,
// //       stack_limit:    64000,
// //       enable_network: false,
// //     }),
// //   });
// //   if (!res.ok) {
// //     const text = await res.text();
// //     if (res.status === 403) throw new Error('Judge0: Quota exceeded or not subscribed.');
// //     if (res.status === 401) throw new Error('Judge0: Invalid API key.');
// //     throw new Error(`Compiler API error ${res.status}: ${text}`);
// //   }
// //   let data = await res.json();
// //   if (data.status?.id <= 2 && data.token) data = await _pollRaw(data.token);
// //   return data;
// // };

// // // ─────────────────────────────────────────────────────────────
// // // executeCode — raw execution (custom Run button, no wrapper)
// // // ─────────────────────────────────────────────────────────────
// // export const executeCode = async (
// //   language,
// //   sourceCode,
// //   stdin         = '',
// //   timeLimitMs   = 2000,
// //   memoryLimitKb = 128000,
// // ) => {
// //   const languageId = LANGUAGE_IDS[language];
// //   if (!languageId) throw new Error(`Unsupported language: ${language}`);
// //   const raw = await _submit(sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb);
// //   return _normalizeResult(raw);
// // };

// // // ─────────────────────────────────────────────────────────────
// // // runWithTestCases — LeetCode-style wrapped execution
// // // ─────────────────────────────────────────────────────────────
// // export const runWithTestCases = async (
// //   language,
// //   sourceCode,
// //   question,
// //   options = {},
// // ) => {
// //   ensureConfig();
// //   const languageId = LANGUAGE_IDS[language];
// //   if (!languageId) throw new Error(`Unsupported language: ${language}`);

// //   const { memoryLimitKb = 128000 } = options;
// //   const testCases  = (question?.testCases || []).filter(tc => (tc.input || '').trim() || (tc.expectedOutput || '').trim());
// //   const methodName = question?.methodName  || 'solution';
// //   const timeLimit  = question?.timeLimitMs || 2000;
// //   const wrapFn     = WRAPPERS[language];

// //   const hasHiddenFlags = testCases.some(tc => tc.isHidden === true);
// //   const isVisible = (tc, idx) => hasHiddenFlags ? !tc.isHidden : idx < 3;

// //   if (!testCases.length) {
// //     const r = await executeCode(language, sourceCode, '', timeLimit, memoryLimitKb);
// //     return { results: [], passedCount: 0, totalCount: 0, allPassed: false, visiblePassed: 0, visibleTotal: 0, rawResult: r, noTestCases: true };
// //   }

// //   const runOne = async (tc, idx) => {
// //     const visible = isVisible(tc, idx);
// //     let finalCode = sourceCode;
// //     if (wrapFn && methodName) {
// //       try { finalCode = wrapFn(sourceCode, tc.input || '', methodName); } catch (_) { finalCode = sourceCode; }
// //     }
// //     let raw;
// //     try {
// //       raw = await _submit(finalCode, languageId, '', timeLimit, memoryLimitKb);
// //     } catch (err) {
// //       return {
// //         caseIndex: idx, isVisible: visible,
// //         input: visible ? tc.input : null,
// //         expectedOutput: visible ? (tc.expectedOutput || '').trim() : null,
// //         actualOutput: null, passed: false,
// //         statusId: 13, statusLabel: 'Network Error', statusColor: '#6b7280',
// //         error: err.message, time: null, memory: null,
// //       };
// //     }
// //     const stdout     = decode(raw.stdout)?.trim()         || '';
// //     const stderr     = decode(raw.stderr)?.trim()         || '';
// //     const compileErr = decode(raw.compile_output)?.trim() || '';
// //     const expected   = (tc.expectedOutput || '').toString().trim();
// //     const passed     = raw.status?.id === 3 && normalise(stdout) === normalise(expected);
// //     const det        = getStatusDetails(raw.status?.id);
// //     return {
// //       caseIndex:      idx,
// //       isVisible:      visible,
// //       input:          visible ? tc.input : null,
// //       expectedOutput: visible ? expected  : null,
// //       actualOutput:   visible ? stdout    : (passed ? '✓' : '✗'),
// //       passed,
// //       statusId:       raw.status?.id,
// //       statusLabel:    raw.status?.description || det.label,
// //       statusColor:    det.color,
// //       time:           raw.time,
// //       memory:         raw.memory,
// //       error:          (compileErr || stderr) || null,
// //     };
// //   };

// //   const results = [];
// //   for (let i = 0; i < testCases.length; i++) {
// //     results.push(await runOne(testCases[i], i));
// //     if (i < testCases.length - 1) await new Promise(r => setTimeout(r, 250));
// //   }

// //   const passedCount   = results.filter(r => r.passed).length;
// //   const visibleCases  = results.filter(r => r.isVisible);
// //   const visiblePassed = visibleCases.filter(r => r.passed).length;
// //   const firstFailure  = results.find(r => !r.passed && r.isVisible) || results.find(r => !r.passed) || null;

// //   return { results, passedCount, totalCount: testCases.length, allPassed: passedCount === testCases.length, visiblePassed, visibleTotal: visibleCases.length, firstFailure };
// // };

// // const _pollRaw = async (token, max = 12) => {
// //   const url = `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true`;
// //   for (let i = 0; i < max; i++) {
// //     await new Promise(r => setTimeout(r, 700));
// //     try {
// //       const res  = await fetch(url, { headers: getHeaders() });
// //       const data = await res.json();
// //       if (data.status?.id >= 3) return data;
// //     } catch {}
// //   }
// //   return { status: { id: 13, description: 'Timeout' }, stdout: null, stderr: 'Execution timed out', compile_output: null };
// // };

// // const _normalizeResult = (data) => ({
// //   stdout:         decode(data.stdout),
// //   stderr:         decode(data.stderr),
// //   compile_output: decode(data.compile_output),
// //   message:        decode(data.message),
// //   time:           data.time,
// //   memory:         data.memory,
// //   status:         data.status,
// // });

// // export const getStatusDetails = (id) => ({
// //   1:  { label: 'In Queue',                color: '#8b949e' },
// //   2:  { label: 'Processing',              color: '#58a6ff' },
// //   3:  { label: 'Accepted',                color: '#22c55e' },
// //   4:  { label: 'Wrong Answer',            color: '#ef4444' },
// //   5:  { label: 'Time Limit Exceeded',     color: '#f59e0b' },
// //   6:  { label: 'Compilation Error',       color: '#ef4444' },
// //   7:  { label: 'Runtime Error (SIGSEGV)', color: '#ef4444' },
// //   8:  { label: 'Runtime Error (SIGXFSZ)', color: '#ef4444' },
// //   9:  { label: 'Runtime Error (SIGFPE)',  color: '#ef4444' },
// //   10: { label: 'Runtime Error (SIGABRT)', color: '#ef4444' },
// //   11: { label: 'Runtime Error (NZEC)',    color: '#ef4444' },
// //   12: { label: 'Runtime Error (Other)',   color: '#ef4444' },
// //   13: { label: 'Internal Error',          color: '#6b7280' },
// //   14: { label: 'Exec Format Error',       color: '#6b7280' },
// // }[id] || { label: 'Unknown', color: '#6b7280' });

// // /**
// //  * Preview how inputArgs transforms in each language.
// //  * Useful in QuestionForm for faculty validation.
// //  */
// // export const previewInputTransform = (inputArgs) => {
// //   const { decls, callArgs } = buildCppNamedVars(inputArgs);
// //   return {
// //     python:     transformArgsForPython(inputArgs),
// //     javascript: transformArgsForJs(inputArgs),
// //     java:       transformArgsForJava(inputArgs),
// //     cpp:        decls.length ? `${decls.join('\n')} → call: (${callArgs.join(', ')})` : `(${callArgs.join(', ')})`,
// //     c:          transformArgsForC(inputArgs),
// //   };
// // };


































// // ============================================================
// // src/api/compilerService.js  —  Mind Code Platform
// //
// // .env MUST have:
// //   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
// //
// // ╔══════════════════════════════════════════════════════════╗
// // ║  COMPLETE LEETCODE-STYLE I/O SUPPORT — ALL TYPES        ║
// // ╠══════════════════════════════════════════════════════════╣
// // ║  Primitives:  int, long, float/double, bool, char,      ║
// // ║               string, null/None/nullptr                 ║
// // ║  1-D arrays:  int[], string[], double[], bool[], char[] ║
// // ║  2-D arrays:  int[][], string[][], etc.                 ║
// // ║  Linked List: [1,2,3] → ListNode chain                  ║
// // ║  Binary Tree: [1,2,3,null,4] → TreeNode BFS build       ║
// // ║  Matrix:      [[1,2],[3,4]] → 2D grid                   ║
// // ║  Tuple/Pair:  [val1, val2] (two-element returns)        ║
// // ║  Multi-arg:   array, int | array, array | any combo     ║
// // ║  Return types: same as input + void (in-place modify)   ║
// // ╚══════════════════════════════════════════════════════════╝
// //
// // HOW IT WORKS:
// //   1. Faculty sets methodName + testCases (Python-style input)
// //   2. Student writes only the Solution class body
// //   3. runWithTestCases() wraps code with drivers per language
// //   4. normalise() handles spacing/case/format differences
// //
// // OUTPUT NORMALISATION handles:
// //   [0, 1] == [0,1]  |  True == true  |  None == null
// //   "hello" == hello  |  1.0 == 1  |  -0 == 0
// // ============================================================

// const JUDGE0_BASE = (import.meta.env.VITE_COMPILER_API_URL || '').replace(/\/+$/, '');
// const RAPID_KEY   = import.meta.env.VITE_COMPILER_API_KEY;

// export const LANGUAGE_IDS = {
//   python:     71,
//   javascript: 93,
//   c:          50,
//   cpp:        54,
//   java:       62,
// };

// const encode = (str) => {
//   if (!str && str !== 0) return '';
//   try { return btoa(unescape(encodeURIComponent(String(str)))); }
//   catch { return btoa(String(str)); }
// };
// const decode = (str) => {
//   if (!str) return '';
//   try { return decodeURIComponent(escape(atob(str))); }
//   catch { return str; }
// };

// const getHeaders = () => {
//   const h = { 'Content-Type': 'application/json' };
//   if (RAPID_KEY) {
//     h['x-rapidapi-key']  = RAPID_KEY;
//     h['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
//   }
//   return h;
// };

// const ensureConfig = () => {
//   if (!JUDGE0_BASE) throw new Error('VITE_COMPILER_API_URL not set in .env');
// };

// // ─────────────────────────────────────────────────────────────
// // ARG PARSING UTILITIES
// // ─────────────────────────────────────────────────────────────

// /**
//  * Split top-level comma-separated arguments.
//  * Respects: quoted strings, nested arrays [], nested parens (),
//  *           nested braces {}, char literals 'x'
//  *
//  * Examples:
//  *   "[1,2,3], 9"          → ["[1,2,3]", "9"]
//  *   "[1,2], [3,4]"        → ["[1,2]", "[3,4]"]
//  *   "[[1,2],[3,4]], true" → ["[[1,2],[3,4]]", "true"]
//  *   '"hello, world", 3'   → ['"hello, world"', "3"]
//  */
// const splitTopLevelArgs = (s) => {
//   if (!s || !s.trim()) return [];
//   const args = [];
//   let depth = 0, cur = '', inStr = false, strChar = '';
//   for (let i = 0; i < s.length; i++) {
//     const c = s[i];
//     // String handling
//     if (!inStr && (c === '"' || c === "'")) {
//       // detect char literal like 'a' vs start of multi-char
//       inStr = true; strChar = c; cur += c; continue;
//     }
//     if (inStr && c === strChar && s[i - 1] !== '\\') {
//       inStr = false; cur += c; continue;
//     }
//     if (inStr) { cur += c; continue; }
//     // Depth tracking
//     if (c === '[' || c === '(' || c === '{') { depth++; cur += c; continue; }
//     if (c === ']' || c === ')' || c === '}') { depth--; cur += c; continue; }
//     // Split on top-level commas
//     if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
//     cur += c;
//   }
//   if (cur.trim()) args.push(cur.trim());
//   return args;
// };

// /**
//  * Detect the value type of a single argument string.
//  * Returns one of: 'null', 'bool', 'int', 'long', 'double', 'char',
//  *                 'string', 'array', 'matrix', 'linkedlist_hint', 'tree_hint'
//  *
//  * NOTE: linkedlist_hint and tree_hint are detected by context/metadata,
//  *       not purely from the value. The value [1,2,3] is just an array —
//  *       the faculty's question type metadata tells us it's a linked list.
//  *       So at this layer we return 'array' or 'matrix' and let the
//  *       language wrappers decide how to build the structure.
//  */
// const detectType = (val) => {
//   const v = val.trim();
//   if (v === 'null' || v === 'None' || v === 'nullptr' || v === 'NULL') return 'null';
//   if (v === 'true' || v === 'false' || v === 'True' || v === 'False') return 'bool';
//   if (v.startsWith('"') && v.endsWith('"')) return 'string';
//   if (v.startsWith("'") && v.endsWith("'") && v.length === 3) return 'char';
//   if (v.startsWith("'") && v.endsWith("'") && v.length > 3) return 'string'; // multi-char quoted → string
//   if (v.startsWith('[') && v.endsWith(']')) {
//     // Check if it's a 2-D matrix: inner elements start with '['
//     const inner = v.slice(1, -1).trim();
//     if (!inner) return 'array'; // empty array
//     const firstItem = splitTopLevelArgs(inner)[0] || '';
//     if (firstItem.trim().startsWith('[')) return 'matrix';
//     return 'array';
//   }
//   if (v.match(/^-?\d+\.\d+([eE][+-]?\d+)?$/)) return 'double';
//   if (v.match(/^-?\d+[lL]$/) || (v.match(/^-?\d+$/) && (parseInt(v) > 2147483647 || parseInt(v) < -2147483648))) return 'long';
//   if (v.match(/^-?\d+$/)) return 'int';
//   return 'string'; // fallback — unquoted strings like variable names
// };

// /**
//  * Detect the element type inside an array's inner content string.
//  * inner = content between outer brackets, e.g. "1,2,3" or '"a","b"'
//  */
// const detectArrayElementType = (inner) => {
//   const s = inner.trim();
//   if (!s) return 'int';
//   if (s.startsWith('[')) return 'nested'; // 2-D
//   const items = splitTopLevelArgs(s);
//   const first = (items[0] || '').trim();
//   if (!first) return 'int';
//   if (first.startsWith('"'))                                  return 'string';
//   if (first.startsWith("'") && first.length === 3)            return 'char';
//   if (first === 'true' || first === 'false')                   return 'bool';
//   if (first === 'null' || first === 'None')                    return 'null_elem'; // array of nullables
//   if (first.match(/^-?\d+\.\d+$/))                            return 'double';
//   if (first.match(/^-?\d+[lL]$/))                             return 'long';
//   return 'int';
// };

// /** Count top-level elements inside array brackets (for C size) */
// const countArrayElements = (inner) => {
//   if (!inner || !inner.trim()) return 0;
//   return splitTopLevelArgs(inner).length;
// };

// // ─────────────────────────────────────────────────────────────
// // PYTHON WRAPPER
// // Handles ALL types natively — Python is dynamically typed.
// // Linked lists and trees are built with helper classes injected
// // into the driver code.
// // ─────────────────────────────────────────────────────────────
// const PYTHON_HELPERS = `
// # ── Data structure helpers ───────────────────────────────────
// class ListNode:
//     def __init__(self, val=0, next=None):
//         self.val = val
//         self.next = next

// class TreeNode:
//     def __init__(self, val=0, left=None, right=None):
//         self.val = val
//         self.left = left
//         self.right = right

// def _build_linked_list(arr):
//     if not arr: return None
//     head = ListNode(arr[0])
//     cur = head
//     for v in arr[1:]:
//         cur.next = ListNode(v)
//         cur = cur.next
//     return head

// def _linked_list_to_list(node):
//     result, seen = [], set()
//     while node and id(node) not in seen:
//         seen.add(id(node))
//         result.append(node.val)
//         node = node.next
//     return result

// def _build_tree(arr):
//     if not arr or arr[0] is None: return None
//     root = TreeNode(arr[0])
//     queue = [root]
//     i = 1
//     while queue and i < len(arr):
//         node = queue.pop(0)
//         if i < len(arr) and arr[i] is not None:
//             node.left = TreeNode(arr[i])
//             queue.append(node.left)
//         i += 1
//         if i < len(arr) and arr[i] is not None:
//             node.right = TreeNode(arr[i])
//             queue.append(node.right)
//         i += 1
//     return root

// def _tree_to_list(root):
//     if not root: return []
//     result, queue = [], [root]
//     while queue:
//         node = queue.pop(0)
//         if node:
//             result.append(node.val)
//             queue.append(node.left)
//             queue.append(node.right)
//         else:
//             result.append(None)
//     while result and result[-1] is None:
//         result.pop()
//     return result

// def _fmt(v):
//     if isinstance(v, ListNode): return _fmt(_linked_list_to_list(v))
//     if isinstance(v, TreeNode): return _fmt(_tree_to_list(v))
//     if isinstance(v, list):
//         return "[" + ",".join(_fmt(x) for x in v) + "]"
//     if isinstance(v, tuple):
//         return "[" + ",".join(_fmt(x) for x in v) + "]"
//     if isinstance(v, bool):  return "true" if v else "false"
//     if v is None:            return "null"
//     if isinstance(v, str):   return v
//     if isinstance(v, float):
//         # normalise: 1.0 → "1.0", but keep precision for non-integers
//         if v == int(v) and abs(v) < 1e15: return str(int(v))
//         return str(v)
//     return str(v)
// # ─────────────────────────────────────────────────────────────
// `;

// const buildPythonWrapper = (userCode, inputArgs, methodName) => {
//   const args = inputArgs || '';
//   return `import sys
// from typing import List, Dict, Optional, Tuple, Set, Any, Union
// from collections import defaultdict, deque, Counter, OrderedDict
// import heapq, math, itertools, functools, bisect, re, string, json
// ${PYTHON_HELPERS}
// ${userCode}

// if __name__ == "__main__":
//     try:
//         _sol = Solution()
//         _result = _sol.${methodName}(${args})
//         # If result is None (void / in-place), try to print the first arg if it's a list
//         if _result is None:
//             _first_arg = None
//             try:
//                 _first_arg = (${args || 'None'},)[0] if '${args}' else None
//             except Exception:
//                 pass
//             if isinstance(_first_arg, list):
//                 print(_fmt(_first_arg))
//             else:
//                 print("null")
//         else:
//             print(_fmt(_result))
//     except Exception as _e:
//         print(f"Error: {_e}", file=sys.stderr)
//         import traceback
//         traceback.print_exc(file=sys.stderr)
// `;
// };

// // ─────────────────────────────────────────────────────────────
// // JAVASCRIPT WRAPPER
// // ─────────────────────────────────────────────────────────────
// const JS_HELPERS = `
// // ── Data structure helpers ────────────────────────────────────
// function ListNode(val, next) { this.val = (val===undefined?0:val); this.next = (next===undefined?null:next); }
// function TreeNode(val, left, right) { this.val = (val===undefined?0:val); this.left = (left===undefined?null:left); this.right = (right===undefined?null:right); }

// function _buildLinkedList(arr) {
//   if (!arr || !arr.length) return null;
//   let head = new ListNode(arr[0]), cur = head;
//   for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
//   return head;
// }
// function _linkedListToArr(node) {
//   const r = [], seen = new Set();
//   while (node && !seen.has(node)) { seen.add(node); r.push(node.val); node = node.next; }
//   return r;
// }
// function _buildTree(arr) {
//   if (!arr || !arr.length || arr[0] === null) return null;
//   const root = new TreeNode(arr[0]), queue = [root];
//   let i = 1;
//   while (queue.length && i < arr.length) {
//     const node = queue.shift();
//     if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
//     i++;
//     if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
//     i++;
//   }
//   return root;
// }
// function _treeToArr(root) {
//   if (!root) return [];
//   const result = [], queue = [root];
//   while (queue.length) {
//     const node = queue.shift();
//     if (node) { result.push(node.val); queue.push(node.left); queue.push(node.right); }
//     else { result.push(null); }
//   }
//   while (result.length && result[result.length-1] === null) result.pop();
//   return result;
// }
// function _fmt(v) {
//   if (v instanceof ListNode) return _fmt(_linkedListToArr(v));
//   if (v instanceof TreeNode) return _fmt(_treeToArr(v));
//   if (Array.isArray(v)) return "[" + v.map(_fmt).join(",") + "]";
//   if (v === null || v === undefined) return "null";
//   if (typeof v === "boolean") return v ? "true" : "false";
//   if (typeof v === "number") {
//     if (Number.isInteger(v)) return String(v);
//     return String(v);
//   }
//   return String(v);
// }
// `;

// const buildJsWrapper = (userCode, inputArgs, methodName) => {
//   const args = (inputArgs || '').replace(/'/g, '"');
//   return `${JS_HELPERS}
// ${userCode}

// (function () {
//   try {
//     let _result;
//     let _called = false;

//     // Attempt 1: class Solution { ${methodName}() {} }
//     try {
//       if (typeof Solution !== "undefined") {
//         const _sol = new Solution();
//         if (typeof _sol["${methodName}"] === "function") {
//           _result = _sol["${methodName}"](${args});
//           _called = true;
//         }
//       }
//     } catch (_ignore) {}

//     // Attempt 2: standalone function or arrow/var
//     if (!_called) {
//       try {
//         if (typeof ${methodName} !== "undefined" && typeof ${methodName} === "function") {
//           _result = ${methodName}(${args});
//           _called = true;
//         }
//       } catch (_ignore2) {}
//     }

//     if (!_called) {
//       throw new Error("Solution not found. Write: class Solution { ${methodName}(...) { } } or function ${methodName}(...) { }");
//     }

//     // void / in-place: try printing first arg if array
//     if (_result === undefined || _result === null) {
//       const _firstArgVal = (function(){ try { return (${args || 'undefined'}, [${args || ''}])[0]; } catch(_){ return undefined; } })();
//       if (Array.isArray(_firstArgVal)) { console.log(_fmt(_firstArgVal)); }
//       else { console.log("null"); }
//     } else {
//       console.log(_fmt(_result));
//     }
//   } catch (e) {
//     process.stderr.write("Error: " + e.message + "\\n");
//   }
// })();
// `;
// };

// // ─────────────────────────────────────────────────────────────
// // JAVA TRANSFORMER + WRAPPER
// // ─────────────────────────────────────────────────────────────

// /**
//  * Transform a single argument from Python/JSON syntax → Java syntax.
//  * Handles: arrays, nested arrays, strings, chars, bools, nulls, numbers.
//  */
// const transformJavaArg = (arg) => {
//   const a = arg.trim();
//   if (!a) return a;

//   const t = detectType(a);

//   if (t === 'null') return 'null';
//   if (t === 'bool') return a === 'True' ? 'true' : a === 'False' ? 'false' : a;
//   if (t === 'char') return a; // 'x' is valid Java char literal

//   if (t === 'string') {
//     // Normalise quotes to double-quotes
//     if (a.startsWith("'") && a.endsWith("'")) return '"' + a.slice(1, -1) + '"';
//     return a;
//   }

//   if (t === 'matrix') {
//     const inner = a.slice(1, -1).trim();
//     const rows = splitTopLevelArgs(inner);
//     const converted = rows.map(r => {
//       const rt = r.trim();
//       if (rt.startsWith('[') && rt.endsWith(']')) {
//         const rowInner = rt.slice(1, -1).trim();
//         const elemType = detectArrayElementType(rowInner);
//         if (elemType === 'string') return `{${rowInner}}`;
//         if (elemType === 'bool')   return `{${rowInner}}`;
//         if (elemType === 'double') return `{${rowInner}}`;
//         return `{${rowInner}}`;
//       }
//       return rt;
//     });
//     return `new int[][]{ ${converted.join(', ')} }`;
//   }

//   if (t === 'array') {
//     const inner = a.slice(1, -1).trim();
//     if (!inner) return 'new int[]{}';
//     const elemType = detectArrayElementType(inner);
//     if (elemType === 'string')     return `new String[]{${inner}}`;
//     if (elemType === 'char')       return `new char[]{${inner}}`;
//     if (elemType === 'bool')       return `new boolean[]{${inner}}`;
//     if (elemType === 'double')     return `new double[]{${inner}}`;
//     if (elemType === 'long')       return `new long[]{${inner}}`;
//     if (elemType === 'null_elem')  return `new Integer[]{${inner.replace(/null/g, 'null')}}`;
//     return `new int[]{${inner}}`;
//   }

//   // Single-quoted multi-char string → Java String
//   if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;

//   return a;
// };

// const transformArgsForJava = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return '';
//   return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
// };

// const JAVA_HELPERS = `
//     // ── ListNode ──────────────────────────────────────────────
//     static class ListNode {
//         int val; ListNode next;
//         ListNode(int v) { val = v; }
//     }
//     static ListNode buildLinkedList(int[] arr) {
//         if (arr == null || arr.length == 0) return null;
//         ListNode head = new ListNode(arr[0]), cur = head;
//         for (int i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
//         return head;
//     }
//     static int[] linkedListToArray(ListNode head) {
//         java.util.List<Integer> r = new java.util.ArrayList<>();
//         java.util.Set<ListNode> seen = new java.util.HashSet<>();
//         while (head != null && !seen.contains(head)) { seen.add(head); r.add(head.val); head = head.next; }
//         return r.stream().mapToInt(Integer::intValue).toArray();
//     }
//     // ── TreeNode ──────────────────────────────────────────────
//     static class TreeNode {
//         int val; TreeNode left, right;
//         TreeNode(int v) { val = v; }
//     }
//     static TreeNode buildTree(Integer[] arr) {
//         if (arr == null || arr.length == 0 || arr[0] == null) return null;
//         TreeNode root = new TreeNode(arr[0]);
//         java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
//         q.add(root); int i = 1;
//         while (!q.isEmpty() && i < arr.length) {
//             TreeNode node = q.poll();
//             if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); q.add(node.left); } i++;
//             if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); q.add(node.right); } i++;
//         }
//         return root;
//     }
//     static String fmtTree(TreeNode root) {
//         if (root == null) return "[]";
//         java.util.List<String> r = new java.util.ArrayList<>();
//         java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
//         q.add(root);
//         while (!q.isEmpty()) {
//             TreeNode n = q.poll();
//             if (n != null) { r.add(String.valueOf(n.val)); q.add(n.left); q.add(n.right); }
//             else { r.add("null"); }
//         }
//         while (!r.isEmpty() && r.get(r.size()-1).equals("null")) r.remove(r.size()-1);
//         return "[" + String.join(",", r) + "]";
//     }
//     // ── Universal formatter ───────────────────────────────────
//     static String fmt(Object r) {
//         if (r == null) return "null";
//         if (r instanceof TreeNode)  return fmtTree((TreeNode) r);
//         if (r instanceof ListNode) {
//             int[] arr = linkedListToArray((ListNode) r);
//             StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < arr.length; i++) { if (i>0) sb.append(","); sb.append(arr[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof boolean[]) {
//             boolean[] a = (boolean[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof int[]) {
//             int[] a = (int[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof long[]) {
//             long[] a = (long[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof double[]) {
//             double[] a = (double[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof char[]) {
//             char[] a = (char[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof String[]) {
//             String[] a = (String[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof int[][]) {
//             int[][] a = (int[][]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append("[");
//                 for (int j = 0; j < a[i].length; j++) { if (j>0) sb.append(","); sb.append(a[i][j]); }
//                 sb.append("]"); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof char[][]) {
//             char[][] a = (char[][]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append("[");
//                 for (int j = 0; j < a[i].length; j++) { if (j>0) sb.append(","); sb.append(a[i][j]); }
//                 sb.append("]"); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof List) {
//             List<?> lst = (List<?>) r;
//             // Check if it's List<List<...>>
//             if (!lst.isEmpty() && lst.get(0) instanceof List) {
//                 StringBuilder sb = new StringBuilder("[");
//                 for (int i = 0; i < lst.size(); i++) { if (i>0) sb.append(","); sb.append(fmt(lst.get(i))); }
//                 return sb.append("]").toString();
//             }
//             return lst.stream().map(Main::fmt).collect(Collectors.joining(",", "[", "]"));
//         }
//         if (r instanceof Boolean) return (Boolean) r ? "true" : "false";
//         if (r instanceof Double) {
//             double d = (Double) r;
//             if (d == Math.floor(d) && !Double.isInfinite(d)) return String.valueOf((long)d);
//             return r.toString();
//         }
//         return r.toString();
//     }
// `;

// const buildJavaWrapper = (userCode, inputArgs, methodName) => {
//   const args = transformArgsForJava(inputArgs);
//   return `import java.util.*;
// import java.util.stream.*;

// ${userCode}

// class Main {
//     ${JAVA_HELPERS}
//     public static void main(String[] args) {
//         try {
//             Solution sol = new Solution();
//             Object result = sol.${methodName}(${args});
//             System.out.println(fmt(result));
//         } catch (Exception e) {
//             System.err.println("Error: " + e.getMessage());
//             e.printStackTrace(System.err);
//         }
//     }
// }
// `;
// };

// // ─────────────────────────────────────────────────────────────
// // C++ TRANSFORMER + WRAPPER
// // ─────────────────────────────────────────────────────────────

// /**
//  * Build named C++ variable declarations for all args.
//  * Returns { decls: string[], callArgs: string[] }
//  *
//  * Handles ALL types:
//  *   int, long long, double, bool, char, string,
//  *   vector<int/string/double/bool/char/long long>,
//  *   vector<vector<int>>, vector<vector<string>>
//  *   ListNode*, TreeNode*
//  */
// const buildCppNamedVars = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
//   const args = splitTopLevelArgs(inputArgs);
//   const decls = [], callArgs = [];

//   args.forEach((arg, i) => {
//     const a = arg.trim();
//     const t = detectType(a);
//     const name = `_a${i}`;

//     if (t === 'null') {
//       decls.push(`void* ${name} = nullptr;`);
//       callArgs.push('nullptr');
//       return;
//     }

//     if (t === 'bool') {
//       const bval = (a === 'true' || a === 'True') ? 'true' : 'false';
//       decls.push(`bool ${name} = ${bval};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'char') {
//       decls.push(`char ${name} = ${a};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'string') {
//       const sval = a.startsWith("'") ? '"' + a.slice(1, -1) + '"' : a;
//       decls.push(`string ${name} = ${sval};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'double') {
//       decls.push(`double ${name} = ${a};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'long') {
//       const lval = a.replace(/[lL]$/, '');
//       decls.push(`long long ${name} = ${lval}LL;`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'int') {
//       decls.push(`int ${name} = ${a};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'matrix') {
//       const inner = a.slice(1, -1).trim();
//       const rows = splitTopLevelArgs(inner);
//       const elemType = rows.length > 0 ? detectArrayElementType(rows[0].slice(1, -1)) : 'int';
//       const cppElem = { string: 'string', char: 'char', bool: 'bool', double: 'double', long: 'long long' }[elemType] || 'int';
//       const cv = rows.map(r => {
//         const rt = r.trim();
//         if (rt.startsWith('[') && rt.endsWith(']')) {
//           const rowInner = rt.slice(1, -1);
//           if (cppElem === 'string') {
//             return `{${rowInner}}`;
//           }
//           return `{${rowInner}}`;
//         }
//         return rt;
//       });
//       decls.push(`vector<vector<${cppElem}>> ${name} = {${cv.join(', ')}};`);
//       callArgs.push(name);
//       return;
//     }

//     if (t === 'array') {
//       const inner = a.slice(1, -1).trim();
//       if (!inner) { decls.push(`vector<int> ${name} = {};`); callArgs.push(name); return; }
//       const elemType = detectArrayElementType(inner);
//       const typeMap = {
//         string: 'vector<string>',
//         char:   'vector<char>',
//         bool:   'vector<bool>',
//         double: 'vector<double>',
//         long:   'vector<long long>',
//         nested: 'vector<vector<int>>',
//       };
//       const cppType = typeMap[elemType] || 'vector<int>';
//       decls.push(`${cppType} ${name} = {${inner}};`);
//       callArgs.push(name);
//       return;
//     }

//     // Fallback: pass as-is (unquoted string arg)
//     callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
//   });

//   return { decls, callArgs };
// };

// const CPP_HELPERS = `
// // ── ListNode ──────────────────────────────────────────────────
// struct ListNode {
//     int val; ListNode* next;
//     ListNode(int v = 0, ListNode* n = nullptr) : val(v), next(n) {}
// };
// ListNode* buildLinkedList(const vector<int>& arr) {
//     if (arr.empty()) return nullptr;
//     ListNode* head = new ListNode(arr[0]), *cur = head;
//     for (size_t i = 1; i < arr.size(); i++) { cur->next = new ListNode(arr[i]); cur = cur->next; }
//     return head;
// }
// // ── TreeNode ──────────────────────────────────────────────────
// struct TreeNode {
//     int val; TreeNode *left, *right;
//     TreeNode(int v = 0) : val(v), left(nullptr), right(nullptr) {}
// };
// TreeNode* buildTree(const vector<int>& arr) {
//     if (arr.empty() || arr[0] == INT_MIN) return nullptr;
//     TreeNode* root = new TreeNode(arr[0]);
//     queue<TreeNode*> q; q.push(root); size_t i = 1;
//     while (!q.empty() && i < arr.size()) {
//         TreeNode* node = q.front(); q.pop();
//         if (i < arr.size() && arr[i] != INT_MIN) { node->left = new TreeNode(arr[i]); q.push(node->left); } i++;
//         if (i < arr.size() && arr[i] != INT_MIN) { node->right = new TreeNode(arr[i]); q.push(node->right); } i++;
//     }
//     return root;
// }
// // ── Output helpers (C++14 compatible) ────────────────────────
// namespace _print {
//     void out(int v)                { cout << v; }
//     void out(long v)               { cout << v; }
//     void out(long long v)          { cout << v; }
//     void out(unsigned int v)       { cout << v; }
//     void out(unsigned long long v) { cout << v; }
//     void out(double v)             { if(v==(long long)v && abs(v)<1e15) cout<<(long long)v; else cout<<v; }
//     void out(float v)              { cout << v; }
//     void out(bool v)               { cout << (v ? "true" : "false"); }
//     void out(char v)               { cout << v; }
//     void out(const string& v)      { cout << v; }
//     void out(const char* v)        { cout << v; }
//     // ListNode*
//     void out(ListNode* head) {
//         cout << "[";
//         bool first = true;
//         set<ListNode*> seen;
//         while (head && !seen.count(head)) { seen.insert(head); if (!first) cout<<","; cout<<head->val; first=false; head=head->next; }
//         cout << "]";
//     }
//     // TreeNode* (BFS level-order)
//     void out(TreeNode* root) {
//         if (!root) { cout << "[]"; return; }
//         vector<string> r; queue<TreeNode*> q; q.push(root);
//         while (!q.empty()) {
//             TreeNode* n = q.front(); q.pop();
//             if (n) { r.push_back(to_string(n->val)); q.push(n->left); q.push(n->right); }
//             else   { r.push_back("null"); }
//         }
//         while (!r.empty() && r.back() == "null") r.pop_back();
//         cout << "["; for (size_t i=0;i<r.size();i++){if(i)cout<<",";cout<<r[i];} cout << "]";
//     }
//     // 1-D vector
//     template<typename T>
//     void out(const vector<T>& v) {
//         cout << "[";
//         for (size_t i = 0; i < v.size(); i++) { if (i) cout << ","; out(v[i]); }
//         cout << "]";
//     }
//     // 2-D vector
//     template<typename T>
//     void out(const vector<vector<T>>& v) {
//         cout << "[";
//         for (size_t i = 0; i < v.size(); i++) { if (i) cout << ","; out(v[i]); }
//         cout << "]";
//     }
//     // pair
//     template<typename A, typename B>
//     void out(const pair<A,B>& p) { cout<<"["; out(p.first); cout<<","; out(p.second); cout<<"]"; }
//     // tuple (2-elem)
//     template<typename A, typename B>
//     void out(const tuple<A,B>& t) { cout<<"["; out(get<0>(t)); cout<<","; out(get<1>(t)); cout<<"]"; }
//     // tuple (3-elem)
//     template<typename A, typename B, typename C>
//     void out(const tuple<A,B,C>& t) { cout<<"["; out(get<0>(t)); cout<<","; out(get<1>(t)); cout<<","; out(get<2>(t)); cout<<"]"; }
// }
// `;

// const buildCppWrapper = (userCode, inputArgs, methodName) => {
//   const { decls, callArgs } = buildCppNamedVars(inputArgs);
//   const declBlock = decls.map(d => `    ${d}`).join('\n');
//   const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;

//   return `#include <bits/stdc++.h>
// using namespace std;

// ${CPP_HELPERS}

// ${userCode}

// int main() {
//     ios_base::sync_with_stdio(false);
//     cin.tie(NULL);
//     Solution sol;
// ${declBlock}
//     auto result = ${callExpr};
//     _print::out(result);
//     cout << endl;
//     return 0;
// }
// `;
// };

// // ─────────────────────────────────────────────────────────────
// // C TRANSFORMER + WRAPPER
// // ─────────────────────────────────────────────────────────────
// //
// // C is the most restricted. Strategy:
// //   - For questions returning int/long/double/bool → use int/long/double return wrapper
// //   - For questions returning int[] → use int* + returnSize wrapper
// //   - For questions returning string → use char* wrapper
// //   - Matrix inputs → passed as flat array with row/col count
// //   - Faculty sets returnType field in the question (defaults to 'int*')
// //
// // The 'returnType' is stored per-question in Firestore as question.cReturnType.
// // Valid values: 'int', 'long', 'double', 'bool', 'char*', 'int*', 'void'
// // ─────────────────────────────────────────────────────────────

// const transformArgsForC = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return '&returnSize';
//   const args = splitTopLevelArgs(inputArgs);
//   const result = [];

//   args.forEach(arg => {
//     const a = arg.trim();
//     const t = detectType(a);

//     if (t === 'matrix') {
//       // Flatten the 2-D array for C
//       const inner = a.slice(1, -1).trim();
//       const rows = splitTopLevelArgs(inner);
//       const rowCount = rows.length;
//       const colCount = rows.length > 0 ? countArrayElements(rows[0].slice(1, -1)) : 0;
//       const flat = rows.map(r => r.trim().slice(1, -1)).join(', ');
//       result.push(`(int[]){${flat}}`);
//       result.push(String(rowCount));
//       result.push(String(colCount));
//       return;
//     }

//     if (t === 'array') {
//       const inner = a.slice(1, -1).trim();
//       const elemType = detectArrayElementType(inner);
//       const cType = { string: 'char*', char: 'char', bool: 'int', double: 'double', long: 'long long' }[elemType] || 'int';
//       result.push(`(${cType}[]){${inner}}`);
//       result.push(String(countArrayElements(inner)));
//       return;
//     }

//     if (t === 'bool') {
//       result.push((a === 'true' || a === 'True') ? '1' : '0');
//       return;
//     }

//     if (t === 'string') {
//       const sval = a.startsWith("'") ? '"' + a.slice(1, -1) + '"' : a;
//       result.push(sval);
//       return;
//     }

//     result.push(a);
//   });

//   return result.join(', ');
// };

// /**
//  * Build the C main() based on the expected return type.
//  * cReturnType: 'int' | 'long' | 'double' | 'bool' | 'string' | 'int*' | 'void' | 'int**'
//  */
// const buildCWrapper = (userCode, inputArgs, methodName, cReturnType = 'int*') => {
//   const args = transformArgsForC(inputArgs);

//   // Determine if we need &returnSize in args
//   const needsReturnSize = cReturnType === 'int*' || cReturnType === 'int**' || cReturnType === 'char**';
//   const finalArgs = needsReturnSize
//     ? (args ? args + ', &returnSize' : '&returnSize')
//     : args;

//   let mainBody = '';

//   if (cReturnType === 'int') {
//     mainBody = `    int result = ${methodName}(${finalArgs});
//     printf("%d\\n", result);`;
//   } else if (cReturnType === 'long') {
//     mainBody = `    long long result = ${methodName}(${finalArgs});
//     printf("%lld\\n", result);`;
//   } else if (cReturnType === 'double') {
//     mainBody = `    double result = ${methodName}(${finalArgs});
//     // Print as int if whole number
//     if (result == (long long)result) printf("%lld\\n", (long long)result);
//     else printf("%g\\n", result);`;
//   } else if (cReturnType === 'bool') {
//     mainBody = `    int result = ${methodName}(${finalArgs});
//     printf("%s\\n", result ? "true" : "false");`;
//   } else if (cReturnType === 'string' || cReturnType === 'char*') {
//     mainBody = `    char* result = ${methodName}(${finalArgs});
//     if (result == NULL) { printf("null\\n"); return 0; }
//     printf("%s\\n", result);`;
//   } else if (cReturnType === 'void') {
//     // In-place modification — print the first array arg
//     mainBody = `    ${methodName}(${finalArgs});
//     // Print first array arg (assumed to be modified in-place)
//     // Faculty: provide the array name/size manually in boilerplate for void returns`;
//   } else {
//     // Default: int* array return
//     mainBody = `    int* result = ${methodName}(${finalArgs});
//     if (result == NULL || returnSize == 0) { printf("null\\n"); return 0; }
//     printf("[");
//     for (int i = 0; i < returnSize; i++) { if (i) printf(","); printf("%d", result[i]); }
//     printf("]\\n");
//     if (result) free(result);`;
//   }

//   return `#include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include <stdbool.h>

// ${userCode}

// int main() {
//     int returnSize = 0;
// ${mainBody}
//     return 0;
// }
// `;
// };

// // ─────────────────────────────────────────────────────────────
// // WRAPPERS MAP — unified entry point
// // ─────────────────────────────────────────────────────────────
// const WRAPPERS = {
//   python:     (userCode, inputArgs, methodName, _meta) => buildPythonWrapper(userCode, inputArgs, methodName),
//   javascript: (userCode, inputArgs, methodName, _meta) => buildJsWrapper(userCode, inputArgs, methodName),
//   java:       (userCode, inputArgs, methodName, _meta) => buildJavaWrapper(userCode, inputArgs, methodName),
//   cpp:        (userCode, inputArgs, methodName, _meta) => buildCppWrapper(userCode, inputArgs, methodName),
//   c:          (userCode, inputArgs, methodName, meta)  => buildCWrapper(userCode, inputArgs, methodName, meta?.cReturnType || 'int*'),
// };

// // ─────────────────────────────────────────────────────────────
// // BOILERPLATE GENERATOR
// // Called by QuestionForm to auto-generate starter code.
// //
// // questionMeta can carry:
// //   paramTypes: ['array', 'int']  → parameter type hints
// //   returnType: 'int' | 'array' | 'matrix' | 'bool' | 'string' | ...
// //   cReturnType: explicit C return type string
// // ─────────────────────────────────────────────────────────────

// /**
//  * Generate boilerplate code for all languages.
//  * @param {string} methodName - camelCase method name
//  * @param {Object} meta - { paramTypes, returnType, cReturnType }
//  */
// export const generateBoilerplates = (methodName, meta = {}) => {
//   const m = methodName || 'solution';
//   const { paramTypes = ['nums', 'target'], returnType = 'any', cReturnType = 'int*' } = meta;

//   // Build param lists per language
//   const pyParams  = paramTypes.map((p, i) => typeof p === 'string' && p.includes(':') ? p : `param${i+1}`).join(', ');
//   const jsParams  = pyParams;
//   const javaParams = paramTypes.map((p, i) => {
//     const jt = { 'int': 'int', 'array': 'int[]', 'matrix': 'int[][]', 'string': 'String', 'bool': 'boolean', 'double': 'double', 'long': 'long' }[p] || 'Object';
//     return `${jt} param${i+1}`;
//   }).join(', ');
//   const cppParams = paramTypes.map((p, i) => {
//     const ct = { 'int': 'int', 'array': 'vector<int>&', 'matrix': 'vector<vector<int>>&', 'string': 'string', 'bool': 'bool', 'double': 'double', 'long': 'long long' }[p] || 'auto';
//     return `${ct} param${i+1}`;
//   }).join(', ');
//   const cParams = paramTypes.map((p, i) => {
//     const ct = { 'int': 'int', 'array': 'int* arr, int arrSize', 'matrix': 'int** mat, int rows, int cols', 'string': 'char*', 'bool': 'int', 'double': 'double' }[p] || 'int';
//     return ct.includes('param') ? ct : (ct.includes('arr') || ct.includes('mat') ? ct : `${ct} param${i+1}`);
//   }).join(', ');

//   return {
//     python: `class Solution:
//     def ${m}(self, nums: list, target: int):
//         # Write your solution here
//         pass`,

//     javascript: `class Solution {
//     ${m}(nums, target) {
//         // Write your solution here
//     }
// }`,

//     java: `class Solution {
//     public Object ${m}(int[] nums, int target) {
//         // Write your solution here
//         return null;
//     }
// }`,

//     cpp: `class Solution {
// public:
//     auto ${m}(vector<int>& nums, int target) {
//         // Write your solution here
//     }
// };`,

//     c: cReturnType === 'int'
//       ? `int ${m}(int* nums, int numsSize) {
//     // Write your solution here
//     return 0;
// }`
//       : cReturnType === 'bool'
//       ? `int ${m}(int* nums, int numsSize) {
//     // return 1 for true, 0 for false
//     return 0;
// }`
//       : `int* ${m}(int* nums, int numsSize, int* returnSize) {
//     *returnSize = 0;
//     // Write your solution here
//     return NULL;
// }`,
//   };
// };

// // ─────────────────────────────────────────────────────────────
// // Normalise output for comparison
// // Handles all edge cases: spacing, case, Python True/False/None,
// // trailing zeros on floats, negative zero
// // ─────────────────────────────────────────────────────────────
// const normalise = (raw) => {
//   if (raw === null || raw === undefined) return '';
//   return String(raw)
//     .trim()
//     .replace(/\s+/g, '')            // remove all whitespace
//     .replace(/\bTrue\b/g,  'true')  // Python bool
//     .replace(/\bFalse\b/g, 'false')
//     .replace(/\bNone\b/g,  'null')  // Python None
//     .replace(/\bNULL\b/g,  'null')  // C NULL
//     .replace(/\bnullptr\b/g,'null') // C++ nullptr
//     .replace(/-0\b/g, '0')          // -0 == 0
//     .replace(/\.0+\b/g, '')         // 1.0 == 1 (trailing .0)
//     .replace(/(\.\d*?)0+\b/g, '$1') // 1.50 == 1.5
//     .replace(/\.$/, '')             // trailing dot
//     .toLowerCase();
// };

// // ─────────────────────────────────────────────────────────────
// // POST to Judge0
// // ─────────────────────────────────────────────────────────────
// const _submit = async (sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb) => {
//   ensureConfig();
//   const url = `${JUDGE0_BASE}/submissions?base64_encoded=true&wait=true`;
//   const res = await fetch(url, {
//     method: 'POST',
//     headers: getHeaders(),
//     body: JSON.stringify({
//       source_code:    encode(sourceCode),
//       language_id:    languageId,
//       stdin:          encode(stdin),
//       cpu_time_limit: timeLimitMs / 1000,
//       memory_limit:   memoryLimitKb,
//       stack_limit:    64000,
//       enable_network: false,
//     }),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     if (res.status === 403) throw new Error('Judge0: Quota exceeded or not subscribed.');
//     if (res.status === 401) throw new Error('Judge0: Invalid API key.');
//     throw new Error(`Compiler API error ${res.status}: ${text}`);
//   }
//   let data = await res.json();
//   if (data.status?.id <= 2 && data.token) data = await _pollRaw(data.token);
//   return data;
// };

// // ─────────────────────────────────────────────────────────────
// // executeCode — raw execution (no LeetCode wrapper)
// // ─────────────────────────────────────────────────────────────
// export const executeCode = async (
//   language,
//   sourceCode,
//   stdin         = '',
//   timeLimitMs   = 2000,
//   memoryLimitKb = 128000,
// ) => {
//   const languageId = LANGUAGE_IDS[language];
//   if (!languageId) throw new Error(`Unsupported language: ${language}`);
//   const raw = await _submit(sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb);
//   return _normalizeResult(raw);
// };

// // ─────────────────────────────────────────────────────────────
// // runWithTestCases — LeetCode-style wrapped execution
// // question object shape:
// //   { methodName, testCases, timeLimitMs, cReturnType }
// // ─────────────────────────────────────────────────────────────
// export const runWithTestCases = async (
//   language,
//   sourceCode,
//   question,
//   options = {},
// ) => {
//   ensureConfig();
//   const languageId = LANGUAGE_IDS[language];
//   if (!languageId) throw new Error(`Unsupported language: ${language}`);

//   const { memoryLimitKb = 128000 } = options;
//   const testCases  = (question?.testCases || []).filter(tc => (tc.input || '').trim() || (tc.expectedOutput || '').trim());
//   const methodName = question?.methodName  || 'solution';
//   const timeLimit  = question?.timeLimitMs || 2000;
//   const wrapFn     = WRAPPERS[language];
//   // meta carries language-specific hints (e.g. cReturnType for C)
//   const meta = { cReturnType: question?.cReturnType || 'int*' };

//   const hasHiddenFlags = testCases.some(tc => tc.isHidden === true);
//   const isVisible = (tc, idx) => hasHiddenFlags ? !tc.isHidden : idx < 3;

//   if (!testCases.length) {
//     const r = await executeCode(language, sourceCode, '', timeLimit, memoryLimitKb);
//     return { results: [], passedCount: 0, totalCount: 0, allPassed: false, visiblePassed: 0, visibleTotal: 0, rawResult: r, noTestCases: true };
//   }

//   const runOne = async (tc, idx) => {
//     const visible = isVisible(tc, idx);
//     let finalCode = sourceCode;
//     if (wrapFn && methodName) {
//       try {
//         finalCode = wrapFn(sourceCode, tc.input || '', methodName, meta);
//       } catch (_) {
//         finalCode = sourceCode;
//       }
//     }
//     let raw;
//     try {
//       raw = await _submit(finalCode, languageId, '', timeLimit, memoryLimitKb);
//     } catch (err) {
//       return {
//         caseIndex: idx, isVisible: visible,
//         input: visible ? tc.input : null,
//         expectedOutput: visible ? (tc.expectedOutput || '').trim() : null,
//         actualOutput: null, passed: false,
//         statusId: 13, statusLabel: 'Network Error', statusColor: '#6b7280',
//         error: err.message, time: null, memory: null,
//       };
//     }
//     const stdout     = decode(raw.stdout)?.trim()         || '';
//     const stderr     = decode(raw.stderr)?.trim()         || '';
//     const compileErr = decode(raw.compile_output)?.trim() || '';
//     const expected   = (tc.expectedOutput || '').toString().trim();
//     const passed     = raw.status?.id === 3 && normalise(stdout) === normalise(expected);
//     const det        = getStatusDetails(raw.status?.id);
//     return {
//       caseIndex:      idx,
//       isVisible:      visible,
//       input:          visible ? tc.input : null,
//       expectedOutput: visible ? expected  : null,
//       actualOutput:   visible ? stdout    : (passed ? '✓' : '✗'),
//       passed,
//       statusId:       raw.status?.id,
//       statusLabel:    raw.status?.description || det.label,
//       statusColor:    det.color,
//       time:           raw.time,
//       memory:         raw.memory,
//       error:          (compileErr || stderr) || null,
//     };
//   };

//   const results = [];
//   for (let i = 0; i < testCases.length; i++) {
//     results.push(await runOne(testCases[i], i));
//     if (i < testCases.length - 1) await new Promise(r => setTimeout(r, 250));
//   }

//   const passedCount   = results.filter(r => r.passed).length;
//   const visibleCases  = results.filter(r => r.isVisible);
//   const visiblePassed = visibleCases.filter(r => r.passed).length;
//   const firstFailure  = results.find(r => !r.passed && r.isVisible) || results.find(r => !r.passed) || null;

//   return {
//     results,
//     passedCount,
//     totalCount:    testCases.length,
//     allPassed:     passedCount === testCases.length,
//     visiblePassed,
//     visibleTotal:  visibleCases.length,
//     firstFailure,
//   };
// };

// const _pollRaw = async (token, max = 12) => {
//   const url = `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true`;
//   for (let i = 0; i < max; i++) {
//     await new Promise(r => setTimeout(r, 700));
//     try {
//       const res  = await fetch(url, { headers: getHeaders() });
//       const data = await res.json();
//       if (data.status?.id >= 3) return data;
//     } catch {}
//   }
//   return { status: { id: 13, description: 'Timeout' }, stdout: null, stderr: 'Execution timed out', compile_output: null };
// };

// const _normalizeResult = (data) => ({
//   stdout:         decode(data.stdout),
//   stderr:         decode(data.stderr),
//   compile_output: decode(data.compile_output),
//   message:        decode(data.message),
//   time:           data.time,
//   memory:         data.memory,
//   status:         data.status,
// });

// export const getStatusDetails = (id) => ({
//   1:  { label: 'In Queue',                color: '#8b949e' },
//   2:  { label: 'Processing',              color: '#58a6ff' },
//   3:  { label: 'Accepted',                color: '#22c55e' },
//   4:  { label: 'Wrong Answer',            color: '#ef4444' },
//   5:  { label: 'Time Limit Exceeded',     color: '#f59e0b' },
//   6:  { label: 'Compilation Error',       color: '#ef4444' },
//   7:  { label: 'Runtime Error (SIGSEGV)', color: '#ef4444' },
//   8:  { label: 'Runtime Error (SIGXFSZ)', color: '#ef4444' },
//   9:  { label: 'Runtime Error (SIGFPE)',  color: '#ef4444' },
//   10: { label: 'Runtime Error (SIGABRT)', color: '#ef4444' },
//   11: { label: 'Runtime Error (NZEC)',    color: '#ef4444' },
//   12: { label: 'Runtime Error (Other)',   color: '#ef4444' },
//   13: { label: 'Internal Error',          color: '#6b7280' },
//   14: { label: 'Exec Format Error',       color: '#6b7280' },
// }[id] || { label: 'Unknown', color: '#6b7280' });

// /**
//  * Preview how inputArgs transforms in each language.
//  * Useful in QuestionForm for faculty validation.
//  */
// export const previewInputTransform = (inputArgs, cReturnType = 'int*') => {
//   const { decls, callArgs } = buildCppNamedVars(inputArgs);
//   return {
//     python:     inputArgs || '',
//     javascript: (inputArgs || '').replace(/'/g, '"'),
//     java:       transformArgsForJava(inputArgs),
//     cpp:        decls.length
//                   ? `${decls.join('\n')} → call: (${callArgs.join(', ')})`
//                   : `(${callArgs.join(', ')})`,
//     c:          transformArgsForC(inputArgs),
//   };
// };

// // ─────────────────────────────────────────────────────────────
// // QUESTION INPUT FORMAT REFERENCE
// // ─────────────────────────────────────────────────────────────
// //
// //  TYPE              DASHBOARD INPUT FIELD           EXAMPLE
// //  ──────────────────────────────────────────────────────────
// //  int               plain number                    9
// //  long              plain number                    1000000000
// //  double/float      decimal                         3.14
// //  bool              true / false                    true
// //  char              single-quoted char              'a'
// //  string            double-quoted string            "hello"
// //  int[]             bracket array                   [1,2,3,4]
// //  string[]          bracket array with quotes       ["cat","dog"]
// //  bool[]            bracket array                   [true,false,true]
// //  double[]          bracket array                   [1.5,2.5,3.0]
// //  int[][]  (matrix) nested brackets                 [[1,2],[3,4]]
// //  multi-arg         comma-separated                 [1,2,3], 9
// //  null / None       null keyword                    null
// //
// //  OUTPUT FORMAT (Expected Output field):
// //  ──────────────────────────────────────
// //  int               4
// //  bool              true  or  false
// //  string            hello  (no quotes needed)
// //  int[]             [0,1]  (compact, no spaces)
// //  int[][]           [[1,2],[3,4]]
// //  null              null
// //
// //  C LANGUAGE — cReturnType field in question Firestore doc:
// //  ──────────────────────────────────────────────────────────
// //  'int'   → returns single integer
// //  'long'  → returns long long
// //  'double'→ returns double
// //  'bool'  → returns int (0/1) printed as true/false
// //  'char*' → returns a string
// //  'int*'  → returns int array (default, needs returnSize)
// //  'void'  → in-place modification
// // ─────────────────────────────────────────────────────────────






















// ============================================================
// src/api/compilerService.js  —  Mind Code Platform
//
// .env MUST have:
//   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
//   VITE_COMPILER_API_KEY="your_rapidapi_key"   (optional if self-hosted)
//
// ╔═══════════════════════════════════════════════════════════════╗
// ║        COMPLETE LEETCODE-STYLE I/O — ALL TYPES COVERED       ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  INPUT TYPES (dashboard test-case field):                    ║
// ║    int          →  9                                         ║
// ║    long         →  1000000000                                ║
// ║    double/float →  3.14                                      ║
// ║    bool         →  true / false                              ║
// ║    char         →  'a'                                       ║
// ║    string       →  "hello"                                   ║
// ║    int[]        →  [1,2,3]                                   ║
// ║    string[]     →  ["cat","dog"]                             ║
// ║    bool[]       →  [true,false]                              ║
// ║    double[]     →  [1.5,2.5]                                 ║
// ║    int[][]      →  [[1,2],[3,4]]                             ║
// ║    string[][]   →  [["a","b"],["c","d"]]                     ║
// ║    multi-arg    →  [1,2,3], 9                                ║
// ║    null         →  null                                      ║
// ║                                                              ║
// ║  OUTPUT TYPES (expected output field):                       ║
// ║    int/long     →  4                                         ║
// ║    bool         →  true / false                              ║
// ║    string       →  hello  (no quotes)                        ║
// ║    double       →  3.14                                      ║
// ║    int[]        →  [0,1]  (compact, no spaces)               ║
// ║    int[][]      →  [[0,1],[2,3]]                             ║
// ║    null         →  null                                      ║
// ║                                                              ║
// ║  C LANGUAGE — FULLY AUTO-DETECTED from boilerplate:         ║
// ║    The C wrapper inspects the student's function signature   ║
// ║    and automatically picks the correct main() template.      ║
// ║    No manual cReturnType field needed on the question.       ║
// ║                                                              ║
// ║    int   fn(...)           → prints %d                       ║
// ║    long/long long fn(...)  → prints %lld                     ║
// ║    double fn(...)          → prints %g                       ║
// ║    bool/int fn(...bool...) → prints true/false               ║
// ║    char* fn(...)           → prints %s                       ║
// ║    int*  fn(...returnSize) → prints [a,b,c]                  ║
// ║    void  fn(...)           → in-place, prints modified arg   ║
// ╚═══════════════════════════════════════════════════════════════╝
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
// SECTION 1 — ARG PARSING UTILITIES
// These utilities parse the faculty's dashboard test-case input
// strings into structured data for each language's wrapper.
// ─────────────────────────────────────────────────────────────

/**
 * splitTopLevelArgs("  [1,2,3], 9  ")  →  ["[1,2,3]", "9"]
 * splitTopLevelArgs('[[1,2],[3,4]], true') → ['[[1,2],[3,4]]', 'true']
 * splitTopLevelArgs('"hello, world", 3') → ['"hello, world"', '3']
 *
 * Rules:
 *  - Never splits inside [], (), {}, or quoted strings
 *  - Handles single and double quotes
 *  - Trims each resulting argument
 */
const splitTopLevelArgs = (s) => {
  if (!s || !s.trim()) return [];
  const args = [];
  let depth = 0, cur = '', inStr = false, strChar = '';

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    // Enter string
    if (!inStr && (c === '"' || c === "'")) {
      inStr = true;
      strChar = c;
      cur += c;
      continue;
    }
    // Exit string (handle escaped quotes)
    if (inStr && c === strChar && s[i - 1] !== '\\') {
      inStr = false;
      cur += c;
      continue;
    }
    if (inStr) { cur += c; continue; }

    // Depth tracking
    if (c === '[' || c === '(' || c === '{') { depth++; cur += c; continue; }
    if (c === ']' || c === ')' || c === '}') { depth--; cur += c; continue; }

    // Top-level comma = argument separator
    if (c === ',' && depth === 0) {
      args.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
};

/**
 * detectType("9")            → 'int'
 * detectType("3.14")         → 'double'
 * detectType("true")         → 'bool'
 * detectType("'a'")          → 'char'
 * detectType('"hello"')      → 'string'
 * detectType("[1,2,3]")      → 'array'
 * detectType("[[1,2],[3,4]]")→ 'matrix'
 * detectType("null")         → 'null'
 */
const detectType = (val) => {
  const v = (val || '').trim();
  if (!v) return 'int';

  if (v === 'null' || v === 'None' || v === 'nullptr' || v === 'NULL') return 'null';
  if (v === 'true' || v === 'false' || v === 'True' || v === 'False')  return 'bool';

  // Single char literal  'a'
  if (v.startsWith("'") && v.endsWith("'") && v.length === 3) return 'char';
  // Quoted string  "hello" or 'hello world'
  if ((v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))) return 'string';

  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return 'array'; // empty []
    const first = (splitTopLevelArgs(inner)[0] || '').trim();
    return first.startsWith('[') ? 'matrix' : 'array';
  }

  if (v.match(/^-?\d+\.\d+([eE][+-]?\d+)?$/)) return 'double';
  if (v.match(/^-?\d+[lL]$/) ||
      (v.match(/^-?\d+$/) &&
       (parseInt(v, 10) > 2147483647 || parseInt(v, 10) < -2147483648))) return 'long';
  if (v.match(/^-?\d+$/)) return 'int';

  return 'string'; // fallback for unquoted identifiers / keywords
};

/**
 * detectArrayElementType("1,2,3")       → 'int'
 * detectArrayElementType('"a","b"')     → 'string'
 * detectArrayElementType("true,false")  → 'bool'
 * detectArrayElementType("1.5,2.5")     → 'double'
 * detectArrayElementType("[1,2],[3,4]") → 'nested'
 * detectArrayElementType("null,1,null") → 'nullable_int'
 */
const detectArrayElementType = (inner) => {
  const s = (inner || '').trim();
  if (!s) return 'int';
  if (s.startsWith('[')) return 'nested';

  const items = splitTopLevelArgs(s);
  // Filter nulls to detect underlying type
  const nonNull = items.filter(x => {
    const t = x.trim();
    return t !== 'null' && t !== 'None';
  });
  const first = ((nonNull[0] || items[0]) || '').trim();

  if (!first) return 'int';
  if (first.startsWith('"'))                                 return 'string';
  if (first.startsWith("'") && first.length === 3)          return 'char';
  if (first === 'true' || first === 'false')                 return 'bool';
  if (first.match(/^-?\d+\.\d+$/))                          return 'double';
  if (first.match(/^-?\d+[lL]$/))                           return 'long';

  // Has null elements alongside ints → nullable (Integer[] in Java)
  const hasNull = items.some(x => x.trim() === 'null' || x.trim() === 'None');
  if (hasNull) return 'nullable_int';

  return 'int';
};

/** Count how many elements are in the array inner string */
const countElements = (inner) => {
  if (!inner || !inner.trim()) return 0;
  return splitTopLevelArgs(inner).length;
};


// ─────────────────────────────────────────────────────────────
// SECTION 2 — PYTHON WRAPPER
// Python is dynamically typed — works for ALL return types.
// ListNode and TreeNode helpers are injected automatically.
// ─────────────────────────────────────────────────────────────

const PYTHON_DRIVER_HELPERS = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def _build_list(arr):
    if not arr: return None
    h = ListNode(arr[0]); c = h
    for v in arr[1:]: c.next = ListNode(v); c = c.next
    return h

def _list_to_arr(node):
    r, seen = [], set()
    while node and id(node) not in seen:
        seen.add(id(node)); r.append(node.val); node = node.next
    return r

def _build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0]); q = [root]; i = 1
    while q and i < len(arr):
        node = q.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i]); q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i]); q.append(node.right)
        i += 1
    return root

def _tree_to_arr(root):
    if not root: return []
    r, q = [], [root]
    while q:
        n = q.pop(0)
        if n: r.append(n.val); q.append(n.left); q.append(n.right)
        else: r.append(None)
    while r and r[-1] is None: r.pop()
    return r

def _fmt(v):
    if isinstance(v, ListNode): return _fmt(_list_to_arr(v))
    if isinstance(v, TreeNode): return _fmt(_tree_to_arr(v))
    if isinstance(v, list):
        return '[' + ','.join(_fmt(x) for x in v) + ']'
    if isinstance(v, tuple):
        return '[' + ','.join(_fmt(x) for x in v) + ']'
    if isinstance(v, bool):  return 'true' if v else 'false'
    if v is None:            return 'null'
    if isinstance(v, float):
        return str(int(v)) if v == int(v) and abs(v) < 1e15 else str(v)
    return str(v)
`;

const buildPythonWrapper = (userCode, inputArgs) => {
  const args = (inputArgs || '').trim();
  return `import sys
from typing import List, Dict, Optional, Tuple, Set, Any, Union
from collections import defaultdict, deque, Counter, OrderedDict
import heapq, math, itertools, functools, bisect, re, string, json

${PYTHON_DRIVER_HELPERS}
${userCode}

if __name__ == "__main__":
    try:
        _sol = Solution()
        _result = _sol.METHODNAME(${args})
        if _result is None:
            print("null")
        else:
            print(_fmt(_result))
    except Exception as _e:
        print(f"Runtime Error: {_e}", file=sys.stderr)
        import traceback; traceback.print_exc(file=sys.stderr)
`;
  // NOTE: METHODNAME is a placeholder replaced by the caller
};

// ─────────────────────────────────────────────────────────────
// SECTION 3 — JAVASCRIPT WRAPPER
// Supports class style, function declaration, arrow functions.
// ─────────────────────────────────────────────────────────────

const JS_DRIVER_HELPERS = `
function ListNode(val,next){this.val=(val===undefined?0:val);this.next=(next===undefined?null:next);}
function TreeNode(val,left,right){this.val=(val===undefined?0:val);this.left=(left===undefined?null:left);this.right=(right===undefined?null:right);}
function _buildList(arr){
  if(!arr||!arr.length)return null;
  let h=new ListNode(arr[0]),c=h;
  for(let i=1;i<arr.length;i++){c.next=new ListNode(arr[i]);c=c.next;}
  return h;
}
function _listToArr(node){
  const r=[],seen=new Set();
  while(node&&!seen.has(node)){seen.add(node);r.push(node.val);node=node.next;}
  return r;
}
function _buildTree(arr){
  if(!arr||!arr.length||arr[0]===null)return null;
  const root=new TreeNode(arr[0]),q=[root];let i=1;
  while(q.length&&i<arr.length){
    const n=q.shift();
    if(i<arr.length&&arr[i]!==null){n.left=new TreeNode(arr[i]);q.push(n.left);}i++;
    if(i<arr.length&&arr[i]!==null){n.right=new TreeNode(arr[i]);q.push(n.right);}i++;
  }
  return root;
}
function _treeToArr(root){
  if(!root)return[];
  const r=[],q=[root];
  while(q.length){const n=q.shift();if(n){r.push(n.val);q.push(n.left);q.push(n.right);}else r.push(null);}
  while(r.length&&r[r.length-1]===null)r.pop();
  return r;
}
function _fmt(v){
  if(v instanceof ListNode)return _fmt(_listToArr(v));
  if(v instanceof TreeNode)return _fmt(_treeToArr(v));
  if(Array.isArray(v))return'['+v.map(_fmt).join(',')+']';
  if(v===null||v===undefined)return'null';
  if(typeof v==='boolean')return v?'true':'false';
  if(typeof v==='number')return String(v);
  return String(v);
}
`;

const buildJsWrapper = (userCode, inputArgs, methodName) => {
  const args = (inputArgs || '').replace(/'/g, '"');
  return `${JS_DRIVER_HELPERS}
${userCode}

(function(){
  try{
    let _result,_called=false;
    try{
      if(typeof Solution!=="undefined"){
        const _sol=new Solution();
        if(typeof _sol["${methodName}"]==="function"){
          _result=_sol["${methodName}"](${args});
          _called=true;
        }
      }
    }catch(_){}
    if(!_called){
      try{
        if(typeof ${methodName}!=="undefined"&&typeof ${methodName}==="function"){
          _result=${methodName}(${args});
          _called=true;
        }
      }catch(_){}
    }
    if(!_called)throw new Error("Solution not found: class Solution { ${methodName}(...){} } or function ${methodName}(...){}");
    if(_result===undefined||_result===null){console.log("null");}
    else{console.log(_fmt(_result));}
  }catch(e){process.stderr.write("Runtime Error: "+e.message+"\\n");}
})();
`;
};

// ─────────────────────────────────────────────────────────────
// SECTION 4 — JAVA WRAPPER
// Transforms Python-syntax args → Java syntax.
// Handles int[], String[], boolean[], double[], int[][], List<List<>>.
// Universal fmt() handles all return types including TreeNode/ListNode.
// ─────────────────────────────────────────────────────────────

const transformJavaArg = (arg) => {
  const a = arg.trim();
  if (!a) return a;
  const t = detectType(a);

  if (t === 'null')   return 'null';
  if (t === 'bool')   return (a === 'True' || a === 'true') ? 'true' : 'false';
  if (t === 'char')   return a; // 'x' valid in Java
  if (t === 'string') {
    if (a.startsWith("'")) return '"' + a.slice(1, -1) + '"';
    return a;
  }
  if (t === 'double') return a;
  if (t === 'long')   return a.replace(/[lL]$/, '') + 'L';

  if (t === 'matrix') {
    const inner = a.slice(1, -1).trim();
    const rows  = splitTopLevelArgs(inner);
    const conv  = rows.map(r => {
      const rt = r.trim();
      return (rt.startsWith('[') && rt.endsWith(']')) ? `{${rt.slice(1, -1)}}` : rt;
    });
    // Detect element type from first row's inner
    const firstRowInner = rows.length > 0 ? rows[0].trim().slice(1, -1) : '';
    const et = detectArrayElementType(firstRowInner);
    const javaType = { string: 'String', char: 'char', bool: 'boolean', double: 'double' }[et] || 'int';
    return `new ${javaType}[][]{${conv.join(', ')}}`;
  }

  if (t === 'array') {
    const inner = a.slice(1, -1).trim();
    if (!inner) return 'new int[]{}';
    const et = detectArrayElementType(inner);
    if (et === 'string')       return `new String[]{${inner}}`;
    if (et === 'char')         return `new char[]{${inner}}`;
    if (et === 'bool')         return `new boolean[]{${inner}}`;
    if (et === 'double')       return `new double[]{${inner}}`;
    if (et === 'long')         return `new long[]{${inner.replace(/[lL]/g, '')}}`;
    if (et === 'nullable_int') return `new Integer[]{${inner.replace(/\bnull\b/g, 'null')}}`;
    return `new int[]{${inner}}`;
  }

  // multi-char single-quoted → Java String
  if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;
  return a;
};

const transformArgsForJava = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '';
  return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
};

const JAVA_DRIVER_CODE = `
    // ── Inner helper classes ───────────────────────────────────
    static class ListNode {
        int val; ListNode next;
        ListNode() {} ListNode(int v){val=v;} ListNode(int v,ListNode n){val=v;next=n;}
    }
    static class TreeNode {
        int val; TreeNode left,right;
        TreeNode(){}  TreeNode(int v){val=v;} TreeNode(int v,TreeNode l,TreeNode r){val=v;left=l;right=r;}
    }
    static ListNode buildList(int[] a){
        if(a==null||a.length==0)return null;
        ListNode h=new ListNode(a[0]),c=h;
        for(int i=1;i<a.length;i++){c.next=new ListNode(a[i]);c=c.next;}
        return h;
    }
    static TreeNode buildTree(Integer[] a){
        if(a==null||a.length==0||a[0]==null)return null;
        TreeNode root=new TreeNode(a[0]);
        Queue<TreeNode> q=new LinkedList<>();q.add(root);int i=1;
        while(!q.isEmpty()&&i<a.length){
            TreeNode n=q.poll();
            if(i<a.length&&a[i]!=null){n.left=new TreeNode(a[i]);q.add(n.left);}i++;
            if(i<a.length&&a[i]!=null){n.right=new TreeNode(a[i]);q.add(n.right);}i++;
        }
        return root;
    }
    static String fmtTree(TreeNode root){
        if(root==null)return"[]";
        List<String> r=new ArrayList<>();Queue<TreeNode> q=new LinkedList<>();q.add(root);
        while(!q.isEmpty()){TreeNode n=q.poll();if(n!=null){r.add(String.valueOf(n.val));q.add(n.left);q.add(n.right);}else r.add("null");}
        while(!r.isEmpty()&&r.get(r.size()-1).equals("null"))r.remove(r.size()-1);
        return"["+String.join(",",r)+"]";
    }
    static String fmt(Object r){
        if(r==null)return"null";
        if(r instanceof TreeNode)  return fmtTree((TreeNode)r);
        if(r instanceof ListNode){
            StringBuilder sb=new StringBuilder("[");ListNode n=(ListNode)r;boolean f=true;
            Set<ListNode> seen=new HashSet<>();
            while(n!=null&&!seen.contains(n)){seen.add(n);if(!f)sb.append(",");sb.append(n.val);f=false;n=n.next;}
            return sb.append("]").toString();
        }
        if(r instanceof int[]){
            int[]a=(int[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}return sb.append("]").toString();
        }
        if(r instanceof long[]){
            long[]a=(long[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}return sb.append("]").toString();
        }
        if(r instanceof double[]){
            double[]a=(double[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(fmtDouble(a[i]));}return sb.append("]").toString();
        }
        if(r instanceof boolean[]){
            boolean[]a=(boolean[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}return sb.append("]").toString();
        }
        if(r instanceof char[]){
            char[]a=(char[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}return sb.append("]").toString();
        }
        if(r instanceof String[]){
            String[]a=(String[])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}return sb.append("]").toString();
        }
        if(r instanceof int[][]){
            int[][]a=(int[][])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append("[");
                for(int j=0;j<a[i].length;j++){if(j>0)sb.append(",");sb.append(a[i][j]);}sb.append("]");}
            return sb.append("]").toString();
        }
        if(r instanceof char[][]){
            char[][]a=(char[][])r;StringBuilder sb=new StringBuilder("[");
            for(int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append("[");
                for(int j=0;j<a[i].length;j++){if(j>0)sb.append(",");sb.append(a[i][j]);}sb.append("]");}
            return sb.append("]").toString();
        }
        if(r instanceof List){
            List<?>lst=(List<?>)r;
            if(!lst.isEmpty()&&lst.get(0)instanceof List){
                StringBuilder sb=new StringBuilder("[");
                for(int i=0;i<lst.size();i++){if(i>0)sb.append(",");sb.append(fmt(lst.get(i)));}
                return sb.append("]").toString();
            }
            return lst.stream().map(Main::fmt).collect(Collectors.joining(",","[","]"));
        }
        if(r instanceof Boolean) return(Boolean)r?"true":"false";
        if(r instanceof Double)  return fmtDouble((Double)r);
        if(r instanceof Float)   return fmtDouble(((Float)r).doubleValue());
        return r.toString();
    }
    static String fmtDouble(double d){
        if(d==(long)d&&!Double.isInfinite(d)&&Math.abs(d)<1e15)return String.valueOf((long)d);
        return String.valueOf(d);
    }
`;

const buildJavaWrapper = (userCode, inputArgs, methodName) => {
  const args = transformArgsForJava(inputArgs);
  return `import java.util.*;
import java.util.stream.*;

${userCode}

class Main {
${JAVA_DRIVER_CODE}
    public static void main(String[] args) {
        try {
            Solution sol = new Solution();
            Object result = sol.${methodName}(${args});
            System.out.println(fmt(result));
        } catch (Exception e) {
            System.err.println("Runtime Error: " + e.getMessage());
            e.printStackTrace(System.err);
        }
    }
}
`;
};

// ─────────────────────────────────────────────────────────────
// SECTION 5 — C++ WRAPPER
// Named variable declarations prevent rvalue-reference errors.
// Overloaded _print::out() handles EVERY possible return type.
// ─────────────────────────────────────────────────────────────

const buildCppNamedVars = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
  const args = splitTopLevelArgs(inputArgs);
  const decls = [], callArgs = [];

  args.forEach((arg, i) => {
    const a  = arg.trim();
    const t  = detectType(a);
    const nm = `_a${i}`;

    switch (t) {
      case 'null':
        callArgs.push('nullptr');
        return;

      case 'bool': {
        const bv = (a === 'true' || a === 'True') ? 'true' : 'false';
        decls.push(`bool ${nm} = ${bv};`);
        callArgs.push(nm);
        return;
      }

      case 'char':
        decls.push(`char ${nm} = ${a};`);
        callArgs.push(nm);
        return;

      case 'string': {
        const sv = a.startsWith("'") ? `"${a.slice(1,-1)}"` : a;
        decls.push(`string ${nm} = ${sv};`);
        callArgs.push(nm);
        return;
      }

      case 'double':
        decls.push(`double ${nm} = ${a};`);
        callArgs.push(nm);
        return;

      case 'long': {
        const lv = a.replace(/[lL]$/, '');
        decls.push(`long long ${nm} = ${lv}LL;`);
        callArgs.push(nm);
        return;
      }

      case 'int':
        decls.push(`int ${nm} = ${a};`);
        callArgs.push(nm);
        return;

      case 'matrix': {
        const inner = a.slice(1, -1).trim();
        const rows  = splitTopLevelArgs(inner);
        const et    = rows.length > 0 ? detectArrayElementType(rows[0].slice(1, -1)) : 'int';
        const cppET = { string:'string', char:'char', bool:'bool', double:'double', long:'long long' }[et] || 'int';
        const rv = rows.map(r => {
          const rt = r.trim();
          return (rt.startsWith('[') && rt.endsWith(']')) ? `{${rt.slice(1, -1)}}` : rt;
        });
        decls.push(`vector<vector<${cppET}>> ${nm} = {${rv.join(', ')}};`);
        callArgs.push(nm);
        return;
      }

      case 'array': {
        const inner = a.slice(1, -1).trim();
        if (!inner) { decls.push(`vector<int> ${nm} = {};`); callArgs.push(nm); return; }
        const et    = detectArrayElementType(inner);
        const typeM = { string:'vector<string>', char:'vector<char>', bool:'vector<bool>',
                        double:'vector<double>', long:'vector<long long>',
                        nested:'vector<vector<int>>', nullable_int:'vector<int>' };
        const cppT  = typeM[et] || 'vector<int>';
        decls.push(`${cppT} ${nm} = {${inner}};`);
        callArgs.push(nm);
        return;
      }

      default:
        // Raw value — pass through, fix single-quoted strings
        callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
    }
  });

  return { decls, callArgs };
};

const CPP_DRIVER_HELPERS = `
// ── ListNode / TreeNode ───────────────────────────────────────
struct ListNode {
    int val; ListNode* next;
    ListNode(int v=0,ListNode* n=nullptr):val(v),next(n){}
};
struct TreeNode {
    int val; TreeNode *left,*right;
    TreeNode(int v=0):val(v),left(nullptr),right(nullptr){}
};
ListNode* _buildList(const vector<int>& a){
    if(a.empty())return nullptr;
    ListNode* h=new ListNode(a[0]),*c=h;
    for(size_t i=1;i<a.size();i++){c->next=new ListNode(a[i]);c=c->next;}
    return h;
}
TreeNode* _buildTree(const vector<int>& a){
    if(a.empty()||a[0]==INT_MIN)return nullptr;
    TreeNode* root=new TreeNode(a[0]);
    queue<TreeNode*> q;q.push(root);size_t i=1;
    while(!q.empty()&&i<a.size()){
        TreeNode* n=q.front();q.pop();
        if(i<a.size()&&a[i]!=INT_MIN){n->left=new TreeNode(a[i]);q.push(n->left);}i++;
        if(i<a.size()&&a[i]!=INT_MIN){n->right=new TreeNode(a[i]);q.push(n->right);}i++;
    }
    return root;
}
// ── Output helpers (C++14 compatible, no if constexpr) ────────
namespace _print {
    // primitives
    void out(int v)                {cout<<v;}
    void out(unsigned int v)       {cout<<v;}
    void out(long v)               {cout<<v;}
    void out(long long v)          {cout<<v;}
    void out(unsigned long long v) {cout<<v;}
    void out(double v)             {if(v==(long long)v&&abs(v)<1e15)cout<<(long long)v;else cout<<v;}
    void out(float v)              {cout<<v;}
    void out(bool v)               {cout<<(v?"true":"false");}
    void out(char v)               {cout<<v;}
    void out(const string& v)      {cout<<v;}
    void out(const char* v)        {cout<<v;}
    // ListNode*
    void out(ListNode* h){
        cout<<"[";bool f=true;set<ListNode*>seen;
        while(h&&!seen.count(h)){seen.insert(h);if(!f)cout<<",";cout<<h->val;f=false;h=h->next;}
        cout<<"]";
    }
    // TreeNode* — BFS level-order
    void out(TreeNode* root){
        if(!root){cout<<"[]";return;}
        vector<string>r;queue<TreeNode*>q;q.push(root);
        while(!q.empty()){TreeNode*n=q.front();q.pop();
            if(n){r.push_back(to_string(n->val));q.push(n->left);q.push(n->right);}
            else r.push_back("null");
        }
        while(!r.empty()&&r.back()=="null")r.pop_back();
        cout<<"[";for(size_t i=0;i<r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]";
    }
    // 1-D vector
    template<typename T>
    void out(const vector<T>& v){
        cout<<"[";for(size_t i=0;i<v.size();i++){if(i)cout<<",";out(v[i]);}cout<<"]";
    }
    // 2-D vector
    template<typename T>
    void out(const vector<vector<T>>& v){
        cout<<"[";for(size_t i=0;i<v.size();i++){if(i)cout<<",";out(v[i]);}cout<<"]";
    }
    // pair
    template<typename A,typename B>
    void out(const pair<A,B>& p){cout<<"[";out(p.first);cout<<",";out(p.second);cout<<"]";}
    // tuple 2
    template<typename A,typename B>
    void out(const tuple<A,B>& t){cout<<"[";out(get<0>(t));cout<<",";out(get<1>(t));cout<<"]";}
    // tuple 3
    template<typename A,typename B,typename C>
    void out(const tuple<A,B,C>& t){cout<<"[";out(get<0>(t));cout<<",";out(get<1>(t));cout<<",";out(get<2>(t));cout<<"]";}
}
`;

const buildCppWrapper = (userCode, inputArgs, methodName) => {
  const { decls, callArgs } = buildCppNamedVars(inputArgs);
  const declBlock = decls.map(d => `    ${d}`).join('\n');
  const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;
  return `#include <bits/stdc++.h>
using namespace std;

${CPP_DRIVER_HELPERS}

${userCode}

int main(){
    ios_base::sync_with_stdio(false);cin.tie(NULL);
    Solution sol;
${declBlock}
    auto result = ${callExpr};
    _print::out(result);
    cout << endl;
    return 0;
}
`;
};

// ─────────────────────────────────────────────────────────────
// SECTION 6 — C WRAPPER  ← THE FULLY FIXED SECTION
//
// PROBLEM: C has no templates, no overloading, no dynamic typing.
// The old wrapper always used  int* result = fn(...)  which breaks
// for any function that returns int, long, double, bool, or char*.
//
// SOLUTION: Auto-detect the C return type by parsing the student's
// boilerplate function signature. No manual field needed.
//
// Detection priority (checked in order):
//   1. Signature starts with "void "         → void / in-place
//   2. Signature starts with "char* "        → string return
//   3. Signature starts with "char **"       → string[] return
//   4. Signature starts with "double "       → double return
//   5. Contains "long long" or "long "       → long return
//   6. Signature starts with "int**"         → 2D array return
//   7. Signature starts with "int*" AND
//      param list contains "*returnSize"     → int[] array return
//   8. Signature starts with "int* "         → int[] array return
//   9. Signature starts with "bool "         → bool return
//  10. Signature starts with "int "          → int return  ← THE FIX
//  11. Fallback                              → int return
//
// This correctly handles:
//   Q1 parcelWeightChecker  → "int "   → returns int     ✅
//   Q2 studentScoreAnalyzer → "int* "  → returns int*    ✅
//   Q3 fraudDetectionWindow → "int "   → returns int     ✅
// ─────────────────────────────────────────────────────────────

/**
 * Detect C return type from the student's boilerplate source code.
 * Returns one of: 'int' | 'long' | 'double' | 'bool' | 'char*' |
 *                 'int*' | 'int**' | 'void'
 *
 * @param {string} sourceCode - full boilerplate / student code for C
 * @param {string} methodName - e.g. "parcelWeightChecker"
 */
const detectCReturnType = (sourceCode, methodName) => {
  if (!sourceCode || !methodName) return 'int';

  // Find the function definition line that contains the methodName
  // We look for a line like:  <returnType> methodName(
  // It may span across lines so we search in the full source.
  const escaped = methodName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Match: optional qualifiers then return-type then methodName
  // e.g.  "int* parcelWeightChecker("  or  "void studentScoreAnalyzer("
  const fnRegex = new RegExp(
    // capture everything before the method name on that token
    `([\\w\\s*]+?)\\s+${escaped}\\s*\\(`,
    'g'
  );

  let match;
  let returnTypeRaw = null;

  while ((match = fnRegex.exec(sourceCode)) !== null) {
    const candidate = match[1].trim();
    // Skip lines that look like a call (inside another function)
    // A definition appears at start of a line or after a newline
    const idx = match.index;
    const preceding = sourceCode.slice(Math.max(0, idx - 2), idx);
    // If immediately preceded by non-whitespace chars (except newline) skip
    if (preceding && !/[\n\r\s{};]/.test(preceding.slice(-1))) continue;
    returnTypeRaw = candidate;
    break;
  }

  if (!returnTypeRaw) return 'int'; // safe fallback

  const rt = returnTypeRaw.trim();

  // Check in priority order
  if (/^void$/.test(rt))                              return 'void';
  if (/char\s*\*\s*\*/.test(rt) || rt === 'char**')  return 'char**';
  if (/char\s*\*/.test(rt) || rt === 'char*')        return 'char*';
  if (/double/.test(rt))                              return 'double';
  if (/long\s+long/.test(rt) || /^long$/.test(rt))   return 'long';
  if (/int\s*\*\s*\*/.test(rt) || rt === 'int**')    return 'int**';
  if (/int\s*\*/.test(rt) || rt === 'int*') {
    // Distinguish int* (array with returnSize) vs plain int* (no returnSize)
    // Check if the param list mentions returnSize
    const hasReturnSize = sourceCode.includes('returnSize');
    return hasReturnSize ? 'int*' : 'int*_no_rs';
  }
  if (/^bool$/.test(rt))                              return 'bool';
  if (/^int$/.test(rt))                               return 'int';

  return 'int'; // ultimate fallback
};

/**
 * Transform inputArgs for C.
 * Arrays → compound literals (int[]){...} + size argument
 * Matrices → flat (int[]){...} + rowCount + colCount
 * Primitives → pass through
 *
 * NOTE: returnSize is NOT added here — it's added in buildCWrapper
 * based on the detected return type.
 */
const transformArgsForC = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '';
  const args = splitTopLevelArgs(inputArgs);
  const result = [];

  args.forEach(arg => {
    const a = arg.trim();
    const t = detectType(a);

    if (t === 'matrix') {
      const inner = a.slice(1, -1).trim();
      const rows  = splitTopLevelArgs(inner);
      const rowCount = rows.length;
      const colCount = rows.length > 0 ? countElements(rows[0].trim().slice(1,-1)) : 0;
      const flat = rows.map(r => r.trim().slice(1,-1)).join(', ');
      result.push(`(int[]){${flat}}`);
      result.push(String(rowCount));
      result.push(String(colCount));
      return;
    }

    if (t === 'array') {
      const inner = a.slice(1, -1).trim();
      const et    = detectArrayElementType(inner);
      const cType = { string:'char*', char:'char', bool:'int', double:'double', long:'long long' }[et] || 'int';
      // Use compound literal
      if (inner) {
        result.push(`(${cType}[]){${inner}}`);
      } else {
        result.push(`(${cType}[]){}`);
      }
      result.push(String(countElements(inner)));
      return;
    }

    if (t === 'bool') {
      result.push((a === 'true' || a === 'True') ? '1' : '0');
      return;
    }
    if (t === 'string') {
      result.push(a.startsWith("'") ? `"${a.slice(1,-1)}"` : a);
      return;
    }
    if (t === 'long') {
      result.push(a.replace(/[lL]$/, ''));
      return;
    }
    result.push(a);
  });

  return result.join(', ');
};

/**
 * Build the complete C source with the correct main() for the detected return type.
 *
 * @param {string} userCode   - the student's C code (boilerplate + their logic)
 * @param {string} inputArgs  - dashboard input string e.g. "[1,2,3], 9"
 * @param {string} methodName - function name e.g. "parcelWeightChecker"
 * @param {string} cReturnType- auto-detected from detectCReturnType()
 */
const buildCWrapper = (userCode, inputArgs, methodName, cReturnType) => {
  const baseArgs = transformArgsForC(inputArgs);

  // ── Helpers used by multiple branches ──
  const includes = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
`;

  let mainBody = '';

  // ── CASE: returns int (single integer) ─────────────────────
  // Example: int parcelWeightChecker(int* w, int n)
  // Example: int fraudDetectionWindow(int* t, int n, int d)
  if (cReturnType === 'int') {
    const callArgs = baseArgs; // no returnSize needed
    mainBody = `    int result = ${methodName}(${callArgs});
    printf("%d\\n", result);`;
  }

  // ── CASE: returns long / long long ─────────────────────────
  else if (cReturnType === 'long') {
    mainBody = `    long long result = ${methodName}(${baseArgs});
    printf("%lld\\n", result);`;
  }

  // ── CASE: returns double ────────────────────────────────────
  else if (cReturnType === 'double') {
    mainBody = `    double result = ${methodName}(${baseArgs});
    if(result == (long long)result && result > -1e15 && result < 1e15)
        printf("%lld\\n", (long long)result);
    else
        printf("%g\\n", result);`;
  }

  // ── CASE: returns bool (as int in C) ───────────────────────
  else if (cReturnType === 'bool') {
    mainBody = `    int result = ${methodName}(${baseArgs});
    printf("%s\\n", result ? "true" : "false");`;
  }

  // ── CASE: returns char* (string) ───────────────────────────
  else if (cReturnType === 'char*') {
    mainBody = `    char* result = ${methodName}(${baseArgs});
    if(result == NULL) { printf("null\\n"); return 0; }
    printf("%s\\n", result);`;
  }

  // ── CASE: returns char** (array of strings) ────────────────
  else if (cReturnType === 'char**') {
    const callArgs = baseArgs ? baseArgs + ', &returnSize' : '&returnSize';
    mainBody = `    int returnSize = 0;
    char** result = ${methodName}(${callArgs});
    if(result == NULL || returnSize == 0){ printf("[]\\n"); return 0; }
    printf("[");
    for(int i = 0; i < returnSize; i++){ if(i) printf(","); printf("%s", result[i]); }
    printf("]\\n");`;
  }

  // ── CASE: returns int* with returnSize (array) ─────────────
  // Example: int* studentScoreAnalyzer(int* marks, int n, int* returnSize)
  else if (cReturnType === 'int*' || cReturnType === 'int*_no_rs') {
    // Always pass &returnSize — student's signature must accept it
    const callArgs = baseArgs ? baseArgs + ', &returnSize' : '&returnSize';
    mainBody = `    int returnSize = 0;
    int* result = ${methodName}(${callArgs});
    if(result == NULL || returnSize == 0){ printf("null\\n"); return 0; }
    printf("[");
    for(int i = 0; i < returnSize; i++){ if(i) printf(","); printf("%d", result[i]); }
    printf("]\\n");
    free(result);`;
  }

  // ── CASE: returns int** (2D array) ─────────────────────────
  else if (cReturnType === 'int**') {
    const callArgs = baseArgs
      ? baseArgs + ', &returnSize, returnColumnSizes'
      : '&returnSize, returnColumnSizes';
    mainBody = `    int returnSize = 0;
    int* returnColumnSizes = NULL;
    int** result = ${methodName}(${callArgs});
    if(result == NULL || returnSize == 0){ printf("[]\\n"); return 0; }
    printf("[");
    for(int i = 0; i < returnSize; i++){
        if(i) printf(","); printf("[");
        for(int j = 0; j < returnColumnSizes[i]; j++){
            if(j) printf(","); printf("%d", result[i][j]);
        }
        printf("]");
    }
    printf("]\\n");`;
  }

  // ── CASE: void (in-place modification) ─────────────────────
  // The function modifies an array argument in-place.
  // We call the function and then print the first array argument.
  else if (cReturnType === 'void') {
    // Re-parse args to find first array and its size variable name
    const args = splitTopLevelArgs(inputArgs || '');
    let printBlock = '    printf("null\\n");';
    if (args.length > 0) {
      const firstArg = args[0].trim();
      const t = detectType(firstArg);
      if (t === 'array') {
        const inner = firstArg.slice(1, -1).trim();
        const size  = countElements(inner);
        const et    = detectArrayElementType(inner);
        const cType = et === 'double' ? 'double' : 'int';
        const fmt   = et === 'double' ? '%g' : '%d';
        const arrLiteral = `(${cType}[]){${inner}}`;
        printBlock = `    ${cType} _arr[] = {${inner}};
    int _n = ${size};
    ${methodName}(_arr, _n${baseArgs ? ', ' + baseArgs.split(',').slice(1).join(',').trim() : ''});
    printf("[");
    for(int i = 0; i < _n; i++){ if(i) printf(","); printf("${fmt}", _arr[i]); }
    printf("]\\n");`;
      }
    }
    // For void, build a custom main that re-builds args and calls fn
    return `${includes}

${userCode}

int main(){
${printBlock}
    return 0;
}
`;
  }

  // ── Fallback ────────────────────────────────────────────────
  else {
    mainBody = `    int result = ${methodName}(${baseArgs});
    printf("%d\\n", result);`;
  }

  return `${includes}

${userCode}

int main(){
${mainBody}
    return 0;
}
`;
};

// ─────────────────────────────────────────────────────────────
// SECTION 7 — WRAPPERS MAP
// Single entry point for all languages. The 'meta' object carries
// language-specific data; for C the source code itself is passed
// so we can auto-detect the return type from the boilerplate.
// ─────────────────────────────────────────────────────────────

const WRAPPERS = {
  // Python: dynamically typed, one wrapper covers all types
  python: (userCode, inputArgs, methodName, _meta) => {
    return buildPythonWrapper(userCode, inputArgs)
      .replace('METHODNAME', methodName);
  },

  // JavaScript: dynamically typed, one wrapper covers all types
  javascript: (userCode, inputArgs, methodName, _meta) => {
    return buildJsWrapper(userCode, inputArgs, methodName);
  },

  // Java: Object return type + universal fmt() covers all types
  java: (userCode, inputArgs, methodName, _meta) => {
    return buildJavaWrapper(userCode, inputArgs, methodName);
  },

  // C++: templates + overloaded _print::out() covers all types
  cpp: (userCode, inputArgs, methodName, _meta) => {
    return buildCppWrapper(userCode, inputArgs, methodName);
  },

  // C: auto-detect return type from student's boilerplate signature
  c: (userCode, inputArgs, methodName, meta) => {
    // Step 1: detect C return type from the function signature in userCode
    const cReturnType = detectCReturnType(userCode, methodName);
    // Step 2: build the correct main() for that return type
    return buildCWrapper(userCode, inputArgs, methodName, cReturnType);
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION 8 — OUTPUT NORMALISATION
// Compares student output against expected output flexibly.
// [0, 1] == [0,1]  |  True == true  |  None == null
// 1.0 == 1  |  -0 == 0  |  "hello" == hello
// ─────────────────────────────────────────────────────────────

const normalise = (raw) => {
  if (raw === null || raw === undefined) return '';
  return String(raw)
    .trim()
    .replace(/\s+/g, '')             // remove all whitespace
    .replace(/\bTrue\b/g,  'true')   // Python capitalised bool
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g,  'null')   // Python None
    .replace(/\bNULL\b/g,  'null')   // C NULL
    .replace(/\bnullptr\b/g,'null')  // C++ nullptr
    .replace(/-0(?!\d)/g,  '0')      // -0 → 0
    .replace(/\.0+\b/g,    '')       // 1.0 → 1
    .replace(/(\.\d*[1-9])0+\b/g,'$1') // 1.50 → 1.5
    .replace(/\.$/, '')              // trailing dot
    .toLowerCase();
};

// ─────────────────────────────────────────────────────────────
// SECTION 9 — JUDGE0 COMMUNICATION
// ─────────────────────────────────────────────────────────────

const _submit = async (sourceCode, languageId, stdin, timeLimitMs, memoryLimitKb) => {
  ensureConfig();
  const url = `${JUDGE0_BASE}/submissions?base64_encoded=true&wait=true`;
  const res = await fetch(url, {
    method:  'POST',
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

const _pollRaw = async (token, max = 12) => {
  const url = `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true`;
  for (let i = 0; i < max; i++) {
    await new Promise(r => setTimeout(r, 700));
    try {
      const res  = await fetch(url, { headers: getHeaders() });
      const data = await res.json();
      if (data.status?.id >= 3) return data;
    } catch (_) {}
  }
  return {
    status: { id: 13, description: 'Timeout' },
    stdout: null, stderr: 'Execution timed out', compile_output: null,
  };
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

// ─────────────────────────────────────────────────────────────
// SECTION 10 — PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * executeCode — raw execution, no LeetCode wrapper.
 * Used by the "Run" button with custom stdin.
 */
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

/**
 * runWithTestCases — LeetCode-style wrapped execution.
 * question shape: { methodName, testCases, timeLimitMs, cReturnType? }
 * testCase shape: { input, expectedOutput, isHidden }
 *
 * For C: cReturnType is AUTO-DETECTED from the student's code.
 * No need for faculty to set it manually.
 */
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
  const testCases  = (question?.testCases || [])
    .filter(tc => (tc.input || '').trim() || (tc.expectedOutput || '').trim());
  const methodName = question?.methodName  || 'solution';
  const timeLimit  = question?.timeLimitMs || 2000;
  const wrapFn     = WRAPPERS[language];

  const hasHiddenFlags = testCases.some(tc => tc.isHidden === true);
  const isVisible      = (tc, idx) => hasHiddenFlags ? !tc.isHidden : idx < 3;

  if (!testCases.length) {
    const r = await executeCode(language, sourceCode, '', timeLimit, memoryLimitKb);
    return {
      results: [], passedCount: 0, totalCount: 0,
      allPassed: false, visiblePassed: 0, visibleTotal: 0,
      rawResult: r, noTestCases: true,
    };
  }

  const runOne = async (tc, idx) => {
    const visible = isVisible(tc, idx);
    let finalCode = sourceCode;

    if (wrapFn && methodName) {
      try {
        // Pass sourceCode as meta so C wrapper can auto-detect return type
        finalCode = wrapFn(sourceCode, tc.input || '', methodName, { sourceCode });
      } catch (_) {
        finalCode = sourceCode;
      }
    }

    let raw;
    try {
      raw = await _submit(finalCode, languageId, '', timeLimit, memoryLimitKb);
    } catch (err) {
      return {
        caseIndex: idx, isVisible: visible,
        input:          visible ? tc.input : null,
        expectedOutput: visible ? (tc.expectedOutput || '').trim() : null,
        actualOutput:   null, passed: false,
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
      input:          visible ? tc.input   : null,
      expectedOutput: visible ? expected   : null,
      actualOutput:   visible ? stdout     : (passed ? '✓' : '✗'),
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
  const firstFailure  = results.find(r => !r.passed && r.isVisible)
                     || results.find(r => !r.passed)
                     || null;

  return {
    results,
    passedCount,
    totalCount:   testCases.length,
    allPassed:    passedCount === testCases.length,
    visiblePassed,
    visibleTotal: visibleCases.length,
    firstFailure,
  };
};

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
 * generateBoilerplates — called by QuestionForm to auto-generate
 * starter code when faculty types a method name.
 */
export const generateBoilerplates = (methodName) => {
  const m = methodName || 'solution';
  return {
    python: `class Solution:
    def ${m}(self, nums: list, target: int):
        # Write your solution here
        pass`,

    javascript: `class Solution {
    ${m}(nums, target) {
        // Write your solution here
    }
}`,

    java: `class Solution {
    public Object ${m}(int[] nums, int target) {
        // Write your solution here
        return null;
    }
}`,

    cpp: `class Solution {
public:
    auto ${m}(std::vector<int>& nums, int target) {
        // Write your solution here
    }
};`,

    // C default: int return — faculty edits to int* if array is returned
    c: `int ${m}(int* nums, int numsSize) {
    // Write your solution here
    return 0;
}`,
  };
};

/**
 * previewInputTransform — shown in QuestionForm so faculty can
 * verify how their test-case input string is transformed per language.
 */
export const previewInputTransform = (inputArgs) => {
  const { decls, callArgs } = buildCppNamedVars(inputArgs);
  return {
    python:     inputArgs || '',
    javascript: (inputArgs || '').replace(/'/g, '"'),
    java:       transformArgsForJava(inputArgs),
    cpp:  decls.length
            ? decls.join('\n') + `\n// call: (${callArgs.join(', ')})`
            : `(${callArgs.join(', ')})`,
    c:    transformArgsForC(inputArgs),
  };
};

// ─────────────────────────────────────────────────────────────
// QUICK REFERENCE — C RETURN TYPE AUTO-DETECTION EXAMPLES
// ─────────────────────────────────────────────────────────────
//
//  BOILERPLATE SIGNATURE                          DETECTED AS
//  ────────────────────────────────────────────────────────────
//  int parcelWeightChecker(int* w, int n)         → 'int'
//  int fraudDetectionWindow(int* t, int n, int d) → 'int'
//  int* studentScoreAnalyzer(..., int* returnSize)→ 'int*'
//  double averageCalculator(double* arr, int n)   → 'double'
//  long long maxProduct(int* arr, int n)          → 'long'
//  bool isPalindrome(char* s)                     → 'bool'   *
//  char* reverseString(char* s)                   → 'char*'
//  void sortArray(int* arr, int n)                → 'void'
//  int** groupAnagrams(..., int* rs, int* cs)     → 'int**'
//
//  * bool detection: "bool " prefix in signature
//
//  DASHBOARD TEST CASE FORMAT
//  ────────────────────────────────────────────────────────────
//  int[]        input  → [1, 2, 3, 0, 4]
//  int, int[]   input  → [1,2,3], 9
//  int, int     input  → 5, 3
//  string       input  → "hello"
//  matrix       input  → [[1,2],[3,4]]
//  Expected Output:
//    single int         → 4
//    array              → [10,20,25,30,40]
//    bool               → true
//    string             → hello
// ─────────────────────────────────────────────────────────────
