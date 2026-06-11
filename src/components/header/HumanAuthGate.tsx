import { useMemo } from "react";
import { usePlaybackStore, getEffectiveSteps } from "../../store/playback";
import { SCENARIOS_MAP } from "../../data/scenarios";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "13px",
  fontFamily: "Inter, sans-serif",
  color: "var(--text-secondary)",
  fontStyle: "italic",
};

export function HumanAuthGate() {
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);
  const hitlStatus = usePlaybackStore((s) => s.hitlStatus);
  const helpMode = usePlaybackStore((s) => s.helpMode);
  const approveHITL = usePlaybackStore((s) => s.approveHITL);
  const denyHITL = usePlaybackStore((s) => s.denyHITL);

  const step = useMemo(() => {
    if (!scenarioId || currentStepIndex < 0) return null;
    const scenario = SCENARIOS_MAP[scenarioId];
    if (!scenario) return null;
    const s = getEffectiveSteps(scenario, helpMode)[currentStepIndex];
    return s?.kind === "hitl" ? s : null;
  }, [scenarioId, currentStepIndex, helpMode]);

  if (!step) return null;

  const containerStyle: React.CSSProperties = {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    flexShrink: 0,
  };

  if (hitlStatus === "approved") {
    return (
      <div style={containerStyle}>
        <span style={LABEL_STYLE}>Approve or deny the PCRF policy request?</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(16,185,129,0.12)",
            border: "1px solid #10b981",
            borderRadius: "8px",
            padding: "9px 18px",
            color: "#10b981",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          ✓ Remediation approved
        </div>
      </div>
    );
  }

  if (hitlStatus === "denied") {
    return (
      <div style={containerStyle}>
        <span style={LABEL_STYLE}>Approve or deny the PCRF policy request?</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            padding: "9px 18px",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          ✗ Remediation rejected by operator
        </div>
      </div>
    );
  }

  // pending
  return (
    <div style={containerStyle}>
      <span style={LABEL_STYLE}>Approve or deny the PCRF policy request?</span>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={approveHITL}
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid #10b981",
            borderRadius: "8px",
            color: "#10b981",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            padding: "9px 20px",
            cursor: "pointer",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.12)"; }}
        >
          ✓ Approve
        </button>

        <button
          onClick={denyHITL}
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            padding: "9px 20px",
            cursor: "pointer",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)"; }}
        >
          ✗ Deny
        </button>
      </div>
    </div>
  );
}
