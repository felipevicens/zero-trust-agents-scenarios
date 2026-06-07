import type { Cluster } from "./agents";

export interface MCPNode {
  id: string;
  cluster: Cluster;
  position: { x: number; y: number };
  externalTargets: string[];
}

// ASSUMPTION: tools and monitoring MCPs shifted ±60px outward from §9 spec values
// to match the cluster position adjustment (see agents.ts).
export const MCPS: MCPNode[] = [
  {
    id: "policy-mcp",
    cluster: "tools",
    position: { x: 190, y: 520 },
    externalTargets: ["Policy Registry", "PCRF", "IMS Gateway", "ServiceNow"],
  },
  {
    id: "monitoring-mcp",
    cluster: "monitoring",
    position: { x: 1420, y: 520 },
    externalTargets: ["Prometheus", "Grafana", "xDR Records", "SLO Telemetry"],
  },
];
