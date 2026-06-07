import { VISIBLE_AGENTS } from "../../data/agents";
import { MCPS } from "../../data/mcps";
import { ClusterFloor } from "./ClusterFloor";
import { AgentCard } from "./AgentCard";
import { MCPNode } from "./MCPNode";
import { ConnectionLayer } from "./ConnectionLayer";
import { HoverProvider } from "./HoverContext";

// ASSUMPTION: Floor sizes enlarged from spec §8 (320×180) per user request.
// Floor cx/positions shifted ±60px outward from spec to increase cluster separation.
const CLUSTERS = [
  { name: "tools",      cx: 290,  cy: 450, width: 400, height: 312 },
  { name: "datacenter", cx: 800,  cy: 450, width: 480, height: 396 },
  { name: "monitoring", cx: 1310, cy: 450, width: 400, height: 312 },
] as const;

// Dot-grid background pattern for the SVG scene
function DotGrid() {
  return (
    <>
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#dot-grid)" />
    </>
  );
}

export function Scene() {
  return (
    <HoverProvider>
      <svg
        viewBox="0 0 1600 900"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Background */}
        <rect width="1600" height="900" fill="#0a0a14" />
        <DotGrid />

        {/* Cluster floors — rendered first (lowest z-order) */}
        {CLUSTERS.map((c) => (
          <ClusterFloor key={c.name} name={c.name} cx={c.cx} cy={c.cy} width={c.width} height={c.height} />
        ))}

        {/* Connections — above floors, below agents */}
        <ConnectionLayer />

        {/* Agent nodes */}
        {VISIBLE_AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}

        {/* MCP nodes */}
        {MCPS.map((mcp) => (
          <MCPNode key={mcp.id} mcp={mcp} />
        ))}
      </svg>
    </HoverProvider>
  );
}
