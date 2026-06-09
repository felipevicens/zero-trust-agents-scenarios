import { HumanAuthGate } from "./HumanAuthGate";

export function Header() {
  return (
    <header
      style={{
        height: "136px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        gap: "24px",
        flexShrink: 0,
      }}
    >
      {/* Purple accent bar */}
      <div
        style={{
          width: "6px",
          alignSelf: "stretch",
          margin: "16px 0",
          borderRadius: "3px",
          background: "linear-gradient(180deg, var(--kagent-purple-glow) 0%, var(--kagent-purple) 100%)",
          boxShadow: "0 0 18px rgba(139,92,246,0.75), 0 0 40px rgba(139,92,246,0.25)",
          flexShrink: 0,
        }}
      />

      <div style={{ flexShrink: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.4px",
            lineHeight: 1.2,
          }}
        >
          Zero-Trust Agents
          <br />
          for Autonomous Networks
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "15px",
            color: "var(--text-muted)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          TM Forum Moonshot Catalyst C26.0.933
        </p>
      </div>

      <HumanAuthGate />
    </header>
  );
}
