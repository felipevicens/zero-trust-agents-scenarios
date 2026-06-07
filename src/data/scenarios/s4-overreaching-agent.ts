import type { Scenario } from "./types";

export const s4: Scenario = {
  id: "S4",
  title: "The Overreaching Agent",
  subtitle: "Adversarial — privilege escalation / lateral movement",
  emotion: "temptation",
  takeaway: "Tokens cannot be reused outside scope.",
  steps: [
    {
      id: "s4-1",
      kind: "agent-action",
      actor: "core-diagnostic-agent",
      caption: "Core Diagnostic queries Core MCP — reads IMS xDR records",
    },
    {
      id: "s4-2",
      kind: "gate",
      actor: "core-diagnostic-agent",
      gateLabel: "Scoped to Core domain?",
      gateResult: "pass",
      caption: "Domain check — Core domain read access approved",
      durationMs: 3200,
    },
    {
      id: "s4-3",
      kind: "permitted",
      actor: "core-diagnostic-agent",
      caption: "Core reads complete — anomaly confirmed in IMS configuration",
    },
    {
      id: "s4-4",
      kind: "adversarial",
      actor: "core-diagnostic-agent",
      caption: "LLM reasons: 'IMS PCRF misconfig — a reset would fix this'",
      durationMs: 2000,
    },
    {
      id: "s4-5",
      kind: "adversarial",
      actor: "core-diagnostic-agent",
      caption: "Constructs IMS remediation call using existing Core-domain token",
    },
    {
      id: "s4-6",
      kind: "gate",
      actor: "core-diagnostic-agent",
      gateLabel: "Token audience = 'ims-remediation'?",
      gateResult: "fail",
      caption: "Audience check — token scoped to 'core-read', not 'ims-remediation'",
      durationMs: 3200,
    },
    {
      id: "s4-7",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "403 REJECTED — audience mismatch, write call blocked",
    },
    {
      id: "s4-8",
      kind: "blocked",
      actor: "core-diagnostic-agent",
      caption: "Lateral movement attempt flagged and logged in audit trail",
      durationMs: 2000,
    },
    {
      id: "s4-9",
      kind: "trace",
      caption: "kagent trace — green read ✓ then red write block ✗",
      durationMs: 4000,
    },
  ],
};
