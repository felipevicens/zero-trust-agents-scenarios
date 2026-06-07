import { ScenarioSelector } from "../header/ScenarioSelector";
import { CaptionPanel } from "./CaptionPanel";
import { PlaybackControls } from "./PlaybackControls";

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "44px",
        background: "var(--border-subtle)",
        flexShrink: 0,
      }}
    />
  );
}

export function Footer() {
  return (
    <footer
      style={{
        height: "108px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "16px",
        flexShrink: 0,
      }}
    >
      {/* Left: scenario pills */}
      <ScenarioSelector />

      <Divider />

      {/* Center: step counter + scenario title + caption */}
      <CaptionPanel />

      <Divider />

      {/* Right: speed + nav buttons */}
      <PlaybackControls />
    </footer>
  );
}
