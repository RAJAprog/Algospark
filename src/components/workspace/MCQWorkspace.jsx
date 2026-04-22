import React from "react";

/**
 * MCQWorkspace
 * Handles the student-facing Multiple Choice Question interface.
 * * @param {Object} question - The current question object from Firestore.
 * @param {String} currentAnswer - The student's currently selected answer for this question.
 * @param {Function} onSave - Callback to update the answer in the exam session state.
 * @param {Boolean} isMarked - Whether this question is marked for review.
 * @param {Function} onToggleMark - Callback to toggle the "Mark for Review" status.
 * @param {Function} onClear - Callback to remove the current selection.
 */
export default function MCQWorkspace({
  question,
  currentAnswer,
  onSave,
  isMarked,
  onToggleMark,
  onClear,
}) {
  if (!question) return null;

  const options = question.options || [];
  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      background: "#0d1117", 
      color: "#e6edf3", 
      padding: "40px",
      overflowY: "auto",
      fontFamily: "'Söhne','Segoe UI',system-ui,sans-serif"
    }}>
      <style>{`
        .mcq-option:hover {
          border-color: #30363d !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .mcq-option.selected {
          border-color: #58a6ff !important;
          background: rgba(88, 166, 255, 0.1) !important;
        }
        .mcq-option.selected .letter-box {
          background: #58a6ff !important;
          color: #fff !important;
          border-color: #58a6ff !important;
        }
      `}</style>

      {/* Header Info */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "32px",
        borderBottom: "1px solid #21262d",
        paddingBottom: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ 
            fontSize: "12px", 
            fontWeight: 800, 
            color: "#8b949e", 
            textTransform: "uppercase", 
            letterSpacing: "0.1em",
            background: "#161b22",
            padding: "4px 12px",
            borderRadius: "6px",
            border: "1px solid #30363d"
          }}>
            MCQ Module
          </span>
          {question.marks && (
            <span style={{ fontSize: "13px", color: "#3fb950", fontWeight: 600 }}>
              +{question.marks} Points
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onToggleMark(question.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              background: isMarked ? "rgba(88,166,255,0.15)" : "#21262d",
              border: `1px solid ${isMarked ? "#58a6ff" : "#30363d"}`,
              color: isMarked ? "#58a6ff" : "#c9d1d9",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isMarked ? "🔖 Marked for Review" : "🏳️ Mark for Review"}
          </button>
          
          {currentAnswer && (
            <button
              onClick={() => onClear(question.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                background: "transparent",
                border: "1px solid #f85149",
                color: "#f85149"
              }}
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div 
        style={{ 
          fontSize: "20px", 
          lineHeight: "1.6", 
          color: "#f0f6fc", 
          marginBottom: "40px",
          fontWeight: 500
        }}
        dangerouslySetInnerHTML={{ __html: question.description || question.question }}
      />

      {/* Options List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
        {options.map((opt, idx) => {
          const isSelected = currentAnswer === opt;
          return (
            <button
              key={idx}
              className={`mcq-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSave(question.id, opt)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "20px 24px",
                background: "#161b22",
                border: "2px solid #21262d",
                borderRadius: "14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.1s ease-in-out",
                width: "100%"
              }}
            >
              <div 
                className="letter-box"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#21262d",
                  border: "1px solid #30363d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#8b949e",
                  flexShrink: 0,
                  transition: "inherit"
                }}
              >
                {letters[idx]}
              </div>
              <span style={{ 
                fontSize: "16px", 
                color: isSelected ? "#f0f6fc" : "#c9d1d9",
                fontWeight: isSelected ? 600 : 400,
                lineHeight: "1.5"
              }}>
                {opt}
              </span>
              {isSelected && (
                <div style={{ marginLeft: "auto", color: "#58a6ff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Proctored Hint */}
      <div style={{ 
        marginTop: "auto", 
        paddingTop: "40px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#8b949e",
        fontSize: "12px"
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Your progress is automatically saved as you select an option.
      </div>
    </div>
  );
}