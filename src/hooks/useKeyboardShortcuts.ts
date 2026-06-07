import { useEffect } from "react";
import { usePlaybackStore } from "../store/playback";
import type { Scenario } from "../data/scenarios/types";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const s = usePlaybackStore.getState();

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          s.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          s.prev();
          break;
        case " ":
          e.preventDefault();
          s.isPlaying ? s.pause() : s.play();
          break;
        case "r":
        case "R":
          s.restart();
          break;
        case "1": s.selectScenario("S1" as Scenario["id"]); break;
        case "2": s.selectScenario("S2" as Scenario["id"]); break;
        case "3": s.selectScenario("S3" as Scenario["id"]); break;
        case "4": s.selectScenario("S4" as Scenario["id"]); break;
        case "5": s.selectScenario("S5" as Scenario["id"]); break;
        case "6": s.selectScenario("S6" as Scenario["id"]); break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
