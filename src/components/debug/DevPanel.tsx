import { useState } from "react";
import { VISIBLE_AGENTS } from "../../data/agents";
import { CONNECTIONS } from "../../data/connections";
import type { AgentState } from "../../data/agents";
import type { ConnectionState } from "../scene/Connection";

const AGENT_STATES: AgentState[] = ["idle", "active", "gate", "passed", "blocked", "adversarial", "trace", "dimmed"];
const CONN_STATES: ConnectionState[] = ["inactive", "flowing-permitted", "flowing-blocked", "adversarial"];

const GATE_KINDS = [
  "OIDC identity verified?",
  "Token scope: CRM + PM read?",
  "Scoped to RAN domain?",
  "Scoped to Core domain?",
  "Read-only Policy scope?",
  "Within approved playbook?",
  "Single-use write token?",
  "Goal matches declared scope?",
  "mTLS cert from trusted CA?",
  "Token audience matches caller?",
  "Capability in registry as 'approved'?",
];

// Gate positions: diamond S=30, label is 2 lines × 16px below the tip.
// Cluster name baselines: tools/monitoring y=266, datacenter y=224.
// Gate label bottom = y + 30 + 16 + 16 = y + 62. Keep ≥40px gap above cluster name.
// tools/monitoring: y + 62 ≤ 226  →  y ≤ 164  → use 155
// datacenter:       y + 62 ≤ 184  →  y ≤ 122  → use 120
const GATE_PRESETS = [
  { label: "Above TOOLS",       x: 314,  y: 155 },
  { label: "Above DATACENTER",  x: 824,  y: 120 },
  { label: "Above MONITORING",  x: 1334, y: 155 },
];

const TRACE_TEXTS = [
  "All green ✓",
  "Two red nodes",
  "Green + Red block",
  "Adversarial blocked ✗",
  "Policy enforced ✓",
];

export interface DevPanelProps {
  agentStates: Record<string, AgentState>;
  onAgentState: (agentId: string, state: AgentState) => void;
  connectionStates: Record<string, ConnectionState>;
  onConnectionState: (connId: string, state: ConnectionState) => void;
  onTriggerGate: (kind: string, position: { x: number; y: number }, result: "pass" | "fail") => void;
  onTrace: (text: string | null) => void;
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 100,
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 11,
  userSelect: "none",
};

const boxStyle: React.CSSProperties = {
  background: "rgba(10,10,20,0.93)",
  border: "1px solid rgba(108,63,197,0.5)",
  borderRadius: 8,
  padding: "10px 12px",
  width: 280,
  maxHeight: "80vh",
  overflowY: "auto",
  color: "#a0a0c0",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 10,
  paddingBottom: 8,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const labelStyle: React.CSSProperties = {
  color: "#6c6c8a",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: 9,
  marginBottom: 4,
  display: "block",
};

const selectStyle: React.CSSProperties = {
  background: "#12122a",
  border: "1px solid #2d2d5e",
  borderRadius: 4,
  color: "#f5f5fa",
  fontSize: 10,
  padding: "2px 4px",
  width: "100%",
  marginBottom: 6,
};

function stateColor(s: AgentState | ConnectionState): string {
  const map: Record<string, string> = {
    idle: "#6c6c8a",
    active: "#3b82f6",
    gate: "#f59e0b",
    passed: "#10b981",
    blocked: "#ef4444",
    adversarial: "#fb923c",
    trace: "#a855f7",
    dimmed: "#4b4b6a",
    inactive: "#6c6c8a",
    "flowing-permitted": "#10b981",
    "flowing-blocked": "#ef4444",
  };
  return map[s] ?? "#6c6c8a";
}

function StateButton({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? color : "transparent",
        border: `1px solid ${active ? color : "#2d2d5e"}`,
        borderRadius: 3,
        color: active ? "#fff" : "#6c6c8a",
        fontSize: 9,
        padding: "2px 5px",
        cursor: "pointer",
        margin: "1px",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export function DevPanel({
  agentStates,
  onAgentState,
  connectionStates,
  onConnectionState,
  onTriggerGate,
  onTrace,
}: DevPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(VISIBLE_AGENTS[0].id);
  const [selectedConn, setSelectedConn] = useState(CONNECTIONS[0].id);
  const [gateKind, setGateKind] = useState(GATE_KINDS[0]);
  const [gatePreset, setGatePreset] = useState(0);
  const [traceIdx, setTraceIdx] = useState(0);

  const toggleBtn: React.CSSProperties = {
    background: "#1a1a2e",
    border: "1px solid #6c3fc5",
    borderRadius: 6,
    color: "#8b5cf6",
    fontSize: 10,
    fontFamily: "JetBrains Mono, monospace",
    padding: "4px 10px",
    cursor: "pointer",
    letterSpacing: "0.08em",
  };

  return (
    <div style={panelStyle}>
      <button style={toggleBtn} onClick={() => setOpen((o) => !o)}>
        {open ? "▲ DEV" : "▼ DEV"}
      </button>

      {open && (
        <div style={{ ...boxStyle, marginTop: 4 }}>

          {/* Agent States */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Agent State</span>
            <select style={selectStyle} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
              {VISIBLE_AGENTS.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {AGENT_STATES.map((s) => (
                <StateButton
                  key={s}
                  label={s}
                  active={agentStates[selectedAgent] === s}
                  color={stateColor(s)}
                  onClick={() => onAgentState(selectedAgent, s)}
                />
              ))}
            </div>
          </div>

          {/* Reset all agents */}
          <div style={{ ...sectionStyle, paddingTop: 0 }}>
            <button
              onClick={() => VISIBLE_AGENTS.forEach((a) => onAgentState(a.id, "idle"))}
              style={{ ...toggleBtn, fontSize: 9, padding: "2px 8px", width: "100%" }}
            >
              Reset all agents → idle
            </button>
          </div>

          {/* Connection States */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Connection State</span>
            <select style={selectStyle} value={selectedConn} onChange={(e) => setSelectedConn(e.target.value)}>
              {CONNECTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.id}</option>
              ))}
            </select>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {CONN_STATES.map((s) => (
                <StateButton
                  key={s}
                  label={s.replace("flowing-", "flow·")}
                  active={connectionStates[selectedConn] === s}
                  color={stateColor(s)}
                  onClick={() => onConnectionState(selectedConn, s)}
                />
              ))}
            </div>
          </div>

          {/* Governance Gate */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Governance Gate</span>
            <select style={selectStyle} value={gateKind} onChange={(e) => setGateKind(e.target.value)}>
              {GATE_KINDS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <select
              style={{ ...selectStyle, marginBottom: 6 }}
              value={gatePreset}
              onChange={(e) => setGatePreset(Number(e.target.value))}
            >
              {GATE_PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.label}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                style={{ ...toggleBtn, flex: 1, background: "rgba(16,185,129,0.15)", borderColor: "#10b981", color: "#10b981" }}
                onClick={() => onTriggerGate(gateKind, GATE_PRESETS[gatePreset], "pass")}
              >
                ✓ Pass
              </button>
              <button
                style={{ ...toggleBtn, flex: 1, background: "rgba(239,68,68,0.15)", borderColor: "#ef4444", color: "#ef4444" }}
                onClick={() => onTriggerGate(gateKind, GATE_PRESETS[gatePreset], "fail")}
              >
                ✗ Fail
              </button>
            </div>
          </div>

          {/* Trace Marker */}
          <div>
            <span style={labelStyle}>Trace Marker</span>
            <select style={selectStyle} value={traceIdx} onChange={(e) => setTraceIdx(Number(e.target.value))}>
              {TRACE_TEXTS.map((t, i) => (
                <option key={i} value={i}>{t}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                style={{ ...toggleBtn, flex: 1, borderColor: "#a855f7", color: "#a855f7" }}
                onClick={() => onTrace(TRACE_TEXTS[traceIdx])}
              >
                Show
              </button>
              <button
                style={{ ...toggleBtn, flex: 1 }}
                onClick={() => onTrace(null)}
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
