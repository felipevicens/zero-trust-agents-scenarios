import { CONNECTIONS } from "../../data/connections";
import { AGENTS } from "../../data/agents";
import { MCPS } from "../../data/mcps";
import { Connection } from "./Connection";
import type { ConnectionState } from "./Connection";
import { useHover } from "./HoverContext";
import type { Point } from "../../lib/geometry";

// Must stay in sync with AgentCard LOGO_SIZE (54) and MCPNode HEX_RADIUS (38)
const AGENT_DOT_OFFSET = 28;  // just outside 54/2 = 27px logo radius
const MCP_DOT_OFFSET   = 42;  // just outside 38px hex radius

function buildPositionMap(): Map<string, Point> {
  const map = new Map<string, Point>();
  for (const a of AGENTS) map.set(a.id, a.position);
  for (const m of MCPS) map.set(m.id, m.position);
  return map;
}

const POSITIONS = buildPositionMap();

function nodeRadius(id: string): number {
  if (AGENTS.find((a) => a.id === id)) return AGENT_DOT_OFFSET;
  if (MCPS.find((m) => m.id === id))   return MCP_DOT_OFFSET;
  return 0;
}

function sameCluster(fromId: string, toId: string): boolean {
  const fromAgent = AGENTS.find((a) => a.id === fromId);
  const toAgent = AGENTS.find((a) => a.id === toId);
  const fromMCP = MCPS.find((m) => m.id === fromId);
  const toMCP = MCPS.find((m) => m.id === toId);
  const fromCluster = fromAgent?.cluster ?? fromMCP?.cluster;
  const toCluster = toAgent?.cluster ?? toMCP?.cluster;
  return fromCluster !== undefined && fromCluster === toCluster;
}

interface ConnectionLayerProps {
  connectionStates?: Record<string, ConnectionState>;
}

export function ConnectionLayer({ connectionStates = {} }: ConnectionLayerProps) {
  const { hoveredAgentId } = useHover();

  return (
    <g>
      {CONNECTIONS.map((conn) => {
        const from = POSITIONS.get(conn.from);
        const to = POSITIONS.get(conn.to);
        if (!from || !to) return null;

        const arcHeight = sameCluster(conn.from, conn.to) ? 40 : 100;
        const highlighted =
          hoveredAgentId !== null &&
          (conn.from === hoveredAgentId || conn.to === hoveredAgentId);

        const state = connectionStates[conn.id] ?? "inactive";

        return (
          <Connection
            key={conn.id}
            id={conn.id}
            fromX={from.x}
            fromY={from.y}
            toX={to.x}
            toY={to.y}
            state={state}
            arcHeight={arcHeight}
            highlighted={highlighted}
            fromRadius={nodeRadius(conn.from)}
            toRadius={nodeRadius(conn.to)}
          />
        );
      })}
    </g>
  );
}
