import { useState } from "react";
import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import type { Agent, AgentState } from "../../data/agents";
import { colors } from "../../lib/colors";
import { useHover } from "./HoverContext";

interface AgentCardProps {
  agent: Agent;
  state?: AgentState;
}

const LOGO_SIZE = 54;
const AURA_R = LOGO_SIZE * 0.9;
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

interface AuraConfig {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeOpacity: number;
  dasharray?: string;
}

function getAuraConfig(state: AgentState, isHover: boolean): AuraConfig | null {
  switch (state) {
    case "active":
      return { fill: colors.stateActive, fillOpacity: 0.18, stroke: colors.stateActive, strokeOpacity: 0.55 };
    case "gate":
      return { fill: colors.stateGate, fillOpacity: 0.15, stroke: colors.stateGate, strokeOpacity: 0.5 };
    case "passed":
      return { fill: colors.statePass, fillOpacity: 0.2, stroke: colors.statePass, strokeOpacity: 0.65 };
    case "blocked":
      return { fill: colors.stateBlock, fillOpacity: 0.22, stroke: colors.stateBlock, strokeOpacity: 0.7 };
    case "adversarial":
      return { fill: "transparent", fillOpacity: 0, stroke: colors.stateAdversarial, strokeOpacity: 0.85, dasharray: "8 4" };
    case "trace":
      return { fill: colors.stateTrace, fillOpacity: 0.22, stroke: colors.stateTrace, strokeOpacity: 0.65 };
    default: // idle, dimmed
      return isHover
        ? { fill: colors.kagentPurple, fillOpacity: 0.18, stroke: colors.kagentPurpleGlow, strokeOpacity: 0.45 }
        : null;
  }
}

// Framer Motion animate values for the wrapper group
function getGroupAnimate(state: AgentState): TargetAndTransition {
  switch (state) {
    case "blocked":
      return { x: [0, -5, 5, -5, 5, -5, 5, -3, 3, 0], rotate: 0, opacity: 1 };
    case "adversarial":
      return { x: 0, rotate: [0, -0.5, 0.5, -0.5, 0.5, 0], opacity: 1 };
    case "dimmed":
      return { x: 0, rotate: 0, opacity: 0.35 };
    default:
      return { x: 0, rotate: 0, opacity: 1 };
  }
}

function getGroupTransition(state: AgentState): object {
  switch (state) {
    case "blocked":
      return { duration: 0.8, ease: "linear" };
    case "adversarial":
      return { duration: 1.2, repeat: Infinity, ease: "easeInOut" };
    default:
      return { duration: 0.3 };
  }
}

// Aura opacity animation (for pulsing states)
function getAuraOpacityAnimate(state: AgentState): number | number[] {
  if (state === "active") return [0.18, 0.45, 0.18];
  if (state === "gate")   return [0.12, 0.38, 0.12];
  return 0.2;
}

function getAuraOpacityTransition(state: AgentState): object {
  if (state === "active") return { duration: 1.5, repeat: Infinity, ease: "easeInOut" };
  if (state === "gate")   return { duration: 0.9, repeat: Infinity, ease: "easeInOut" };
  return { duration: 0.3 };
}

export function AgentCard({ agent, state = "idle" }: AgentCardProps) {
  const [localHover, setLocalHover] = useState(false);
  const { setHoveredAgentId } = useHover();
  const prefersReducedMotion = useReducedMotion();
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

  const aura = getAuraConfig(state, localHover);
  const showAura = aura !== null;

  return (
    <motion.g
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ cursor: "default", transformOrigin: `${cx}px ${cy}px` }}
      animate={getGroupAnimate(state)}
      transition={getGroupTransition(state)}
    >
      {/* State aura ring — behind logo */}
      {showAura && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={AURA_R}
          fill={aura.fill}
          stroke={aura.stroke}
          strokeWidth={1.5}
          strokeDasharray={aura.dasharray}
          strokeOpacity={aura.strokeOpacity}
          animate={{ fillOpacity: prefersReducedMotion ? aura.fillOpacity : getAuraOpacityAnimate(state) }}
          transition={prefersReducedMotion ? { duration: 0 } : getAuraOpacityTransition(state)}
          initial={{ fillOpacity: aura.fillOpacity }}
        />
      )}

      <image
        href="/kagent-logo.png"
        x={cx - LOGO_SIZE / 2}
        y={cy - LOGO_SIZE / 2}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
      />

      {/* Passed state: ✓ tick overlay */}
      {state === "passed" && (
        <text
          x={cx + LOGO_SIZE * 0.3}
          y={cy - LOGO_SIZE * 0.3}
          fill={colors.statePass}
          fontSize={18}
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          ✓
        </text>
      )}

      {/* Blocked state: ✗ overlay */}
      {state === "blocked" && (
        <text
          x={cx + LOGO_SIZE * 0.3}
          y={cy - LOGO_SIZE * 0.3}
          fill={colors.stateBlock}
          fontSize={18}
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          ✗
        </text>
      )}

      <text
        x={cx}
        y={cy + LOGO_SIZE / 2 + 14}
        fill={colors.textPrimary}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontWeight={localHover ? 600 : 400}
        textAnchor="middle"
      >
        {name}
      </text>

      {localHover && <Tooltip cx={cx} cy={cy} text={description} />}
    </motion.g>
  );
}
