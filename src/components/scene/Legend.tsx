import { useState } from "react";
import { colors } from "../../lib/colors";

const ITEMS = [
  { color: colors.stateActive,      label: "Active",      desc: "Agent in action" },
  { color: colors.stateGate,        label: "Gate",        desc: "Access check evaluating" },
  { color: colors.statePass,        label: "Permitted",   desc: "Access granted" },
  { color: colors.stateBlock,       label: "Blocked",     desc: "Access denied" },
  { color: colors.stateAdversarial, label: "Adversarial", desc: "Malicious / drift" },
  { color: colors.stateTrace,       label: "Trace",       desc: "kagent audit trail" },
  { color: colors.mcpHealthy,       label: "MCP",         desc: "Model Context Protocol node" },
] as const;

export function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        left: "12px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
      }}
    >
      {open && (
        <div
          style={{
            background: "rgba(10,10,20,0.88)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "10px 14px",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            marginBottom: "4px",
          }}
        >
          {ITEMS.map(({ color, label, desc }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "9px" }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${color}88`,
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{label}</span>
                {" — "}
                {desc}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close legend" : "Open legend"}
        aria-expanded={open}
        style={{
          background: "rgba(10,10,20,0.82)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          color: open ? "var(--kagent-purple-glow)" : "var(--text-muted)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px",
          backdropFilter: "blur(6px)",
          transition: "color 0.15s, border-color 0.15s",
          borderColor: open ? "var(--kagent-purple)" : "var(--border-subtle)",
        }}
      >
        <span style={{ fontSize: "13px" }}>◉</span>
        Legend
      </button>
    </div>
  );
}
