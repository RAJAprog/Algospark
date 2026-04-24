

// // ============================================================
// // src/api/compilerService.js  —  Mind Code Platform
// //
// // .env MUST have:
// //   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
// //
// // HOW IT WORKS (LeetCode-style):
// //   1. Faculty sets methodName="twoSum" and testCases with Python/JS syntax
// //   2. Student writes only the Solution class (or standalone function)
// //   3. runWithTestCases() wraps code with auto-imports + driver for each language
// //   4. normalise() comparison handles [0, 1] == [0,1] == true
// //
// // LANGUAGE-AWARE TRANSFORMATION:
// //   Python / JS  →  pass-through (Python/JS array syntax matches storage)
// //   Java         →  [1,3,5,6]  →  new int[]{1,3,5,6}
// //   C++          →  named variables to fix rvalue reference error
// //   C            →  compound literals + array size injection
// //
// // JAVASCRIPT — supports ALL coding styles:
// //   class Solution { twoSum(...) { } }   ← LeetCode class style
// //   function twoSum(...) { }              ← standalone function
// //   var twoSum = function(...) { }        ← var assignment
// //   const twoSum = (...) => { }           ← arrow function
// //
// // C++ — C++14 compatible (no if constexpr / is_same_v / requires)
// //   Named variable declarations prevent rvalue reference binding error.
// //   Overloaded _print::out() functions handle all return types.
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
//  * Split top-level comma-separated arguments respecting:
//  *   - Quoted strings (no splitting inside "hello, world")
//  *   - Nested arrays  (no splitting inside [1,[2,3]])
//  *   - Char literals  ('a', 'b')
//  */
// const splitTopLevelArgs = (s) => {
//   const args = [];
//   let depth = 0, cur = '', inStr = false, strChar = '';
//   for (let i = 0; i < s.length; i++) {
//     const c = s[i];
//     if (!inStr && (c === '"' || c === "'")) { inStr = true; strChar = c; cur += c; continue; }
//     if (inStr && c === strChar && s[i - 1] !== '\\') { inStr = false; cur += c; continue; }
//     if (inStr) { cur += c; continue; }
//     if (c === '[' || c === '(') { depth++; cur += c; continue; }
//     if (c === ']' || c === ')') { depth--; cur += c; continue; }
//     if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
//     cur += c;
//   }
//   if (cur.trim()) args.push(cur.trim());
//   return args;
// };

// /** Detect element type from array inner content */
// const detectArrayElementType = (inner) => {
//   const s = inner.trim();
//   if (!s) return 'int';
//   if (s.startsWith('[')) return 'nested';
//   const items = splitTopLevelArgs(s);
//   const first = (items[0] || '').trim();
//   if (first.startsWith('"'))                       return 'string';
//   if (first.startsWith("'") && first.length === 3) return 'char';
//   if (first === 'true' || first === 'false')        return 'bool';
//   if (first.match(/^-?\d+\.\d+$/))                 return 'double';
//   return 'int';
// };

// /** Count top-level elements (for C size injection) */
// const countArrayElements = (inner) => {
//   if (!inner.trim()) return 0;
//   return splitTopLevelArgs(inner).length;
// };

// // ─────────────────────────────────────────────────────────────
// // JAVA TRANSFORMER
// // ─────────────────────────────────────────────────────────────
// const transformJavaArg = (arg) => {
//   const a = arg.trim();
//   if (!a) return a;
//   if (a.startsWith('[') && a.endsWith(']')) {
//     const inner = a.slice(1, -1).trim();
//     if (!inner) return 'new int[]{}';
//     const type = detectArrayElementType(inner);
//     if (type === 'nested') {
//       const rows = splitTopLevelArgs(inner);
//       const converted = rows.map(r => {
//         const t = r.trim();
//         return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
//       });
//       return `new int[][]{ ${converted.join(', ')} }`;
//     }
//     if (type === 'string') return `new String[]{${inner}}`;
//     if (type === 'char')   return `new char[]{${inner}}`;
//     if (type === 'bool')   return `new boolean[]{${inner}}`;
//     if (type === 'double') return `new double[]{${inner}}`;
//     return `new int[]{${inner}}`;
//   }
//   // Single-quoted multi-char → Java String
//   if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;
//   return a;
// };

// const transformArgsForJava = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return '';
//   return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
// };

// // ─────────────────────────────────────────────────────────────
// // C++ TRANSFORMER — Named variables to fix rvalue reference error
// // Returns { decls: string[], callArgs: string[] }
// // ─────────────────────────────────────────────────────────────
// const buildCppNamedVars = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
//   const args = splitTopLevelArgs(inputArgs);
//   const decls = [], callArgs = [];
//   args.forEach((arg, i) => {
//     const a = arg.trim();
//     if (a.startsWith('[') && a.endsWith(']')) {
//       const inner = a.slice(1, -1).trim();
//       const type  = detectArrayElementType(inner);
//       const name  = `_a${i}`;
//       if (!inner) { decls.push(`vector<int> ${name} = {};`); callArgs.push(name); return; }
//       if (type === 'nested') {
//         const rows = splitTopLevelArgs(inner);
//         const cv = rows.map(r => {
//           const t = r.trim();
//           return (t.startsWith('[') && t.endsWith(']')) ? `{${t.slice(1, -1)}}` : t;
//         });
//         decls.push(`vector<vector<int>> ${name} = {${cv.join(', ')}};`);
//         callArgs.push(name); return;
//       }
//       const cppType = { string:'vector<string>', char:'vector<char>', bool:'vector<bool>', double:'vector<double>', int:'vector<int>' }[type] || 'vector<int>';
//       decls.push(`${cppType} ${name} = {${inner}};`);
//       callArgs.push(name);
//     } else {
//       callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
//     }
//   });
//   return { decls, callArgs };
// };

// // ─────────────────────────────────────────────────────────────
// // C TRANSFORMER — Compound literals + size injection
// // ─────────────────────────────────────────────────────────────
// const transformArgsForC = (inputArgs) => {
//   if (!inputArgs || !inputArgs.trim()) return '&returnSize';
//   const args = splitTopLevelArgs(inputArgs);
//   const result = [];
//   args.forEach(arg => {
//     const a = arg.trim();
//     if (a.startsWith('[') && a.endsWith(']')) {
//       const inner = a.slice(1, -1).trim();
//       result.push(`(int[]){${inner}}`);
//       result.push(String(countArrayElements(inner)));
//     } else {
//       result.push(a);
//     }
//   });
//   result.push('&returnSize');
//   return result.join(', ');
// };

// const transformArgsForPython = (inputArgs) => inputArgs || '';
// const transformArgsForJs     = (inputArgs) => (inputArgs || '').replace(/'/g, '"');

// // ─────────────────────────────────────────────────────────────
// // LANGUAGE WRAPPERS
// // ─────────────────────────────────────────────────────────────
// const WRAPPERS = {

//   // ── Python ─────────────────────────────────────────────────
//   python: (userCode, inputArgs, methodName) => {
//     const args = transformArgsForPython(inputArgs);
//     return `import sys
// from typing import List, Dict, Optional, Tuple, Set, Any, Union
// from collections import defaultdict, deque, Counter, OrderedDict
// import heapq, math, itertools, functools, bisect, re, string

// ${userCode}

// if __name__ == "__main__":
//     try:
//         _sol = Solution()
//         _result = _sol.${methodName}(${args})
//         def _fmt(v):
//             if isinstance(v, list): return "[" + ",".join(_fmt(x) for x in v) + "]"
//             if isinstance(v, bool): return "true" if v else "false"
//             if v is None: return "null"
//             if isinstance(v, str): return v
//             return str(v)
//         print(_fmt(_result))
//     except Exception as _e:
//         print(f"Error: {_e}", file=sys.stderr)`;
//   },

//   // ── JavaScript ─────────────────────────────────────────────
//   // Supports ALL styles with nested try-catch for robust detection:
//   //   class Solution { twoSum(...) }     → class style
//   //   function twoSum(...) {}             → function declaration
//   //   var/let/const twoSum = function(){} → variable assignment
//   //   const twoSum = (...) => {}          → arrow function
//   javascript: (userCode, inputArgs, methodName) => {
//     const args = transformArgsForJs(inputArgs);
//     return `${userCode}

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
//     } catch (_ignore) { /* class not in scope or has no method, try function */ }

//     // Attempt 2: standalone function ${methodName}(...) or var ${methodName} = ...
//     if (!_called) {
//       try {
//         if (typeof ${methodName} !== "undefined" && typeof ${methodName} === "function") {
//           _result = ${methodName}(${args});
//           _called = true;
//         }
//       } catch (_ignore2) { /* not a function */ }
//     }

//     if (!_called) {
//       throw new Error("Solution not found. Write either:\\n  class Solution { ${methodName}(...) { } }\\nor:\\n  function ${methodName}(...) { }");
//     }

//     function _fmt(v) {
//       if (Array.isArray(v)) return "[" + v.map(_fmt).join(",") + "]";
//       if (v === null || v === undefined) return "null";
//       if (typeof v === "boolean") return v ? "true" : "false";
//       return String(v);
//     }
//     console.log(_fmt(_result));
//   } catch (e) {
//     process.stderr.write("Error: " + e.message + "\\n");
//   }
// })();`;
//   },

//   // ── Java ───────────────────────────────────────────────────
//   java: (userCode, inputArgs, methodName) => {
//     const args = transformArgsForJava(inputArgs);
//     return `import java.util.*;
// import java.util.stream.*;

// ${userCode}

// class Main {
//     public static void main(String[] args) {
//         try {
//             Solution sol = new Solution();
//             Object result = sol.${methodName}(${args});
//             System.out.println(fmt(result));
//         } catch (Exception e) {
//             System.err.println("Error: " + e.getMessage());
//         }
//     }
//     static String fmt(Object r) {
//         if (r == null) return "null";
//         if (r instanceof boolean[]) {
//             boolean[] a = (boolean[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof int[]) {
//             int[] a = (int[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof long[]) {
//             long[] a = (long[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof double[]) {
//             double[] a = (double[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof char[]) {
//             char[] a = (char[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof String[]) {
//             String[] a = (String[]) r; StringBuilder sb = new StringBuilder("[");
//             for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
//             return sb.append("]").toString();
//         }
//         if (r instanceof List) {
//             return ((List<?>) r).stream().map(Main::fmt).collect(Collectors.joining(",", "[", "]"));
//         }
//         if (r instanceof Boolean) return (Boolean) r ? "true" : "false";
//         return r.toString();
//     }
// }`;
//   },

//   // ── C++ ────────────────────────────────────────────────────
//   // Fix 1 (rvalue ref): named variable declarations before call.
//   // Fix 2 (C++17 features): overloaded _print::out() — C++14 compatible.
//   cpp: (userCode, inputArgs, methodName) => {
//     const { decls, callArgs } = buildCppNamedVars(inputArgs);
//     // Build the declaration block — each decl on its own line, indented
//     const declBlock = decls.map(d => `    ${d}`).join('\n');
//     const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;

//     return `#include <bits/stdc++.h>
// using namespace std;

// ${userCode}

// // C++14-compatible output helpers
// // No if constexpr, no is_same_v, no requires — works on gcc-9 default
// namespace _print {
//     void out(int v)               { cout << v; }
//     void out(long v)              { cout << v; }
//     void out(long long v)         { cout << v; }
//     void out(unsigned int v)      { cout << v; }
//     void out(unsigned long v)     { cout << v; }
//     void out(unsigned long long v){ cout << v; }
//     void out(double v)            { cout << v; }
//     void out(float v)             { cout << v; }
//     void out(bool v)              { cout << (v ? "true" : "false"); }
//     void out(char v)              { cout << v; }
//     void out(const string& v)     { cout << v; }
//     void out(const char* v)       { cout << v; }
//     // 1-D vector
//     template<typename T>
//     void out(const vector<T>& v) {
//         cout << "[";
//         for (size_t i = 0; i < v.size(); i++) {
//             if (i) cout << ",";
//             out(v[i]);
//         }
//         cout << "]";
//     }
//     // 2-D vector
//     template<typename T>
//     void out(const vector<vector<T>>& v) {
//         cout << "[";
//         for (size_t i = 0; i < v.size(); i++) {
//             if (i) cout << ",";
//             out(v[i]);
//         }
//         cout << "]";
//     }
//     // pair
//     template<typename A, typename B>
//     void out(const pair<A,B>& p) {
//         cout << "["; out(p.first); cout << ","; out(p.second); cout << "]";
//     }
// }

// int main() {
//     ios_base::sync_with_stdio(false);
//     cin.tie(NULL);
//     Solution sol;
// ${declBlock}
//     auto result = ${callExpr};
//     _print::out(result);
//     cout << endl;
//     return 0;
// }`;
//   },

//   // ── C ──────────────────────────────────────────────────────
//   // Compound literals (int[]){...} + auto-injected array sizes
//   c: (userCode, inputArgs, methodName) => {
//     const args = transformArgsForC(inputArgs);
//     return `#include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include <stdbool.h>

// ${userCode}

// int main() {
//     int returnSize = 0;
//     int* result = ${methodName}(${args});
//     if (result == NULL || returnSize == 0) { printf("null\\n"); return 0; }
//     printf("[");
//     for (int i = 0; i < returnSize; i++) { if (i) printf(","); printf("%d", result[i]); }
//     printf("]\\n");
//     if (result) free(result);
//     return 0;
// }`;
//   },
// };

// // ─────────────────────────────────────────────────────────────
// // Normalise output for comparison
// // ─────────────────────────────────────────────────────────────
// const normalise = (raw) => {
//   if (!raw && raw !== 0) return '';
//   return String(raw)
//     .trim()
//     .replace(/\s+/g,  '')
//     .replace(/True/g,  'true')
//     .replace(/False/g, 'false')
//     .replace(/None/g,  'null')
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
// // executeCode — raw execution (custom Run button, no wrapper)
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
//       try { finalCode = wrapFn(sourceCode, tc.input || '', methodName); } catch (_) { finalCode = sourceCode; }
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

//   return { results, passedCount, totalCount: testCases.length, allPassed: passedCount === testCases.length, visiblePassed, visibleTotal: visibleCases.length, firstFailure };
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
// export const previewInputTransform = (inputArgs) => {
//   const { decls, callArgs } = buildCppNamedVars(inputArgs);
//   return {
//     python:     transformArgsForPython(inputArgs),
//     javascript: transformArgsForJs(inputArgs),
//     java:       transformArgsForJava(inputArgs),
//     cpp:        decls.length ? `${decls.join('\n')} → call: (${callArgs.join(', ')})` : `(${callArgs.join(', ')})`,
//     c:          transformArgsForC(inputArgs),
//   };
// };


































// ============================================================
// src/api/compilerService.js  —  Mind Code Platform
//
// .env MUST have:
//   VITE_COMPILER_API_URL="https://judge0-ce.p.rapidapi.com"
//
// ╔══════════════════════════════════════════════════════════╗
// ║  COMPLETE LEETCODE-STYLE I/O SUPPORT — ALL TYPES        ║
// ╠══════════════════════════════════════════════════════════╣
// ║  Primitives:  int, long, float/double, bool, char,      ║
// ║               string, null/None/nullptr                 ║
// ║  1-D arrays:  int[], string[], double[], bool[], char[] ║
// ║  2-D arrays:  int[][], string[][], etc.                 ║
// ║  Linked List: [1,2,3] → ListNode chain                  ║
// ║  Binary Tree: [1,2,3,null,4] → TreeNode BFS build       ║
// ║  Matrix:      [[1,2],[3,4]] → 2D grid                   ║
// ║  Tuple/Pair:  [val1, val2] (two-element returns)        ║
// ║  Multi-arg:   array, int | array, array | any combo     ║
// ║  Return types: same as input + void (in-place modify)   ║
// ╚══════════════════════════════════════════════════════════╝
//
// HOW IT WORKS:
//   1. Faculty sets methodName + testCases (Python-style input)
//   2. Student writes only the Solution class body
//   3. runWithTestCases() wraps code with drivers per language
//   4. normalise() handles spacing/case/format differences
//
// OUTPUT NORMALISATION handles:
//   [0, 1] == [0,1]  |  True == true  |  None == null
//   "hello" == hello  |  1.0 == 1  |  -0 == 0
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
 * Split top-level comma-separated arguments.
 * Respects: quoted strings, nested arrays [], nested parens (),
 *           nested braces {}, char literals 'x'
 *
 * Examples:
 *   "[1,2,3], 9"          → ["[1,2,3]", "9"]
 *   "[1,2], [3,4]"        → ["[1,2]", "[3,4]"]
 *   "[[1,2],[3,4]], true" → ["[[1,2],[3,4]]", "true"]
 *   '"hello, world", 3'   → ['"hello, world"', "3"]
 */
const splitTopLevelArgs = (s) => {
  if (!s || !s.trim()) return [];
  const args = [];
  let depth = 0, cur = '', inStr = false, strChar = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    // String handling
    if (!inStr && (c === '"' || c === "'")) {
      // detect char literal like 'a' vs start of multi-char
      inStr = true; strChar = c; cur += c; continue;
    }
    if (inStr && c === strChar && s[i - 1] !== '\\') {
      inStr = false; cur += c; continue;
    }
    if (inStr) { cur += c; continue; }
    // Depth tracking
    if (c === '[' || c === '(' || c === '{') { depth++; cur += c; continue; }
    if (c === ']' || c === ')' || c === '}') { depth--; cur += c; continue; }
    // Split on top-level commas
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
};

/**
 * Detect the value type of a single argument string.
 * Returns one of: 'null', 'bool', 'int', 'long', 'double', 'char',
 *                 'string', 'array', 'matrix', 'linkedlist_hint', 'tree_hint'
 *
 * NOTE: linkedlist_hint and tree_hint are detected by context/metadata,
 *       not purely from the value. The value [1,2,3] is just an array —
 *       the faculty's question type metadata tells us it's a linked list.
 *       So at this layer we return 'array' or 'matrix' and let the
 *       language wrappers decide how to build the structure.
 */
const detectType = (val) => {
  const v = val.trim();
  if (v === 'null' || v === 'None' || v === 'nullptr' || v === 'NULL') return 'null';
  if (v === 'true' || v === 'false' || v === 'True' || v === 'False') return 'bool';
  if (v.startsWith('"') && v.endsWith('"')) return 'string';
  if (v.startsWith("'") && v.endsWith("'") && v.length === 3) return 'char';
  if (v.startsWith("'") && v.endsWith("'") && v.length > 3) return 'string'; // multi-char quoted → string
  if (v.startsWith('[') && v.endsWith(']')) {
    // Check if it's a 2-D matrix: inner elements start with '['
    const inner = v.slice(1, -1).trim();
    if (!inner) return 'array'; // empty array
    const firstItem = splitTopLevelArgs(inner)[0] || '';
    if (firstItem.trim().startsWith('[')) return 'matrix';
    return 'array';
  }
  if (v.match(/^-?\d+\.\d+([eE][+-]?\d+)?$/)) return 'double';
  if (v.match(/^-?\d+[lL]$/) || (v.match(/^-?\d+$/) && (parseInt(v) > 2147483647 || parseInt(v) < -2147483648))) return 'long';
  if (v.match(/^-?\d+$/)) return 'int';
  return 'string'; // fallback — unquoted strings like variable names
};

/**
 * Detect the element type inside an array's inner content string.
 * inner = content between outer brackets, e.g. "1,2,3" or '"a","b"'
 */
const detectArrayElementType = (inner) => {
  const s = inner.trim();
  if (!s) return 'int';
  if (s.startsWith('[')) return 'nested'; // 2-D
  const items = splitTopLevelArgs(s);
  const first = (items[0] || '').trim();
  if (!first) return 'int';
  if (first.startsWith('"'))                                  return 'string';
  if (first.startsWith("'") && first.length === 3)            return 'char';
  if (first === 'true' || first === 'false')                   return 'bool';
  if (first === 'null' || first === 'None')                    return 'null_elem'; // array of nullables
  if (first.match(/^-?\d+\.\d+$/))                            return 'double';
  if (first.match(/^-?\d+[lL]$/))                             return 'long';
  return 'int';
};

/** Count top-level elements inside array brackets (for C size) */
const countArrayElements = (inner) => {
  if (!inner || !inner.trim()) return 0;
  return splitTopLevelArgs(inner).length;
};

// ─────────────────────────────────────────────────────────────
// PYTHON WRAPPER
// Handles ALL types natively — Python is dynamically typed.
// Linked lists and trees are built with helper classes injected
// into the driver code.
// ─────────────────────────────────────────────────────────────
const PYTHON_HELPERS = `
# ── Data structure helpers ───────────────────────────────────
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _build_linked_list(arr):
    if not arr: return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def _linked_list_to_list(node):
    result, seen = [], set()
    while node and id(node) not in seen:
        seen.add(id(node))
        result.append(node.val)
        node = node.next
    return result

def _build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def _tree_to_list(root):
    if not root: return []
    result, queue = [], [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

def _fmt(v):
    if isinstance(v, ListNode): return _fmt(_linked_list_to_list(v))
    if isinstance(v, TreeNode): return _fmt(_tree_to_list(v))
    if isinstance(v, list):
        return "[" + ",".join(_fmt(x) for x in v) + "]"
    if isinstance(v, tuple):
        return "[" + ",".join(_fmt(x) for x in v) + "]"
    if isinstance(v, bool):  return "true" if v else "false"
    if v is None:            return "null"
    if isinstance(v, str):   return v
    if isinstance(v, float):
        # normalise: 1.0 → "1.0", but keep precision for non-integers
        if v == int(v) and abs(v) < 1e15: return str(int(v))
        return str(v)
    return str(v)
# ─────────────────────────────────────────────────────────────
`;

const buildPythonWrapper = (userCode, inputArgs, methodName) => {
  const args = inputArgs || '';
  return `import sys
from typing import List, Dict, Optional, Tuple, Set, Any, Union
from collections import defaultdict, deque, Counter, OrderedDict
import heapq, math, itertools, functools, bisect, re, string, json
${PYTHON_HELPERS}
${userCode}

if __name__ == "__main__":
    try:
        _sol = Solution()
        _result = _sol.${methodName}(${args})
        # If result is None (void / in-place), try to print the first arg if it's a list
        if _result is None:
            _first_arg = None
            try:
                _first_arg = (${args || 'None'},)[0] if '${args}' else None
            except Exception:
                pass
            if isinstance(_first_arg, list):
                print(_fmt(_first_arg))
            else:
                print("null")
        else:
            print(_fmt(_result))
    except Exception as _e:
        print(f"Error: {_e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
`;
};

// ─────────────────────────────────────────────────────────────
// JAVASCRIPT WRAPPER
// ─────────────────────────────────────────────────────────────
const JS_HELPERS = `
// ── Data structure helpers ────────────────────────────────────
function ListNode(val, next) { this.val = (val===undefined?0:val); this.next = (next===undefined?null:next); }
function TreeNode(val, left, right) { this.val = (val===undefined?0:val); this.left = (left===undefined?null:left); this.right = (right===undefined?null:right); }

function _buildLinkedList(arr) {
  if (!arr || !arr.length) return null;
  let head = new ListNode(arr[0]), cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}
function _linkedListToArr(node) {
  const r = [], seen = new Set();
  while (node && !seen.has(node)) { seen.add(node); r.push(node.val); node = node.next; }
  return r;
}
function _buildTree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]), queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}
function _treeToArr(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) { result.push(node.val); queue.push(node.left); queue.push(node.right); }
    else { result.push(null); }
  }
  while (result.length && result[result.length-1] === null) result.pop();
  return result;
}
function _fmt(v) {
  if (v instanceof ListNode) return _fmt(_linkedListToArr(v));
  if (v instanceof TreeNode) return _fmt(_treeToArr(v));
  if (Array.isArray(v)) return "[" + v.map(_fmt).join(",") + "]";
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") {
    if (Number.isInteger(v)) return String(v);
    return String(v);
  }
  return String(v);
}
`;

const buildJsWrapper = (userCode, inputArgs, methodName) => {
  const args = (inputArgs || '').replace(/'/g, '"');
  return `${JS_HELPERS}
${userCode}

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
    } catch (_ignore) {}

    // Attempt 2: standalone function or arrow/var
    if (!_called) {
      try {
        if (typeof ${methodName} !== "undefined" && typeof ${methodName} === "function") {
          _result = ${methodName}(${args});
          _called = true;
        }
      } catch (_ignore2) {}
    }

    if (!_called) {
      throw new Error("Solution not found. Write: class Solution { ${methodName}(...) { } } or function ${methodName}(...) { }");
    }

    // void / in-place: try printing first arg if array
    if (_result === undefined || _result === null) {
      const _firstArgVal = (function(){ try { return (${args || 'undefined'}, [${args || ''}])[0]; } catch(_){ return undefined; } })();
      if (Array.isArray(_firstArgVal)) { console.log(_fmt(_firstArgVal)); }
      else { console.log("null"); }
    } else {
      console.log(_fmt(_result));
    }
  } catch (e) {
    process.stderr.write("Error: " + e.message + "\\n");
  }
})();
`;
};

// ─────────────────────────────────────────────────────────────
// JAVA TRANSFORMER + WRAPPER
// ─────────────────────────────────────────────────────────────

/**
 * Transform a single argument from Python/JSON syntax → Java syntax.
 * Handles: arrays, nested arrays, strings, chars, bools, nulls, numbers.
 */
const transformJavaArg = (arg) => {
  const a = arg.trim();
  if (!a) return a;

  const t = detectType(a);

  if (t === 'null') return 'null';
  if (t === 'bool') return a === 'True' ? 'true' : a === 'False' ? 'false' : a;
  if (t === 'char') return a; // 'x' is valid Java char literal

  if (t === 'string') {
    // Normalise quotes to double-quotes
    if (a.startsWith("'") && a.endsWith("'")) return '"' + a.slice(1, -1) + '"';
    return a;
  }

  if (t === 'matrix') {
    const inner = a.slice(1, -1).trim();
    const rows = splitTopLevelArgs(inner);
    const converted = rows.map(r => {
      const rt = r.trim();
      if (rt.startsWith('[') && rt.endsWith(']')) {
        const rowInner = rt.slice(1, -1).trim();
        const elemType = detectArrayElementType(rowInner);
        if (elemType === 'string') return `{${rowInner}}`;
        if (elemType === 'bool')   return `{${rowInner}}`;
        if (elemType === 'double') return `{${rowInner}}`;
        return `{${rowInner}}`;
      }
      return rt;
    });
    return `new int[][]{ ${converted.join(', ')} }`;
  }

  if (t === 'array') {
    const inner = a.slice(1, -1).trim();
    if (!inner) return 'new int[]{}';
    const elemType = detectArrayElementType(inner);
    if (elemType === 'string')     return `new String[]{${inner}}`;
    if (elemType === 'char')       return `new char[]{${inner}}`;
    if (elemType === 'bool')       return `new boolean[]{${inner}}`;
    if (elemType === 'double')     return `new double[]{${inner}}`;
    if (elemType === 'long')       return `new long[]{${inner}}`;
    if (elemType === 'null_elem')  return `new Integer[]{${inner.replace(/null/g, 'null')}}`;
    return `new int[]{${inner}}`;
  }

  // Single-quoted multi-char string → Java String
  if (a.startsWith("'") && a.endsWith("'") && a.length > 3) return `"${a.slice(1, -1)}"`;

  return a;
};

const transformArgsForJava = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '';
  return splitTopLevelArgs(inputArgs).map(a => transformJavaArg(a.trim())).join(', ');
};

const JAVA_HELPERS = `
    // ── ListNode ──────────────────────────────────────────────
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
    }
    static ListNode buildLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]), cur = head;
        for (int i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
        return head;
    }
    static int[] linkedListToArray(ListNode head) {
        java.util.List<Integer> r = new java.util.ArrayList<>();
        java.util.Set<ListNode> seen = new java.util.HashSet<>();
        while (head != null && !seen.contains(head)) { seen.add(head); r.add(head.val); head = head.next; }
        return r.stream().mapToInt(Integer::intValue).toArray();
    }
    // ── TreeNode ──────────────────────────────────────────────
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int v) { val = v; }
    }
    static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.add(root); int i = 1;
        while (!q.isEmpty() && i < arr.length) {
            TreeNode node = q.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); q.add(node.left); } i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); q.add(node.right); } i++;
        }
        return root;
    }
    static String fmtTree(TreeNode root) {
        if (root == null) return "[]";
        java.util.List<String> r = new java.util.ArrayList<>();
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n != null) { r.add(String.valueOf(n.val)); q.add(n.left); q.add(n.right); }
            else { r.add("null"); }
        }
        while (!r.isEmpty() && r.get(r.size()-1).equals("null")) r.remove(r.size()-1);
        return "[" + String.join(",", r) + "]";
    }
    // ── Universal formatter ───────────────────────────────────
    static String fmt(Object r) {
        if (r == null) return "null";
        if (r instanceof TreeNode)  return fmtTree((TreeNode) r);
        if (r instanceof ListNode) {
            int[] arr = linkedListToArray((ListNode) r);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) { if (i>0) sb.append(","); sb.append(arr[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof boolean[]) {
            boolean[] a = (boolean[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof int[]) {
            int[] a = (int[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof long[]) {
            long[] a = (long[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof double[]) {
            double[] a = (double[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof char[]) {
            char[] a = (char[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof String[]) {
            String[] a = (String[]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (r instanceof int[][]) {
            int[][] a = (int[][]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append("[");
                for (int j = 0; j < a[i].length; j++) { if (j>0) sb.append(","); sb.append(a[i][j]); }
                sb.append("]"); }
            return sb.append("]").toString();
        }
        if (r instanceof char[][]) {
            char[][] a = (char[][]) r; StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i>0) sb.append(","); sb.append("[");
                for (int j = 0; j < a[i].length; j++) { if (j>0) sb.append(","); sb.append(a[i][j]); }
                sb.append("]"); }
            return sb.append("]").toString();
        }
        if (r instanceof List) {
            List<?> lst = (List<?>) r;
            // Check if it's List<List<...>>
            if (!lst.isEmpty() && lst.get(0) instanceof List) {
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < lst.size(); i++) { if (i>0) sb.append(","); sb.append(fmt(lst.get(i))); }
                return sb.append("]").toString();
            }
            return lst.stream().map(Main::fmt).collect(Collectors.joining(",", "[", "]"));
        }
        if (r instanceof Boolean) return (Boolean) r ? "true" : "false";
        if (r instanceof Double) {
            double d = (Double) r;
            if (d == Math.floor(d) && !Double.isInfinite(d)) return String.valueOf((long)d);
            return r.toString();
        }
        return r.toString();
    }
`;

const buildJavaWrapper = (userCode, inputArgs, methodName) => {
  const args = transformArgsForJava(inputArgs);
  return `import java.util.*;
import java.util.stream.*;

${userCode}

class Main {
    ${JAVA_HELPERS}
    public static void main(String[] args) {
        try {
            Solution sol = new Solution();
            Object result = sol.${methodName}(${args});
            System.out.println(fmt(result));
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace(System.err);
        }
    }
}
`;
};

// ─────────────────────────────────────────────────────────────
// C++ TRANSFORMER + WRAPPER
// ─────────────────────────────────────────────────────────────

/**
 * Build named C++ variable declarations for all args.
 * Returns { decls: string[], callArgs: string[] }
 *
 * Handles ALL types:
 *   int, long long, double, bool, char, string,
 *   vector<int/string/double/bool/char/long long>,
 *   vector<vector<int>>, vector<vector<string>>
 *   ListNode*, TreeNode*
 */
const buildCppNamedVars = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return { decls: [], callArgs: [] };
  const args = splitTopLevelArgs(inputArgs);
  const decls = [], callArgs = [];

  args.forEach((arg, i) => {
    const a = arg.trim();
    const t = detectType(a);
    const name = `_a${i}`;

    if (t === 'null') {
      decls.push(`void* ${name} = nullptr;`);
      callArgs.push('nullptr');
      return;
    }

    if (t === 'bool') {
      const bval = (a === 'true' || a === 'True') ? 'true' : 'false';
      decls.push(`bool ${name} = ${bval};`);
      callArgs.push(name);
      return;
    }

    if (t === 'char') {
      decls.push(`char ${name} = ${a};`);
      callArgs.push(name);
      return;
    }

    if (t === 'string') {
      const sval = a.startsWith("'") ? '"' + a.slice(1, -1) + '"' : a;
      decls.push(`string ${name} = ${sval};`);
      callArgs.push(name);
      return;
    }

    if (t === 'double') {
      decls.push(`double ${name} = ${a};`);
      callArgs.push(name);
      return;
    }

    if (t === 'long') {
      const lval = a.replace(/[lL]$/, '');
      decls.push(`long long ${name} = ${lval}LL;`);
      callArgs.push(name);
      return;
    }

    if (t === 'int') {
      decls.push(`int ${name} = ${a};`);
      callArgs.push(name);
      return;
    }

    if (t === 'matrix') {
      const inner = a.slice(1, -1).trim();
      const rows = splitTopLevelArgs(inner);
      const elemType = rows.length > 0 ? detectArrayElementType(rows[0].slice(1, -1)) : 'int';
      const cppElem = { string: 'string', char: 'char', bool: 'bool', double: 'double', long: 'long long' }[elemType] || 'int';
      const cv = rows.map(r => {
        const rt = r.trim();
        if (rt.startsWith('[') && rt.endsWith(']')) {
          const rowInner = rt.slice(1, -1);
          if (cppElem === 'string') {
            return `{${rowInner}}`;
          }
          return `{${rowInner}}`;
        }
        return rt;
      });
      decls.push(`vector<vector<${cppElem}>> ${name} = {${cv.join(', ')}};`);
      callArgs.push(name);
      return;
    }

    if (t === 'array') {
      const inner = a.slice(1, -1).trim();
      if (!inner) { decls.push(`vector<int> ${name} = {};`); callArgs.push(name); return; }
      const elemType = detectArrayElementType(inner);
      const typeMap = {
        string: 'vector<string>',
        char:   'vector<char>',
        bool:   'vector<bool>',
        double: 'vector<double>',
        long:   'vector<long long>',
        nested: 'vector<vector<int>>',
      };
      const cppType = typeMap[elemType] || 'vector<int>';
      decls.push(`${cppType} ${name} = {${inner}};`);
      callArgs.push(name);
      return;
    }

    // Fallback: pass as-is (unquoted string arg)
    callArgs.push(a.replace(/^'(.*)'$/, '"$1"'));
  });

  return { decls, callArgs };
};

const CPP_HELPERS = `
// ── ListNode ──────────────────────────────────────────────────
struct ListNode {
    int val; ListNode* next;
    ListNode(int v = 0, ListNode* n = nullptr) : val(v), next(n) {}
};
ListNode* buildLinkedList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]), *cur = head;
    for (size_t i = 1; i < arr.size(); i++) { cur->next = new ListNode(arr[i]); cur = cur->next; }
    return head;
}
// ── TreeNode ──────────────────────────────────────────────────
struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int v = 0) : val(v), left(nullptr), right(nullptr) {}
};
TreeNode* buildTree(const vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q; q.push(root); size_t i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) { node->left = new TreeNode(arr[i]); q.push(node->left); } i++;
        if (i < arr.size() && arr[i] != INT_MIN) { node->right = new TreeNode(arr[i]); q.push(node->right); } i++;
    }
    return root;
}
// ── Output helpers (C++14 compatible) ────────────────────────
namespace _print {
    void out(int v)                { cout << v; }
    void out(long v)               { cout << v; }
    void out(long long v)          { cout << v; }
    void out(unsigned int v)       { cout << v; }
    void out(unsigned long long v) { cout << v; }
    void out(double v)             { if(v==(long long)v && abs(v)<1e15) cout<<(long long)v; else cout<<v; }
    void out(float v)              { cout << v; }
    void out(bool v)               { cout << (v ? "true" : "false"); }
    void out(char v)               { cout << v; }
    void out(const string& v)      { cout << v; }
    void out(const char* v)        { cout << v; }
    // ListNode*
    void out(ListNode* head) {
        cout << "[";
        bool first = true;
        set<ListNode*> seen;
        while (head && !seen.count(head)) { seen.insert(head); if (!first) cout<<","; cout<<head->val; first=false; head=head->next; }
        cout << "]";
    }
    // TreeNode* (BFS level-order)
    void out(TreeNode* root) {
        if (!root) { cout << "[]"; return; }
        vector<string> r; queue<TreeNode*> q; q.push(root);
        while (!q.empty()) {
            TreeNode* n = q.front(); q.pop();
            if (n) { r.push_back(to_string(n->val)); q.push(n->left); q.push(n->right); }
            else   { r.push_back("null"); }
        }
        while (!r.empty() && r.back() == "null") r.pop_back();
        cout << "["; for (size_t i=0;i<r.size();i++){if(i)cout<<",";cout<<r[i];} cout << "]";
    }
    // 1-D vector
    template<typename T>
    void out(const vector<T>& v) {
        cout << "[";
        for (size_t i = 0; i < v.size(); i++) { if (i) cout << ","; out(v[i]); }
        cout << "]";
    }
    // 2-D vector
    template<typename T>
    void out(const vector<vector<T>>& v) {
        cout << "[";
        for (size_t i = 0; i < v.size(); i++) { if (i) cout << ","; out(v[i]); }
        cout << "]";
    }
    // pair
    template<typename A, typename B>
    void out(const pair<A,B>& p) { cout<<"["; out(p.first); cout<<","; out(p.second); cout<<"]"; }
    // tuple (2-elem)
    template<typename A, typename B>
    void out(const tuple<A,B>& t) { cout<<"["; out(get<0>(t)); cout<<","; out(get<1>(t)); cout<<"]"; }
    // tuple (3-elem)
    template<typename A, typename B, typename C>
    void out(const tuple<A,B,C>& t) { cout<<"["; out(get<0>(t)); cout<<","; out(get<1>(t)); cout<<","; out(get<2>(t)); cout<<"]"; }
}
`;

const buildCppWrapper = (userCode, inputArgs, methodName) => {
  const { decls, callArgs } = buildCppNamedVars(inputArgs);
  const declBlock = decls.map(d => `    ${d}`).join('\n');
  const callExpr  = `sol.${methodName}(${callArgs.join(', ')})`;

  return `#include <bits/stdc++.h>
using namespace std;

${CPP_HELPERS}

${userCode}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
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
// C TRANSFORMER + WRAPPER
// ─────────────────────────────────────────────────────────────
//
// C is the most restricted. Strategy:
//   - For questions returning int/long/double/bool → use int/long/double return wrapper
//   - For questions returning int[] → use int* + returnSize wrapper
//   - For questions returning string → use char* wrapper
//   - Matrix inputs → passed as flat array with row/col count
//   - Faculty sets returnType field in the question (defaults to 'int*')
//
// The 'returnType' is stored per-question in Firestore as question.cReturnType.
// Valid values: 'int', 'long', 'double', 'bool', 'char*', 'int*', 'void'
// ─────────────────────────────────────────────────────────────

const transformArgsForC = (inputArgs) => {
  if (!inputArgs || !inputArgs.trim()) return '&returnSize';
  const args = splitTopLevelArgs(inputArgs);
  const result = [];

  args.forEach(arg => {
    const a = arg.trim();
    const t = detectType(a);

    if (t === 'matrix') {
      // Flatten the 2-D array for C
      const inner = a.slice(1, -1).trim();
      const rows = splitTopLevelArgs(inner);
      const rowCount = rows.length;
      const colCount = rows.length > 0 ? countArrayElements(rows[0].slice(1, -1)) : 0;
      const flat = rows.map(r => r.trim().slice(1, -1)).join(', ');
      result.push(`(int[]){${flat}}`);
      result.push(String(rowCount));
      result.push(String(colCount));
      return;
    }

    if (t === 'array') {
      const inner = a.slice(1, -1).trim();
      const elemType = detectArrayElementType(inner);
      const cType = { string: 'char*', char: 'char', bool: 'int', double: 'double', long: 'long long' }[elemType] || 'int';
      result.push(`(${cType}[]){${inner}}`);
      result.push(String(countArrayElements(inner)));
      return;
    }

    if (t === 'bool') {
      result.push((a === 'true' || a === 'True') ? '1' : '0');
      return;
    }

    if (t === 'string') {
      const sval = a.startsWith("'") ? '"' + a.slice(1, -1) + '"' : a;
      result.push(sval);
      return;
    }

    result.push(a);
  });

  return result.join(', ');
};

/**
 * Build the C main() based on the expected return type.
 * cReturnType: 'int' | 'long' | 'double' | 'bool' | 'string' | 'int*' | 'void' | 'int**'
 */
const buildCWrapper = (userCode, inputArgs, methodName, cReturnType = 'int*') => {
  const args = transformArgsForC(inputArgs);

  // Determine if we need &returnSize in args
  const needsReturnSize = cReturnType === 'int*' || cReturnType === 'int**' || cReturnType === 'char**';
  const finalArgs = needsReturnSize
    ? (args ? args + ', &returnSize' : '&returnSize')
    : args;

  let mainBody = '';

  if (cReturnType === 'int') {
    mainBody = `    int result = ${methodName}(${finalArgs});
    printf("%d\\n", result);`;
  } else if (cReturnType === 'long') {
    mainBody = `    long long result = ${methodName}(${finalArgs});
    printf("%lld\\n", result);`;
  } else if (cReturnType === 'double') {
    mainBody = `    double result = ${methodName}(${finalArgs});
    // Print as int if whole number
    if (result == (long long)result) printf("%lld\\n", (long long)result);
    else printf("%g\\n", result);`;
  } else if (cReturnType === 'bool') {
    mainBody = `    int result = ${methodName}(${finalArgs});
    printf("%s\\n", result ? "true" : "false");`;
  } else if (cReturnType === 'string' || cReturnType === 'char*') {
    mainBody = `    char* result = ${methodName}(${finalArgs});
    if (result == NULL) { printf("null\\n"); return 0; }
    printf("%s\\n", result);`;
  } else if (cReturnType === 'void') {
    // In-place modification — print the first array arg
    mainBody = `    ${methodName}(${finalArgs});
    // Print first array arg (assumed to be modified in-place)
    // Faculty: provide the array name/size manually in boilerplate for void returns`;
  } else {
    // Default: int* array return
    mainBody = `    int* result = ${methodName}(${finalArgs});
    if (result == NULL || returnSize == 0) { printf("null\\n"); return 0; }
    printf("[");
    for (int i = 0; i < returnSize; i++) { if (i) printf(","); printf("%d", result[i]); }
    printf("]\\n");
    if (result) free(result);`;
  }

  return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

int main() {
    int returnSize = 0;
${mainBody}
    return 0;
}
`;
};

// ─────────────────────────────────────────────────────────────
// WRAPPERS MAP — unified entry point
// ─────────────────────────────────────────────────────────────
const WRAPPERS = {
  python:     (userCode, inputArgs, methodName, _meta) => buildPythonWrapper(userCode, inputArgs, methodName),
  javascript: (userCode, inputArgs, methodName, _meta) => buildJsWrapper(userCode, inputArgs, methodName),
  java:       (userCode, inputArgs, methodName, _meta) => buildJavaWrapper(userCode, inputArgs, methodName),
  cpp:        (userCode, inputArgs, methodName, _meta) => buildCppWrapper(userCode, inputArgs, methodName),
  c:          (userCode, inputArgs, methodName, meta)  => buildCWrapper(userCode, inputArgs, methodName, meta?.cReturnType || 'int*'),
};

// ─────────────────────────────────────────────────────────────
// BOILERPLATE GENERATOR
// Called by QuestionForm to auto-generate starter code.
//
// questionMeta can carry:
//   paramTypes: ['array', 'int']  → parameter type hints
//   returnType: 'int' | 'array' | 'matrix' | 'bool' | 'string' | ...
//   cReturnType: explicit C return type string
// ─────────────────────────────────────────────────────────────

/**
 * Generate boilerplate code for all languages.
 * @param {string} methodName - camelCase method name
 * @param {Object} meta - { paramTypes, returnType, cReturnType }
 */
export const generateBoilerplates = (methodName, meta = {}) => {
  const m = methodName || 'solution';
  const { paramTypes = ['nums', 'target'], returnType = 'any', cReturnType = 'int*' } = meta;

  // Build param lists per language
  const pyParams  = paramTypes.map((p, i) => typeof p === 'string' && p.includes(':') ? p : `param${i+1}`).join(', ');
  const jsParams  = pyParams;
  const javaParams = paramTypes.map((p, i) => {
    const jt = { 'int': 'int', 'array': 'int[]', 'matrix': 'int[][]', 'string': 'String', 'bool': 'boolean', 'double': 'double', 'long': 'long' }[p] || 'Object';
    return `${jt} param${i+1}`;
  }).join(', ');
  const cppParams = paramTypes.map((p, i) => {
    const ct = { 'int': 'int', 'array': 'vector<int>&', 'matrix': 'vector<vector<int>>&', 'string': 'string', 'bool': 'bool', 'double': 'double', 'long': 'long long' }[p] || 'auto';
    return `${ct} param${i+1}`;
  }).join(', ');
  const cParams = paramTypes.map((p, i) => {
    const ct = { 'int': 'int', 'array': 'int* arr, int arrSize', 'matrix': 'int** mat, int rows, int cols', 'string': 'char*', 'bool': 'int', 'double': 'double' }[p] || 'int';
    return ct.includes('param') ? ct : (ct.includes('arr') || ct.includes('mat') ? ct : `${ct} param${i+1}`);
  }).join(', ');

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
    auto ${m}(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,

    c: cReturnType === 'int'
      ? `int ${m}(int* nums, int numsSize) {
    // Write your solution here
    return 0;
}`
      : cReturnType === 'bool'
      ? `int ${m}(int* nums, int numsSize) {
    // return 1 for true, 0 for false
    return 0;
}`
      : `int* ${m}(int* nums, int numsSize, int* returnSize) {
    *returnSize = 0;
    // Write your solution here
    return NULL;
}`,
  };
};

// ─────────────────────────────────────────────────────────────
// Normalise output for comparison
// Handles all edge cases: spacing, case, Python True/False/None,
// trailing zeros on floats, negative zero
// ─────────────────────────────────────────────────────────────
const normalise = (raw) => {
  if (raw === null || raw === undefined) return '';
  return String(raw)
    .trim()
    .replace(/\s+/g, '')            // remove all whitespace
    .replace(/\bTrue\b/g,  'true')  // Python bool
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g,  'null')  // Python None
    .replace(/\bNULL\b/g,  'null')  // C NULL
    .replace(/\bnullptr\b/g,'null') // C++ nullptr
    .replace(/-0\b/g, '0')          // -0 == 0
    .replace(/\.0+\b/g, '')         // 1.0 == 1 (trailing .0)
    .replace(/(\.\d*?)0+\b/g, '$1') // 1.50 == 1.5
    .replace(/\.$/, '')             // trailing dot
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
// executeCode — raw execution (no LeetCode wrapper)
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
// question object shape:
//   { methodName, testCases, timeLimitMs, cReturnType }
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
  // meta carries language-specific hints (e.g. cReturnType for C)
  const meta = { cReturnType: question?.cReturnType || 'int*' };

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
      try {
        finalCode = wrapFn(sourceCode, tc.input || '', methodName, meta);
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

  return {
    results,
    passedCount,
    totalCount:    testCases.length,
    allPassed:     passedCount === testCases.length,
    visiblePassed,
    visibleTotal:  visibleCases.length,
    firstFailure,
  };
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
export const previewInputTransform = (inputArgs, cReturnType = 'int*') => {
  const { decls, callArgs } = buildCppNamedVars(inputArgs);
  return {
    python:     inputArgs || '',
    javascript: (inputArgs || '').replace(/'/g, '"'),
    java:       transformArgsForJava(inputArgs),
    cpp:        decls.length
                  ? `${decls.join('\n')} → call: (${callArgs.join(', ')})`
                  : `(${callArgs.join(', ')})`,
    c:          transformArgsForC(inputArgs),
  };
};

// ─────────────────────────────────────────────────────────────
// QUESTION INPUT FORMAT REFERENCE
// ─────────────────────────────────────────────────────────────
//
//  TYPE              DASHBOARD INPUT FIELD           EXAMPLE
//  ──────────────────────────────────────────────────────────
//  int               plain number                    9
//  long              plain number                    1000000000
//  double/float      decimal                         3.14
//  bool              true / false                    true
//  char              single-quoted char              'a'
//  string            double-quoted string            "hello"
//  int[]             bracket array                   [1,2,3,4]
//  string[]          bracket array with quotes       ["cat","dog"]
//  bool[]            bracket array                   [true,false,true]
//  double[]          bracket array                   [1.5,2.5,3.0]
//  int[][]  (matrix) nested brackets                 [[1,2],[3,4]]
//  multi-arg         comma-separated                 [1,2,3], 9
//  null / None       null keyword                    null
//
//  OUTPUT FORMAT (Expected Output field):
//  ──────────────────────────────────────
//  int               4
//  bool              true  or  false
//  string            hello  (no quotes needed)
//  int[]             [0,1]  (compact, no spaces)
//  int[][]           [[1,2],[3,4]]
//  null              null
//
//  C LANGUAGE — cReturnType field in question Firestore doc:
//  ──────────────────────────────────────────────────────────
//  'int'   → returns single integer
//  'long'  → returns long long
//  'double'→ returns double
//  'bool'  → returns int (0/1) printed as true/false
//  'char*' → returns a string
//  'int*'  → returns int array (default, needs returnSize)
//  'void'  → in-place modification
// ─────────────────────────────────────────────────────────────
