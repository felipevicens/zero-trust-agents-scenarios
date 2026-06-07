import { useState } from "react";
import type { Agent } from "../../data/agents";
import { colors } from "../../lib/colors";
import { useHover } from "./HoverContext";

interface AgentCardProps {
  agent: Agent;
}

const LOGO_SIZE = 36;
const TOOLTIP_W = 230;
const TOOLTIP_H = 64;

function Tooltip({ cx, cy, text }: { cx: number; cy: number; text: string }) {
  const ty = Math.max(10, cy - LOGO_SIZE / 2 - TOOLTIP_H - 10);
  const tx = Math.min(Math.max(cx - TOOLTIP_W / 2, 10), 1600 - TOOLTIP_W - 10);

  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={tx}
        y={ty}
        width={TOOLTIP_W}
        height={TOOLTIP_H}
        rx={8}
        fill={colors.bgCard}
        stroke={colors.kagentPurple}
        strokeWidth={1}
        opacity={0.97}
      />
      <foreignObject x={tx + 10} y={ty + 8} width={TOOLTIP_W - 20} height={TOOLTIP_H - 16}>
        <p
          style={{
            margin: 0,
            padding: 0,
            color: colors.textSecondary,
            fontSize: "12px",
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

export function AgentCard({ agent }: AgentCardProps) {
  const [localHover, setLocalHover] = useState(false);
  const { setHoveredAgentId } = useHover();
  const { position, name, description } = agent;
  const { x: cx, y: cy } = position;

  const handleEnter = () => {
    setLocalHover(true);
    setHoveredAgentId(agent.id);
  };
  const handleLeave = () => {
    setLocalHover(false);
    setHoveredAgentId(null);
  };

  return (
    <g
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ cursor: "default" }}
    >
      {localHover && (
        <circle
          cx={cx}
          cy={cy}
          r={LOGO_SIZE * 0.9}
          fill={colors.kagentPurple}
          fillOpacity={0.15}
          stroke={colors.kagentPurpleGlow}
          strokeWidth={1}
          strokeOpacity={0.4}
        />
      )}

      <image
        href="/kagent-logo.png"
        x={cx - LOGO_SIZE / 2}
        y={cy - LOGO_SIZE / 2}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
      />

      <text
        x={cx}
        y={cy + LOGO_SIZE / 2 + 14}
        fill={localHover ? colors.textPrimary : colors.textSecondary}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontWeight={localHover ? 600 : 400}
        textAnchor="middle"
        style={{ transition: "fill 150ms" }}
      >
        {name}
      </text>

      {localHover && <Tooltip cx={cx} cy={cy} text={description} />}
    </g>
  );
}
