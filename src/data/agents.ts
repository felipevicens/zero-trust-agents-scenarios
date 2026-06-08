export type Cluster = "tools" | "datacenter" | "monitoring";

export type AgentState = "idle" | "active" | "gate" | "passed" | "blocked" | "adversarial" | "trace" | "dimmed";

export interface Agent {
  id: string;
  name: string;
  description: string;
  cluster: Cluster;
  position: { x: number; y: number };
  displayInScene: boolean;
}

export const AGENTS: Agent[] = [
  {
    id: "cladra-agent",
    name: "cladra-agent",
    description: "CLADRA orchestrator — coordinates diagnostic and action agents",
    cluster: "datacenter",
    position: { x: 860, y: 300 },
    displayInScene: true,
  },
  {
    id: "act-agent",
    name: "act-agent",
    description: "Executes VoLTE remediation actions",
    cluster: "datacenter",
    position: { x: 760, y: 420 },
    displayInScene: true,
  },
  {
    id: "core-diagnostic-agent",
    name: "core-diagnostic-agent",
    description: "Diagnoses issues in the core network infrastructure using VoLTE data",
    cluster: "datacenter",
    position: { x: 760, y: 540 },
    displayInScene: true,
  },
  {
    id: "ran-diagnostic-agent",
    name: "ran-diagnostic-agent",
    description: "Diagnoses issues in the Radio Access Network using VoLTE diagnostic tools",
    cluster: "datacenter",
    position: { x: 990, y: 540 },
    displayInScene: true,
  },
  {
    id: "reporting-agent",
    name: "reporting-agent",
    description: "Creates audit reports that capture the pipeline outcome",
    cluster: "datacenter",
    position: { x: 990, y: 420 },
    displayInScene: true,
  },
  {
    id: "slo-agent",
    name: "slo-agent",
    description: "Monitors Service Level Objectives and triggers CLADRA for violations",
    cluster: "monitoring",
    position: { x: 1350, y: 440 },
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
