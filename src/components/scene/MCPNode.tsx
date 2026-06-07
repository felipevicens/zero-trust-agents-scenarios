import type { MCPNode as MCPNodeData } from "../../data/mcps";
import { hexagonPoints } from "../../lib/geometry";
import { colors } from "../../lib/colors";
import { MCPLogo } from "./MCPLogo";

interface MCPNodeProps {
  mcp: MCPNodeData;
}

const HEX_RADIUS = 38;

export function MCPNode({ mcp }: MCPNodeProps) {
  const { position, id, externalTargets } = mcp;
  const { x: cx, y: cy } = position;
  const pts = hexagonPoints(cx, cy, HEX_RADIUS);

  const isRight = cx > 800;
  const lineEndX = isRight ? cx + 160 : cx - 160;
  const label = id === "policy-mcp" ? "Policy / PCRF / ITSM" : "Prometheus / Grafana / xDR";

  return (
    <g>
      {/* External infra connection line */}
      <line
        x1={isRight ? cx + HEX_RADIUS * 0.87 : cx - HEX_RADIUS * 0.87}
        y1={cy}
        x2={lineEndX}
        y2={cy}
        stroke={colors.mcpHealthy}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        opacity={0.4}
      />
      <text
        x={isRight ? lineEndX + 5 : lineEndX - 5}
        y={cy + 4}
        fill={colors.textMuted}
        fontSize={11}
        fontFamily="Inter, sans-serif"
        textAnchor={isRight ? "start" : "end"}
      >
        {label}
      </text>
      {externalTargets.map((t, i) => (
        <text
          key={t}
          x={isRight ? lineEndX + 5 : lineEndX - 5}
          y={cy + 14 + i * 13}
          fill={colors.textMuted}
          fontSize={9}
          fontFamily="JetBrains Mono, monospace"
          textAnchor={isRight ? "start" : "end"}
          opacity={0.7}
        >
          {t}
        </text>
      ))}

      {/* Hexagon body */}
      <polygon
        points={pts}
        fill={colors.bgCard}
        stroke={colors.mcpHealthy}
        strokeWidth={2}
      />

      {/* Official MCP logo — white, no hexagon */}
      <MCPLogo cx={cx} cy={cy} size={32} />

      {/* MCP id label below */}
      <text
        x={cx}
        y={cy + HEX_RADIUS + 16}
        fill={colors.textSecondary}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontWeight={500}
        textAnchor="middle"
      >
        {id}
      </text>
    </g>
  );
}
