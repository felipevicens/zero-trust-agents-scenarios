import { CONNECTIONS } from "../../data/connections";
import { AGENTS } from "../../data/agents";
import { MCPS } from "../../data/mcps";
import { Connection } from "./Connection";
import { useHover } from "./HoverContext";
import type { Point } from "../../lib/geometry";

function buildPositionMap(): Map<string, Point> {
  const map = new Map<string, Point>();
  for (const a of AGENTS) map.set(a.id, a.position);
  for (const m of MCPS) map.set(m.id, m.position);
  return map;
}

const POSITIONS = buildPositionMap();

function sameCluster(fromId: string, toId: string): boolean {
  const fromAgent = AGENTS.find((a) => a.id === fromId);
  const toAgent = AGENTS.find((a) => a.id === toId);
  const fromMCP = MCPS.find((m) => m.id === fromId);
  const toMCP = MCPS.find((m) => m.id === toId);
  const fromCluster = fromAgent?.cluster ?? fromMCP?.cluster;
  const toCluster = toAgent?.cluster ?? toMCP?.cluster;
  return fromCluster !== undefined && fromCluster === toCluster;
}

export function ConnectionLayer() {
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

        return (
          <Connection
            key={conn.id}
            id={conn.id}
            fromX={from.x}
            fromY={from.y}
            toX={to.x}
            toY={to.y}
            arcHeight={arcHeight}
            highlighted={highlighted}
          />
        );
      })}
    </g>
  );
}
