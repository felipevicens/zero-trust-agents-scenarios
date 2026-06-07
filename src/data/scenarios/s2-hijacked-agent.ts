import type { Scenario } from "./types";

export const s2: Scenario = {
  id: "S2",
  title: "The Hijacked Agent",
  subtitle: "Adversarial — prompt injection / goal hijacking",
  emotion: "corruption",
  takeaway: "Prompt injection detected.",
  steps: [
    {
      id: "s2-1",
      kind: "agent-action",
      actor: "slo-agent",
      caption: "SLO Agent detects anomaly — triggers orchestration pipeline",
    },
    {
      id: "s2-2",
      kind: "agent-action",
      actor: "cladra-agent",
      target: "core-diagnostic-agent",
      caption: "Orchestrator tasks Core Diagnostic Agent — read xDR records",
    },
    {
      id: "s2-3",
      kind: "agent-action",
      actor: "core-diagnostic-agent",
      caption: "Core Diagnostic reads xDR via Core MCP",
    },
    {
      id: "s2-4",
      kind: "adversarial",
      actor: "core-diagnostic-agent",
      caption: "Malicious payload embedded in xDR — goal state shifts",
      durationMs: 2000,
    },
    {
      id: "s2-5",
      kind: "gate",
      actor: "core-diagnostic-agent",
      gateLabel: "Goal matches declared scope?",
      gateResult: "fail",
      caption: "Goal check — declared scope: diagnose; actual goal: exfiltrate",
      durationMs: 3200,
    },
    {
      id: "s2-6",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "BLOCKED — goal deviation detected by policy engine",
    },
    {
      id: "s2-7",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "Agent suspended — escalated to NOC for investigation",
      durationMs: 2000,
    },
    {
      id: "s2-8",
      kind: "trace",
      caption: "kagent trace — red blocked edge ✗",
      durationMs: 4000,
    },
  ],
};
