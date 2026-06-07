import type { Scenario } from "./types";

// S5: Two parallel tracks — legitimate (ran-diag → cladra → capability) and rogue
// (ran-diag attempts PCRF access with wrong token). Modeled sequentially:
// legitimate track runs first (steps 1–3), then the rogue attempt (steps 4–8),
// then the legitimate conclusion (steps 9–11), leaving the scene split green/red.

export const s5: Scenario = {
  id: "S5",
  title: "The Wandering Agent",
  subtitle: "Adversarial — scope creep / domain boundary violation",
  emotion: "comparison",
  takeaway: "Correct delegation beats autonomous drift.",
  steps: [
    // ── Legitimate track ──────────────────────────────────────────────────────
    {
      id: "s5-1",
      kind: "agent-action",
      actor: "ran-diagnostic-agent",
      caption: "RAN Diagnostic queries RAN MCP — reads radio access metrics",
    },
    {
      id: "s5-2",
      kind: "gate",
      actor: "ran-diagnostic-agent",
      gateLabel: "Scoped to RAN domain?",
      gateResult: "pass",
      caption: "Domain check — RAN domain read access approved",
      durationMs: 3200,
    },
    {
      id: "s5-3",
      kind: "permitted",
      actor: "ran-diagnostic-agent",
      caption: "RAN reads complete — anomaly corroborated in radio layer",
    },
    {
      id: "s5-4",
      kind: "agent-action",
      actor: "ran-diagnostic-agent",
      target: "cladra-agent",
      caption: "RAN Diagnostic hands off findings to Orchestrator — correct delegation",
    },

    // ── Rogue track (ran-diag drifts, attempts lateral movement) ─────────────
    {
      id: "s5-5",
      kind: "adversarial",
      actor: "ran-diagnostic-agent",
      caption: "LLM reasons: 'PCRF misconfig is the cause — I can fix it directly'",
      durationMs: 2000,
    },
    {
      id: "s5-6",
      kind: "adversarial",
      actor: "ran-diagnostic-agent",
      caption: "Constructs PCRF read call using RAN-domain token (wrong scope)",
    },
    {
      id: "s5-7",
      kind: "gate",
      actor: "ran-diagnostic-agent",
      gateLabel: "PCRF in RAN scope?",
      gateResult: "fail",
      caption: "Scope check — PCRF not within RAN domain token audience",
      durationMs: 3200,
    },
    {
      id: "s5-8",
      kind: "blocked",
      actor: "ran-diagnostic-agent",
      caption: "BLOCKED at mesh — PCRF not in scope of RAN-domain token",
    },

    // ── Legitimate conclusion (cladra uses correct token via capability-agent) ─
    {
      id: "s5-9",
      kind: "agent-action",
      actor: "cladra-agent",
      target: "capability-agent",
      caption: "Orchestrator tasks Capability Agent — queries Policy MCP for PCRF scope",
    },
    {
      id: "s5-10",
      kind: "gate",
      actor: "capability-agent",
      gateLabel: "Read-only Policy scope?",
      gateResult: "pass",
      caption: "Scope check — read-only policy access permitted under authorised token",
      durationMs: 3200,
    },
    {
      id: "s5-11",
      kind: "permitted",
      actor: "capability-agent",
      caption: "PCRF read succeeds under authorised token — correct delegation wins",
    },
    {
      id: "s5-12",
      kind: "trace",
      caption: "kagent trace — blocked drift ✗ + correct delegation ✓ side by side",
      durationMs: 4000,
    },
  ],
};
