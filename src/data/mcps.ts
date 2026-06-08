import type { Cluster } from "./agents";

export interface MCPNode {
  id: string;
  cluster: Cluster;
  position: { x: number; y: number };
  externalTargets: string[];
  /** Override the default 160px external-target line length */
  lineLength?: number;
}

export const MCPS: MCPNode[] = [
  // Tools cluster — policy/integration MCPs, labels go left with long lines
  {
    id: "policy-mcp",
    cluster: "tools",
    position: { x: 310, y: 300 },
    externalTargets: ["Policy Registry", "PCRF", "IMS Gateway"],
    lineLength: 190,
  },
  {
    id: "itsm-mcp",
    cluster: "tools",
    position: { x: 310, y: 400 },
    externalTargets: ["ServiceNow", "CMDB", "Jira ITSM", "Ticketing Sys"],
    lineLength: 190,
  },
  {
    id: "core-mcp",
    cluster: "tools",
    position: { x: 310, y: 500 },
    externalTargets: ["IMS Gateway", "HSS", "Core xDR", "EPC Core"],
    lineLength: 190,
  },
  {
    id: "ran-mcp",
    cluster: "tools",
    position: { x: 310, y: 600 },
    externalTargets: ["RAN KPIs", "eNodeB Metrics", "xDR Records", "CEM Data"],
    lineLength: 190,
  },
  // Monitoring cluster
  {
    id: "monitoring-mcp",
    cluster: "monitoring",
    position: { x: 1450, y: 530 },
    externalTargets: ["Prometheus", "Grafana", "xDR Records", "SLO Telemetry"],
    lineLength: 140,
  },
];
