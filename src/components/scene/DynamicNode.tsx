import { motion } from "framer-motion";
import type { AgentState } from "../../data/agents";
import type { DynamicNodeSpec } from "../../data/scenarios/types";
import { hexagonPoints } from "../../lib/geometry";
import { colors } from "../../lib/colors";
import { MCPLogo } from "./MCPLogo";

interface DynamicNodeProps {
  spec: DynamicNodeSpec;
  state: AgentState;
}

const HEX_RADIUS = 34;
const LOGO_SIZE = 36;

const stateStroke: Partial<Record<AgentState, string>> = {
  adversarial: colors.stateAdversarial,
  blocked:     colors.stateBlock,
  idle:        colors.stateAdversarial,
};

export function DynamicNode({ spec, state }: DynamicNodeProps) {
  const { x: cx, y: cy, label, id } = spec;
  const pts = hexagonPoints(cx, cy, HEX_RADIUS);
  const stroke = stateStroke[state] ?? colors.stateAdversarial;
  const isBlocked = state === "blocked";

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Adversarial pulse glow ring */}
      {!isBlocked && (
        <motion.polygon
          points={pts}
          fill="none"
          stroke={stroke}
          strokeWidth={8}
          opacity={0}
          animate={{ opacity: [0, 0.28, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Hexagon body */}
      <polygon
        points={pts}
        fill={colors.bgCard}
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray="8 4"
        opacity={isBlocked ? 0.75 : 1}
      />

      {/* Logo inside — MCP logo for shadow-mcp, kagent logo for rogue-process */}
      {spec.type === "shadow-mcp" ? (
        <MCPLogo cx={cx} cy={cy} size={LOGO_SIZE} />
      ) : (
        <image
          href="/kagent-logo.png"
          x={cx - LOGO_SIZE / 2}
          y={cy - LOGO_SIZE / 2}
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          opacity={isBlocked ? 0.55 : 1}
        />
      )}

      {/* Block ✗ badge — top-right of logo */}
      {isBlocked && (
        <text
          x={cx + LOGO_SIZE * 0.32}
          y={cy - LOGO_SIZE * 0.28}
          fill={colors.stateBlock}
          fontSize={16}
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          ✗
        </text>
      )}

      {/* Alias label below hex (e.g. "remediation-agent-v2") */}
      <text
        x={cx}
        y={cy + HEX_RADIUS + 15}
        fill={stroke}
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={600}
        textAnchor="middle"
      >
        {label}
      </text>

      {/* Node ID below alias */}
      <text
        x={cx}
        y={cy + HEX_RADIUS + 29}
        fill={colors.textSecondary}
        fontSize={13}
        fontFamily="Inter, sans-serif"
        fontWeight={400}
        textAnchor="middle"
        opacity={0.8}
      >
        {id}
      </text>
    </motion.g>
  );
}
