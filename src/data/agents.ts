export type Cluster = "tools" | "datacenter" | "monitoring";

export interface Agent {
  id: string;
  name: string;
  description: string;
  cluster: Cluster;
  position: { x: number; y: number };
  displayInScene: boolean;
}

// ASSUMPTION: tools and monitoring clusters shifted ±60px outward from §9 spec values
// per user request to increase visual separation from the central datacenter cluster.
export const AGENTS: Agent[] = [
  {
    id: "cladra-agent",
    name: "cladra-agent",
    description: "CLADRA orchestrator — coordinates diagnostic, capability, decision, and action agents",
    cluster: "tools",
    position: { x: 290, y: 390 },
    displayInScene: true,
  },
  {
    id: "act-agent",
    name: "act-agent",
    description: "Executes VoLTE remediation actions",
    cluster: "datacenter",
    position: { x: 700, y: 350 },
    displayInScene: true,
  },
  {
    id: "capability-agent",
    name: "capability-agent",
    description: "Evaluates available VoLTE remediation capabilities",
    cluster: "datacenter",
    position: { x: 900, y: 350 },
    displayInScene: true,
  },
  {
    id: "core-diagnostic-agent",
    name: "core-diagnostic-agent",
    description: "Diagnoses issues in the core network infrastructure using VoLTE data",
    cluster: "datacenter",
    position: { x: 700, y: 460 },
    displayInScene: true,
  },
  {
    id: "decision-agent",
    name: "decision-agent",
    description: "Makes remediation decisions based on diagnostics and capabilities",
    cluster: "datacenter",
    position: { x: 900, y: 460 },
    displayInScene: true,
  },
  {
    id: "ran-diagnostic-agent",
    name: "ran-diagnostic-agent",
    description: "Diagnoses issues in the Radio Access Network using VoLTE diagnostic tools",
    cluster: "datacenter",
    position: { x: 700, y: 570 },
    displayInScene: true,
  },
  {
    id: "reporting-agent",
    name: "reporting-agent",
    description: "Creates a ServiceNow incident that captures the pipeline outcome",
    cluster: "datacenter",
    position: { x: 900, y: 570 },
    displayInScene: true,
  },
  {
    id: "prediction-agent",
    name: "prediction-agent",
    description: "Predicts network issues and triggers CLADRA proactively",
    cluster: "monitoring",
    position: { x: 1310, y: 390 },
    displayInScene: true,
  },
  {
    id: "slo-agent",
    name: "slo-agent",
    description: "Monitors Service Level Objectives and triggers CLADRA for violations",
    cluster: "monitoring",
    position: { x: 1310, y: 540 },
    displayInScene: true,
  },

  // Excluded from scene — kept for inventory completeness
  {
    id: "test-cladra-policy-agent",
    name: "test-cladra-policy-agent",
    description: "Test agent to validate AccessPolicy enforcement against cladra-agent",
    cluster: "datacenter",
    position: { x: 0, y: 0 },
    displayInScene: false,
  },
  {
    id: "test-policy-agent",
    name: "test-policy-agent",
    description: "Test agent to validate AccessPolicy enforcement against moonshot1 agents",
    cluster: "datacenter",
    position: { x: 0, y: 0 },
    displayInScene: false,
  },
];

export const VISIBLE_AGENTS = AGENTS.filter((a) => a.displayInScene);
