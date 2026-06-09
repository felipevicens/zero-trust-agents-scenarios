import { usePlaybackStore } from "../../store/playback";
import { SCENARIOS_MAP } from "../../data/scenarios";

export function PlaybackControls() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const speed = usePlaybackStore((s) => s.speed);
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);
  const hitlStatus = usePlaybackStore((s) => s.hitlStatus);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);
  const next = usePlaybackStore((s) => s.next);
  const prev = usePlaybackStore((s) => s.prev);
  const restart = usePlaybackStore((s) => s.restart);
  const setSpeed = usePlaybackStore((s) => s.setSpeed);

  const scenario = scenarioId ? SCENARIOS_MAP[scenarioId] : undefined;
  const stepCount = scenario?.steps.length ?? 0;
  const atEnd = stepCount > 0 && currentStepIndex >= stepCount - 1;
  const hasScenario = scenarioId !== null && scenario !== undefined;
  const hitlBlocking = hitlStatus === "pending" || hitlStatus === "denied";
  const canPrev = hasScenario && currentStepIndex >= 0;
  const canNext = hasScenario && !atEnd && !hitlBlocking;

  const outlinedBtn: React.CSSProperties = {
    background: "transparent",
    border: "1px solid var(--border-subtle)",
    borderRadius: "8px",
    color: "var(--text-secondary)",
    fontFamily: "Inter, sans-serif",
    fontSize: "17px",
    fontWeight: 500,
    padding: "7px 18px",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const filledBtn: React.CSSProperties = {
    background: "var(--kagent-purple)",
    border: "1px solid var(--kagent-purple-glow)",
    borderRadius: "8px",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    fontSize: "17px",
    fontWeight: 600,
    padding: "7px 18px",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 0 14px rgba(108,63,197,0.5)",
  };

  const speedBtnStyle = (s: 0.5 | 1 | 2): React.CSSProperties => ({
    background: speed === s ? "rgba(108,63,197,0.25)" : "transparent",
    border: `1px solid ${speed === s ? "var(--kagent-purple-glow)" : "var(--border-subtle)"}`,
    borderRadius: "6px",
    color: speed === s ? "var(--kagent-purple-glow)" : "var(--text-muted)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "14px",
    padding: "4px 9px",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
      {/* Speed */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {([0.5, 1, 2] as const).map((s) => (
          <button key={s} style={speedBtnStyle(s)} onClick={() => setSpeed(s)}>
            {s}×
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "32px", background: "var(--border-subtle)", flexShrink: 0 }} />

      {/* Previous Step */}
      <button
        style={{ ...outlinedBtn, opacity: canPrev ? 1 : 0.35, cursor: canPrev ? "pointer" : "default" }}
        onClick={canPrev ? prev : undefined}
        disabled={!canPrev}
      >
        ← Previous Step
      </button>

      {/* Next Step */}
      <button
        style={{
          ...(atEnd ? outlinedBtn : filledBtn),
          opacity: canNext ? 1 : (atEnd ? 0.6 : 0.35),
          cursor: canNext || atEnd ? "pointer" : "default",
        }}
        onClick={atEnd ? restart : next}
        disabled={!canNext && !atEnd}
      >
        {atEnd ? "↺ Replay" : "Next Step →"}
      </button>

      {/* Stop (reset to beginning) */}
      <button
        onClick={restart}
        disabled={!hasScenario || currentStepIndex < 0}
        title="Stop & reset (R)"
        style={{
          width: "38px",
          height: "38px",
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          color: "var(--text-muted)",
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: (!hasScenario || currentStepIndex < 0) ? "default" : "pointer",
          opacity: (!hasScenario || currentStepIndex < 0) ? 0.35 : 1,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        ⏹
      </button>

      {/* Play / Pause */}
      <button
        onClick={isPlaying ? pause : play}
        disabled={!hasScenario || atEnd}
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        style={{
          width: "38px",
          height: "38px",
          background: isPlaying ? "rgba(59,130,246,0.15)" : "transparent",
          border: `1px solid ${isPlaying ? "#3b82f6" : "var(--border-subtle)"}`,
          borderRadius: "8px",
          color: isPlaying ? "#3b82f6" : "var(--text-muted)",
          fontSize: "17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: (!hasScenario || atEnd) ? "default" : "pointer",
          opacity: (!hasScenario || atEnd) ? 0.35 : 1,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
}
