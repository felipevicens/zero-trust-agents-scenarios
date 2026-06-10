import { useEffect } from "react";
import { usePlaybackStore, getEffectiveSteps } from "../store/playback";
import { SCENARIOS_MAP } from "../data/scenarios";

export function useScenarioPlayer() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const speed = usePlaybackStore((s) => s.speed);
  const hitlStatus = usePlaybackStore((s) => s.hitlStatus);
  const helpMode = usePlaybackStore((s) => s.helpMode);
  const next = usePlaybackStore((s) => s.next);
  const pause = usePlaybackStore((s) => s.pause);

  useEffect(() => {
    if (!isPlaying || !scenarioId) return;

    // Advance from unstarted state immediately
    if (currentStepIndex === -1) {
      next();
      return;
    }

    const scenario = SCENARIOS_MAP[scenarioId];
    if (!scenario) return;

    const steps = getEffectiveSteps(scenario, helpMode);

    if (currentStepIndex >= steps.length - 1) {
      pause();
      return;
    }

    const step = steps[currentStepIndex];

    // Never auto-advance past a HITL step — only the Approve/Deny buttons can unblock it
    if (step.kind === "hitl" && hitlStatus !== "approved") return;

    const defaultMs = step.kind === "gate" ? 3200 : step.kind === "slide" ? 6000 : 1500;
    const durationMs = (step.durationMs ?? defaultMs) / speed;

    const timer = setTimeout(next, durationMs);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, scenarioId, speed, hitlStatus, helpMode, next, pause]);
}
