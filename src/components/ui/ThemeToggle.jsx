// src/components/ui/ThemeToggle.jsx
// ─────────────────────────────────────────────────────────────
// Self-contained toggle. No context, no providers needed.
// Just drop <ThemeToggle /> anywhere and it works.
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    // Read saved preference, default to dark
    return localStorage.getItem("vcodex-theme") !== "light";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
      document.documentElement.style.setProperty("--bg",        "#050b14");
      document.documentElement.style.setProperty("--bg-card",   "#161b22");
      document.documentElement.style.setProperty("--bg-input",  "#0d1117");
      document.documentElement.style.setProperty("--text",      "#f1f5f9");
      document.documentElement.style.setProperty("--text-muted","#64748b");
      document.documentElement.style.setProperty("--border",    "rgba(255,255,255,0.07)");
      localStorage.setItem("vcodex-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light-mode");
      document.documentElement.style.setProperty("--bg",        "#f8fafc");
      document.documentElement.style.setProperty("--bg-card",   "#ffffff");
      document.documentElement.style.setProperty("--bg-input",  "#f1f5f9");
      document.documentElement.style.setProperty("--text",      "#0f172a");
      document.documentElement.style.setProperty("--text-muted","#64748b");
      document.documentElement.style.setProperty("--border",    "rgba(0,0,0,0.08)");
      localStorage.setItem("vcodex-theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "0.4rem",
        background:     dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border:         dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
        borderRadius:   "20px",
        padding:        "0.3rem 0.75rem",
        cursor:         "pointer",
        transition:     "all 0.2s ease",
        flexShrink:     0,
      }}
    >
      {/* Track */}
      <div style={{
        position:   "relative",
        width:      36,
        height:     20,
        borderRadius: 10,
        background: dark ? "#0ea5e9" : "#e2e8f0",
        border:     dark ? "1px solid rgba(14,165,233,0.5)" : "1px solid #cbd5e1",
        transition: "background 0.3s ease",
        flexShrink: 0,
      }}>
        {/* Knob */}
        <div style={{
          position:   "absolute",
          top:        2,
          left:       dark ? 18 : 2,
          width:      14,
          height:     14,
          borderRadius: "50%",
          background: "#fff",
          boxShadow:  dark ? "0 0 6px rgba(14,165,233,0.6)" : "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 0.3s ease",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize:   9,
        }}>
          {dark ? "🌙" : "☀️"}
        </div>
      </div>
      {/* Label */}
      <span style={{
        fontSize:   "0.65rem",
        fontWeight: 600,
        color:      dark ? "#94a3b8" : "#64748b",
        letterSpacing: "0.04em",
        userSelect: "none",
      }}>
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}