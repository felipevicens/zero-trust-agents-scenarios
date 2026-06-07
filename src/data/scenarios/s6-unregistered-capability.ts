import type { Scenario } from "./types";

// shadow-mcp materializes inside the DATACENTER floor, top-right area
// (clear of existing agents, clearly inside the cluster boundary)

export const s6: Scenario = {
  id: "S6",
  title: "The Unregistered Capability",
  subtitle: "Adversarial / governance drift — shadow MCP",
  emotion: "discovery",
  takeaway: "Unregistered capabilities are denied by default.",
  steps: [
    // ── Legitimate start ──────────────────────────────────────────────────────
    {
      id: "s6-1",
      kind: "agent-action",
      actor: "core-diagnostic-agent",
      caption: "Core Diagnostic using approved tools — querying Core MCP",
    },
    {
      id: "s6-2",
      kind: "permitted",
      actor: "core-diagnostic-agent",
      caption: "Approved tool calls complete — results look incomplete ✓",
    },

    // ── Branch B: rogue capability discovery ──────────────────────────────────
    {
      id: "s6-3",
      kind: "adversarial",
      actor: "shadow-mcp",
      dynamicNode: {
        id: "shadow-mcp",
        x: 1015,
        y: 430,
        type: "shadow-mcp",
        label: "shadow-mcp",
      },
      caption: "Unregistered MCP discovered on network — not in capability registry",
      durationMs: 2000,
    },
    {
      id: "s6-4",
      kind: "adversarial",
      actor: "core-diagnostic-agent",
      target: "shadow-mcp",
      caption: "LLM constructs invocation request to shadow-mcp for broader data",
    },
    {
      id: "s6-5",
      kind: "gate",
      actor: "core-diagnostic-agent",
      gateLabel: "Capability in registry as 'approved'?",
      gateResult: "fail",
      caption: "Registry check — shadow-mcp has no approved registry entry",
      durationMs: 3200,
    },
    {
      id: "s6-6",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "BLOCKED — no registry entry, invocation denied",
    },
    {
      id: "s6-7",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "Suggest: submit capability for registry approval before use",
      durationMs: 2000,
    },

    // ── Branch A: orchestrator continues on approved tooling ──────────────────
    {
      id: "s6-8",
      kind: "agent-action",
      actor: "cladra-agent",
      caption: "Orchestrator notified of block — pivots to approved tooling",
    },
    {
      id: "s6-9",
      kind: "permitted",
      actor: "cladra-agent",
      caption: "Investigation continues on approved tooling — governance intact ✓",
    },
    {
      id: "s6-10",
      kind: "trace",
      // adversarialLine stays red — do NOT set clearAdversarialLine
      caption: "kagent trace — green approved path ✓ + red shadow block ✗",
      durationMs: 4000,
    },
  ],
};
