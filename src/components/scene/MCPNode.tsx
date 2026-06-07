import { useState } from "react";
import type { MCPNode as MCPNodeData } from "../../data/mcps";
import { hexagonPoints } from "../../lib/geometry";
import { colors } from "../../lib/colors";
import { MCPLogo } from "./MCPLogo";

interface MCPNodeProps {
  mcp: MCPNodeData;
}

const HEX_RADIUS = 38;
const TOOLTIP_W = 260;
const TOOLTIP_H = 90;

const MCP_DESCRIPTIONS: Record<string, string> = {
  "policy-mcp": "Policy MCP — provides OIDC tokens, scope decisions, and playbook access via Policy Registry, PCRF, IMS Gateway, and ServiceNow.",
  "monitoring-mcp": "Monitoring MCP — aggregates SLO telemetry, xDR records, and alerting signals from Prometheus, Grafana, and xDR.",
};

function MCPTooltip({ cx, cy, text }: { cx: number; cy: number; text: string }) {
  const isRight = cx > 800;
  const tx = isRight ? cx - TOOLTIP_W - HEX_RADIUS - 4 : cx + HEX_RADIUS + 4;
  const ty = cy - TOOLTIP_H / 2;

  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={tx}
        y={ty}
        width={TOOLTIP_W}
        height={TOOLTIP_H}
        rx={8}
        fill={colors.bgCard}
        stroke={colors.mcpHealthy}
        strokeWidth={1}
        opacity={0.97}
      />
      <foreignObject x={tx + 10} y={ty + 8} width={TOOLTIP_W - 20} height={TOOLTIP_H - 16}>
        <p
          style={{
            margin: 0,
            padding: 0,
            color: colors.textSecondary,
            fontSize: "11px",
            fontFamily: "Inter, sans-serif",
            lineHeight: "1.45",
          }}
        >
          {text}
        </p>
      </foreignObject>
    </g>
  );
}

export function MCPNode({ mcp }: MCPNodeProps) {
  const [hovered, setHovered] = useState(false);
  const { position, id, externalTargets } = mcp;
  const { x: cx, y: cy } = position;
  const pts = hexagonPoints(cx, cy, HEX_RADIUS);

  const isRight = cx > 800;
  const lineEndX = isRight ? cx + 160 : cx - 160;
  const label = id === "policy-mcp" ? "Policy / PCRF / ITSM" : "Prometheus / Grafana / xDR";

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
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
        fontSize={17}
        fontFamily="Inter, sans-serif"
        textAnchor={isRight ? "start" : "end"}
        opacity={0.4}
      >
        {label}
      </text>
      {externalTargets.map((t, i) => (
        <text
          key={t}
          x={isRight ? lineEndX + 5 : lineEndX - 5}
          y={cy + 18 + i * 16}
          fill={colors.textMuted}
          fontSize={14}
          fontFamily="JetBrains Mono, monospace"
          textAnchor={isRight ? "start" : "end"}
          opacity={0.4}
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

      {/* Hover glow ring */}
      {hovered && (
        <polygon
          points={pts}
          fill="none"
          stroke={colors.mcpHealthy}
          strokeWidth={6}
          opacity={0.25}
        />
      )}

      {/* MCP id label below */}
      <text
        x={cx}
        y={cy + HEX_RADIUS + 16}
        fill={hovered ? colors.textPrimary : colors.textSecondary}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontWeight={hovered ? 600 : 500}
        textAnchor="middle"
      >
        {id}
      </text>

      {hovered && <MCPTooltip cx={cx} cy={cy} text={MCP_DESCRIPTIONS[id] ?? id} />}
    </g>
  );
}
