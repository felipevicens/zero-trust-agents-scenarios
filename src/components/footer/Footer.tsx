// Placeholder footer — populated in Phase 3 (CaptionPanel, PlaybackControls, Legend)
export function Footer() {
  return (
    <footer
      style={{
        height: "60px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "var(--text-muted)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        Pick a scenario to begin.
      </p>
    </footer>
  );
}
