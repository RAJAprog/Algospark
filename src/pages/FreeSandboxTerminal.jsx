import React, { useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { executeCode } from "../api/compilerService";

// ── Constants ─────────────────────────────────────────────────

const LANGUAGES = [
  { label: "C++",        value: "cpp",        monaco: "cpp"        },
  { label: "Python",     value: "python",     monaco: "python"     },
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Java",       value: "java",       monaco: "java"       },
  { label: "C",          value: "c",          monaco: "c"          },
];

const SANDBOX_BOILERPLATE = {
  cpp:
    '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    //  write any C++ code and click Run\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
  python:
    '# write any Python code and click Run\nprint("Hello, World!")\n',
  javascript:
    '// write any JavaScript code and click Run\nconsole.log("Hello, World!");\n',
  java:
    'public class Main {\n    public static void main(String[] args) {\n        //  write any Java code and click Run\n        System.out.println("Hello, World!");\n    }\n}\n',
  c:
    '#include <stdio.h>\n\nint main() {\n    //  write any C code and click Run\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
};

// ── Drag helper ───────────────────────────────────────────────

function usePanelDrag(onMove) {
  return useCallback((e) => {
    e.preventDefault();
    const ox = e.clientX, oy = e.clientY;
    const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
    const up = () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
  }, [onMove]);
}

// ── Main component ────────────────────────────────────────────

/**
 * FreeSandboxTerminal
 *
 * Props:
 *   dark      {boolean}  – dark / light theme (default: true)
 *   onBack    {function} – optional callback for a "← Back" button
 *   standalone{boolean}  – if true, renders full-page with its own nav
 */
export default function FreeSandboxTerminal({ dark: darkProp, onBack, standalone = false }) {
  const [dark,      setDark]      = useState(darkProp !== undefined ? darkProp : true);
  const [lang,      setLang]      = useState("cpp");
  const [code,      setCode]      = useState(SANDBOX_BOILERPLATE["cpp"]);
  const [stdin,     setStdin]     = useState("");
  const [output,    setOutput]    = useState("");
  const [running,   setRunning]   = useState(false);
  const [tab,       setTab]       = useState("stdin"); // "stdin" | "output"
  const [editorPct, setEditorPct] = useState(50); // FIX 1: was 65, reduced to 50
  const containerRef = useRef(null);

  const langObj = LANGUAGES.find(l => l.value === lang) ?? LANGUAGES[0];

  // ── Handlers ─────────────────────────────────────────────────

  const handleLangChange = (next) => {
    setLang(next);
    setCode(SANDBOX_BOILERPLATE[next] || "");
    setOutput("");
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setTab("output");
    setOutput("⏳ Running...");
    try {
      const r = await executeCode(lang, code, stdin, 5000);
      let txt = "";
      if      (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
      else if (r.stderr)          txt = `Runtime Error:\n${r.stderr}`;
      else                        txt = r.stdout || "(empty output)";
      setOutput(txt);
    } catch (e) {
      setOutput("Execution Error: " + e.message);
    }
    setRunning(false);
  };

  const handleReset = () => {
    setCode(SANDBOX_BOILERPLATE[lang] || "");
    setOutput("");
    setStdin("");
    setTab("stdin");
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!running) handleRun();
    }
  };

  const vertDrag = usePanelDrag(useCallback((_, dy) => {
    if (!containerRef.current) return;
    setEditorPct(p =>
      // FIX 4: was Math.min(85, ...), reduced max to 70 so output panel always has space
      Math.min(70, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100))
    );
  }, []));

  // ── Theme tokens ──────────────────────────────────────────────

  const D           = dark;
  const pageBg      = D ? "#0d1117" : "#f0f2f5";
  const navBg       = D ? "#161b22" : "#ffffff";
  const navBorder   = D ? "#21262d" : "#e2e8f0";
  const navMuted    = D ? "#6b7280" : "#94a3b8";
  const panelBg     = D ? "#161b22" : "#ffffff";
  const panelBorder = D ? "#21262d" : "#e2e8f0";
  const termBg      = D ? "#0d1117" : "#ffffff";
  const termText    = D ? "#e6edf3" : "#1f2937";
  const termBorder  = D ? "#21262d" : "#e5e7eb";
  const termInput   = D ? "#0d1117" : "#f9fafb";
  const mutedText   = D ? "#6b7280" : "#64748b";
  const selectBg    = D ? "#161b22" : "#ffffff";
  const selectText  = D ? "#e2e8f0" : "#1e293b";
  const dragBg      = D ? "#21262d" : "#cbd5e1";
  const tabActive   = D ? "#ffffff"  : "#0f172a";
  const tabInactive = D ? "#6b7280"  : "#64748b";
  const btnRunBg    = D ? "#21262d" : "#f1f5f9";
  const btnRunBd    = D ? "#30363d" : "#cbd5e1";

  const outputIsError =
    output.startsWith("Compilation Error") ||
    output.startsWith("Runtime Error") ||
    output.startsWith("Execution Error");
  const outputColor = outputIsError
    ? (D ? "#f87171" : "#dc2626")
    : (D ? "#e6edf3" : "#1f2937");

  // ── Inner layout (shared between standalone and embedded) ─────

  const inner = (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: pageBg,
        gap: 6,
        padding: 6,
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", background: panelBg, border: `1px solid ${panelBorder}`,
        borderRadius: 10, flexShrink: 0, gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#ffa116" }}>
            ⚡ MIND SPARK
          </span>
          <span style={{
            fontSize: 10, color: mutedText, padding: "2px 10px", borderRadius: 20,
            border: `1px solid ${panelBorder}`, fontStyle: "italic",
          }}>
            No questions · No test cases · Just write and run code
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Language selector */}
          <select
            value={lang}
            onChange={e => handleLangChange(e.target.value)}
            style={{
              background: selectBg, color: selectText, border: `1px solid ${panelBorder}`,
              borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer",
              fontWeight: 700, outline: "none",
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: btnRunBg, border: `1px solid ${btnRunBd}`,
              color: mutedText, cursor: "pointer",
            }}
          >
            ↺ Reset
          </button>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={running}
            title="Run (Ctrl+Enter)"
            style={{
              padding: "5px 20px", borderRadius: 6, fontSize: 12, fontWeight: 700,
              background: running ? "#22863a" : "#2ea043", color: "#fff", border: "none",
              cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.7 : 1,
            }}
          >
            {running ? "⏳ Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ── */}
      <div style={{
        height: `${editorPct}%`, background: panelBg, border: `1px solid ${panelBorder}`,
        borderRadius: 10, display: "flex", flexDirection: "column",
        overflow: "hidden", flexShrink: 0,
      }}>
        {/* Editor header */}
        <div style={{
          height: 36, display: "flex", alignItems: "center", padding: "0 14px",
          borderBottom: `1px solid ${panelBorder}`, flexShrink: 0, gap: 10,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>
            {langObj.label} · Monaco Editor
          </span>
          <span style={{ fontSize: 10, color: mutedText, marginLeft: "auto", fontStyle: "italic" }}>
            Ctrl+Enter to run
          </span>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <Editor
            theme={D ? "vs-dark" : "light"}
            language={langObj.monaco}
            value={code}
            onChange={v => setCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 22,
              scrollBeyondLastLine: false,
              tabSize: 4,
              wordWrap: "on",
            }}
          />
        </div>
      </div>

      {/* ── Vertical drag handle ── */}
      <div
        onMouseDown={vertDrag}
        style={{ height: 5, cursor: "row-resize", background: dragBg, borderRadius: 3, flexShrink: 0 }}
      />

      {/* ── Stdin / Output panel ── */}
      {/* FIX 2: minHeight raised from 80 to 180 so the panel is always visible */}
      <div style={{
        flex: 1, background: termBg, border: `1px solid ${termBorder}`,
        borderRadius: 10, display: "flex", flexDirection: "column",
        overflow: "hidden", minHeight: 180,
      }}>
        {/* Tab bar */}
        <div style={{
          display: "flex", borderBottom: `1px solid ${termBorder}`,
          height: 40, alignItems: "center", padding: "0 6px", flexShrink: 0,
        }}>
          <button
            onClick={() => setTab("stdin")}
            style={{
              padding: "0 16px", height: "100%", background: "none", border: "none",
              borderBottom: tab === "stdin" ? "2px solid #ffa116" : "2px solid transparent",
              color: tab === "stdin" ? tabActive : tabInactive,
              fontSize: 12, fontWeight: tab === "stdin" ? 700 : 400, cursor: "pointer",
            }}
          >
            📥 Stdin (optional)
          </button>
          <button
            onClick={() => setTab("output")}
            style={{
              padding: "0 16px", height: "100%", background: "none", border: "none",
              borderBottom: tab === "output" ? "2px solid #ffa116" : "2px solid transparent",
              color: tab === "output" ? tabActive : tabInactive,
              fontSize: 12, fontWeight: tab === "output" ? 700 : 400, cursor: "pointer",
            }}
          >
            📤 Output
          </button>

          {/* Status badge */}
          {output && !running && (
            <span style={{
              marginLeft: "auto", marginRight: 8, fontSize: 11, fontWeight: 700,
              color: outputIsError ? (D ? "#f87171" : "#dc2626") : (D ? "#34d399" : "#16a34a"),
            }}>
              {outputIsError ? "❌ Error" : "✅ Done"}
            </span>
          )}
          {running && (
            <span style={{ marginLeft: "auto", marginRight: 8, fontSize: 11, color: mutedText }}>
              ⏳ Running…
            </span>
          )}
        </div>

        {/* Tab content */}
        {/* FIX 3: outer wrapper is position:relative so inner can be absolutely scrollable */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
          {tab === "stdin" ? (
            <div style={{ position: "absolute", inset: 0, padding: 12, display: "flex", flexDirection: "column" }}>
              <textarea
                value={stdin}
                onChange={e => setStdin(e.target.value)}
                placeholder={
                  "Optional stdin — enter any input your program reads\n" +
                  "(e.g. 5\\n1 2 3 4 5 for a program that reads n then n numbers)\n\n" +
                  "Leave empty if your program has no input."
                }
                style={{
                  flex: 1, width: "100%", background: termInput, color: termText,
                  border: "none", resize: "none", fontFamily: "'Courier New', monospace",
                  fontSize: 13, outline: "none", lineHeight: 1.65,
                }}
              />
            </div>
          ) : (
            // FIX 3: absolute fill + overflow:auto ensures the pre scrolls inside the panel
            <div style={{ position: "absolute", inset: 0, padding: 12, overflowY: "auto", overflowX: "auto" }}>
              <pre style={{
                color: outputColor, fontSize: 13, margin: 0,
                whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65,
              }}>
                {output || "Click ▶ Run (or Ctrl+Enter) to execute your code. Output will appear here."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── Standalone full-page wrapper ──────────────────────────────

  if (standalone) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: pageBg }}>
        <style>{`*{box-sizing:border-box;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* Nav */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: 50, background: navBg,
          borderBottom: `1px solid ${navBorder}`, flexShrink: 0, gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: "none", border: "none", color: navMuted,
                  cursor: "pointer", fontSize: 13, padding: "4px 8px",
                }}
              >
                ← Back
              </button>
            )}
            <span style={{ fontSize: 14, fontWeight: 800, color: "#ffa116" }}>⚡ MIND SPARKx</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
              background: "rgba(255,161,22,.12)", color: "#ffa116", letterSpacing: "0.05em",
            }}>
              Free Code · All Languages · No Restrictions
            </span>
          </div>

          {/* Dark / light toggle */}
          <button
            onClick={() => setDark(d => !d)}
            style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 13, background: "none",
              border: `1px solid ${navBorder}`, color: navMuted, cursor: "pointer",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {inner}
        </div>
      </div>
    );
  }

  // ── Embedded (no nav, fills parent) ──────────────────────────

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <style>{`*{box-sizing:border-box;}`}</style>
      {inner}
    </div>
  );
}
