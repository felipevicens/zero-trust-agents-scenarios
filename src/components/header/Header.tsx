export function Header() {
  return (
    <header
      style={{
        height: "72px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        gap: "16px",
        flexShrink: 0,
      }}
    >
      {/* Purple accent bar */}
      <div
        style={{
          width: "4px",
          height: "36px",
          borderRadius: "2px",
          background: "var(--kagent-purple-glow)",
          boxShadow: "0 0 12px var(--kagent-purple-glow)",
        }}
      />
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.3px",
          }}
        >
          Zero-Trust Agents for Autonomous Networks
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          TM Forum Moonshot Catalyst C26.0.933
        </p>
      </div>
    </header>
  );
}
