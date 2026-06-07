import { useEffect } from "react";
import { usePlaybackStore } from "../store/playback";
import { SCENARIOS_MAP } from "../data/scenarios";

export function useScenarioPlayer() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);
  const scenarioId = usePlaybackStore((s) => s.scenarioId);
  const speed = usePlaybackStore((s) => s.speed);
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

    if (currentStepIndex >= scenario.steps.length - 1) {
      pause();
      return;
    }

    const step = scenario.steps[currentStepIndex];
    const defaultMs = step.kind === "gate" ? 3200 : 1500;
    const durationMs = (step.durationMs ?? defaultMs) / speed;

    const timer = setTimeout(next, durationMs);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, scenarioId, speed, next, pause]);
}
