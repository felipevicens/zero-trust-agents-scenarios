import { AnimatePresence, motion } from "framer-motion";
import { usePlaybackStore } from "../../store/playback";
import { SCENARIOS_MAP } from "../../data/scenarios";

function PurpleTriangle() {
  return (
    <svg
      width="9"
      height="13"
      viewBox="0 0 9 13"
      style={{ flexShrink: 0, marginTop: "2px" }}
    >
      <polygon
        points="0,0 9,6.5 0,13"
        fill="var(--kagent-purple-glow)"
        style={{ filter: "drop-shadow(0 0 5px rgba(139,92,246,0.8))" }}
      />
    </svg>
  );
}

export function CaptionPanel() {
  const caption = usePlaybackStore((s) => s.caption);
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);

  const scenario = scenarioId ? SCENARIOS_MAP[scenarioId] : undefined;
  const stepCount = scenario?.steps.length ?? 0;
  const stepLabel =
    currentStepIndex >= 0
      ? String(currentStepIndex + 1).padStart(2, "0")
      : "—";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flex: 1,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Step counter */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0, gap: "1px" }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Step
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "45px",
              fontWeight: 700,
              color: "var(--kagent-purple-glow)",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(139,92,246,0.4)",
            }}
          >
            {stepLabel}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "16px",
              color: "var(--text-muted)",
              lineHeight: 1,
            }}
          >
            of {stepCount || "—"}
          </span>
        </div>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          width: "1px",
          height: "50px",
          background: "var(--border-subtle)",
          flexShrink: 0,
        }}
      />

      {/* Scenario title + caption */}
      <div style={{ overflow: "hidden", minWidth: 0 }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "5px",
          }}
        >
          <PurpleTriangle />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            {scenarioId && scenario
              ? `${scenarioId} · ${scenario.title}`
              : "Select a scenario"}
          </span>
        </div>

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.25 }}
            style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "17px",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
