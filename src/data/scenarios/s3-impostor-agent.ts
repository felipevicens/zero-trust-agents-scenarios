import type { Scenario } from "./types";

// rogue-process materializes inside TOOLS floor (bottom-right corner)
// Gate diamonds appear between TOOLS and DATACENTER clusters
const ROGUE_GATE_POS = { x: 650, y: 155 };

export const s3: Scenario = {
  id: "S3",
  title: "The Impostor Agent",
  subtitle: "Adversarial — unverified agent identity",
  emotion: "intrusion",
  takeaway: "Identity matters.",
  steps: [
    {
      id: "s3-1",
      kind: "adversarial",
      actor: "rogue-process",
      dynamicNode: {
        id: "rogue-process",
        x: 390,
        y: 540,
        type: "rogue-process",
        label: "remediation-agent-v2",
      },
      caption: "Rogue process 'remediation-agent-v2' appears outside the fabric",
      durationMs: 2000,
    },
    {
      id: "s3-2",
      kind: "adversarial",
      actor: "rogue-process",
      target: "act-agent",
      caption: "Attempt 1: presents self-signed certificate to datacenter mesh",
    },
    {
      id: "s3-3",
      kind: "gate",
      actor: "rogue-process",
      gateLabel: "mTLS cert from trusted CA?",
      gateResult: "fail",
      gatePositionOverride: ROGUE_GATE_POS,
      caption: "mTLS check — certificate not from a trusted CA",
      durationMs: 3200,
    },
    {
      id: "s3-4",
      kind: "blocked",
      actor: "rogue-process",
      caption: "REJECTED — untrusted CA, connection refused",
    },
    {
      id: "s3-5",
      kind: "adversarial",
      actor: "rogue-process",
      target: "act-agent",
      caption: "Attempt 2: replays a captured OIDC token",
    },
    {
      id: "s3-6",
      kind: "gate",
      actor: "rogue-process",
      gateLabel: "Token audience matches caller?",
      gateResult: "fail",
      gatePositionOverride: ROGUE_GATE_POS,
      caption: "Audience check — token audience does not match this caller",
      durationMs: 3200,
    },
    {
      id: "s3-7",
      kind: "blocked",
      actor: "rogue-process",
      caption: "REJECTED — audience mismatch / token replay detected",
    },
    {
      id: "s3-8",
      kind: "trace",
      caption: "kagent trace — two red nodes, fabric untouched ✗✗",
      clearAdversarialLine: true,
      durationMs: 4000,
    },
  ],
};
