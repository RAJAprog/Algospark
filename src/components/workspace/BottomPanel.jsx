// src/components/workspace/BottomPanel.jsx
import React from "react";
import TerminalPanel from "../editor/TerminalPanel";

/**
 * Bottom panel shared by practice and exam modes.
 * Tabs: "testcase" (custom STDIN) | "result" (Judge0 output)
 */
export default function BottomPanel({
  activeTab,
  onTabChange,
  stdin,
  onStdinChange,
  output,
  isRunning,
  mode,           // hide stdin tab in exam mode if desired
}) {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 pt-1 border-b border-gray-700">
        {mode !== "exam" && (
          <button
            onClick={() => onTabChange("testcase")}
            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              activeTab === "testcase"
                ? "bg-[#2d2d2d] text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Testcase
          </button>
        )}
        <button
          onClick={() => onTabChange("result")}
          className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
            activeTab === "result"
              ? "bg-[#2d2d2d] text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {isRunning ? "Running…" : "Test Result"}
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "testcase" && mode !== "exam" ? (
          <div className="h-full flex flex-col gap-2">
            <label className="text-gray-400 text-xs">Custom Input (stdin)</label>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter test input here..."
              className="flex-1 bg-[#2d2d2d] text-gray-200 text-sm font-mono rounded p-2 border border-gray-600 resize-none focus:outline-none focus:border-green-500"
            />
          </div>
        ) : (
          <TerminalPanel output={output} isLoading={isRunning} />
        )}
      </div>
    </div>
  );
}