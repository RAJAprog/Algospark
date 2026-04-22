import React, { useState } from "react";

/**
 * DeleteButton
 * Props:
 *  - itemName   : string  — shown in confirm prompt  e.g. 'exam "Quiz 1"'
 *  - onConfirm  : async () => void — called when user confirms deletion
 *  - size?      : 'sm' | 'md'  (default 'sm')
 */
const DeleteButton = ({ itemName = "this item", onConfirm, size = "sm" }) => {
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const pad      = size === "sm" ? "0.3rem 0.6rem" : "0.45rem 0.9rem";
  const fontSize = size === "sm" ? "0.65rem"       : "0.78rem";

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (e) {
      console.error("DeleteButton error:", e);
    } finally {
      setIsLoading(false);
      setConfirming(false);
    }
  };

  /* ── Confirm state ── */
  if (confirming) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "0.5rem",
        padding: "0.3rem 0.6rem",
        whiteSpace: "nowrap",
      }}>
        <span style={{ fontSize: "0.62rem", color: "#f87171", fontWeight: 700 }}>
          Delete {itemName}?
        </span>

        {/* Confirm */}
        <button
          onClick={handleDelete}
          disabled={isLoading}
          style={{
            padding: "0.2rem 0.55rem",
            borderRadius: "0.35rem",
            background: "#ef4444",
            border: "none",
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.6rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            opacity: isLoading ? 0.7 : 1,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#b91c1c"; }}
          onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#ef4444"; }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: 9, height: 9,
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "dbSpin 0.7s linear infinite",
              }} />
              Deleting…
            </>
          ) : "Yes, Delete"}
        </button>

        {/* Cancel */}
        <button
          onClick={() => setConfirming(false)}
          disabled={isLoading}
          style={{
            padding: "0.2rem 0.55rem",
            borderRadius: "0.35rem",
            background: "transparent",
            border: "1px solid rgba(148,163,184,0.3)",
            color: "#94a3b8",
            fontWeight: 800,
            fontSize: "0.6rem",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(148,163,184,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          Cancel
        </button>

        <style>{`@keyframes dbSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Default state ── */
  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${itemName}`}
      style={{
        padding: pad,
        borderRadius: "0.45rem",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#f87171",
        fontWeight: 800,
        fontSize,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        transition: "background 0.15s, border-color 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background  = "rgba(239,68,68,0.18)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = "rgba(239,68,68,0.08)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
      }}
    >
      {/* Trash icon */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
      Delete
    </button>
  );
};

export default DeleteButton;