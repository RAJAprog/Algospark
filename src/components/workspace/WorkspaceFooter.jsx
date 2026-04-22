// src/components/workspace/WorkspaceFooter.jsx
import React from "react";

/**
 * Bottom action bar.
 * Practice: Run | Submit
 * Exam:     Run Code | Save & Next  or  Submit Exam (last question)
 */
export default function WorkspaceFooter({
  mode,
  isRunning,
  onRun,
  onSubmit,
  onSaveAndNext,
  isLastQuestion,
  isSaving,
}) {
  return (
    <footer className="flex items-center justify-end gap-3 px-4 h-12 bg-[#1e1e1e] border-t border-gray-700 shrink-0">
      {/* Run button — always visible */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium
          bg-[#2d2d2d] text-gray-200 border border-gray-600
          hover:border-green-500 hover:text-green-400
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? (
          <>
            <span className="animate-spin text-xs">⟳</span> Running…
          </>
        ) : (
          <>▶ Run Code</>
        )}
      </button>

      {mode === "practice" ? (
        /* Practice: single Submit button */
        <button
          onClick={onSubmit}
          disabled={isRunning}
          className="px-4 py-1.5 rounded text-sm font-medium
            bg-green-600 text-white hover:bg-green-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      ) : isLastQuestion ? (
        /* Exam last question: Submit Exam */
        <button
          onClick={onSubmit}
          disabled={isSaving}
          className="px-4 py-1.5 rounded text-sm font-medium
            bg-red-600 text-white hover:bg-red-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Submitting…" : "Submit Exam"}
        </button>
      ) : (
        /* Exam mid-question: Save & Next */
        <button
          onClick={onSaveAndNext}
          disabled={isSaving}
          className="px-4 py-1.5 rounded text-sm font-medium
            bg-green-600 text-white hover:bg-green-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving…" : "Save & Next →"}
        </button>
      )}
    </footer>
  );
}