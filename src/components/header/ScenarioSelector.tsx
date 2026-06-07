import { usePlaybackStore } from "../../store/playback";
import { SCENARIOS_MAP } from "../../data/scenarios";
import type { Scenario } from "../../data/scenarios/types";

const PILLS: { id: Scenario["id"]; label: string; title: string }[] = [
  { id: "S1", label: "S1", title: "Governed Autonomy" },
  { id: "S2", label: "S2", title: "Hijacked Agent" },
  { id: "S3", label: "S3", title: "Impostor Agent" },
  { id: "S4", label: "S4", title: "Overreaching Agent" },
  { id: "S5", label: "S5", title: "Wandering Agent" },
  { id: "S6", label: "S6", title: "Unregistered Capability" },
];

export function ScenarioSelector() {
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const selectScenario = usePlaybackStore((s) => s.selectScenario);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "13px",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Scenario
      </span>
      <div style={{ display: "flex", gap: "7px" }}>
        {PILLS.map(({ id, label, title }) => {
          const isActive = scenarioId === id;
          const isAvailable = id in SCENARIOS_MAP;

          return (
            <button
              key={id}
              title={title}
              onClick={() => isAvailable && selectScenario(id)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: isActive ? "rgba(108,63,197,0.18)" : "transparent",
                border: `1.5px solid ${isActive ? "var(--kagent-purple-glow)" : "var(--border-subtle)"}`,
                color: isActive ? "#fff" : "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 400,
                cursor: isAvailable ? "pointer" : "default",
                opacity: isAvailable ? 1 : 0.35,
                transition: "all 0.2s",
                boxShadow: isActive
                  ? "0 0 12px rgba(139,92,246,0.6), 0 0 0 1px rgba(139,92,246,0.2)"
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
