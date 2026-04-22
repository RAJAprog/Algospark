// src/components/workspace/WorkspaceHeader.jsx
import React from "react";
import Timer from "../ui/Timer";

const LANGUAGES = [
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
];

export default function WorkspaceHeader({
  mode,
  language,
  onLanguageChange,
  examMeta,
  questionTitle,
  violationCount,
}) {
  return (
    <header className="flex items-center justify-between px-4 h-12 bg-[#1e1e1e] border-b border-gray-700 shrink-0">
      {/* Left: brand + question title */}
      <div className="flex items-center gap-3">
        <span className="text-green-400 font-bold text-sm tracking-wide">
          V-CodeX
        </span>
        {questionTitle && (
          <span className="text-gray-400 text-xs truncate max-w-[200px]">
            {questionTitle}
          </span>
        )}
      </div>

      {/* Right: mode-specific controls */}
      <div className="flex items-center gap-4">
        {mode === "practice" ? (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-[#2d2d2d] text-gray-200 text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-green-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-3">
            {violationCount > 0 && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                ⚠ {violationCount} violation{violationCount > 1 ? "s" : ""}
              </span>
            )}
            <Timer
              durationSeconds={examMeta?.duration ?? 3600}
              onComplete={examMeta?.onTimerEnd}
            />
          </div>
        )}
      </div>
    </header>
  );
}