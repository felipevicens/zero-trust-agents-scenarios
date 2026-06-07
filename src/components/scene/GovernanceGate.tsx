import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../../lib/colors";

export interface GateProps {
  kind: string;
  position: { x: number; y: number };
  result: "pass" | "fail";
  onDone?: () => void;
  speed?: 0.5 | 1 | 2;
}

type GatePhase = "evaluating" | "resolved" | "exiting";

const S        = 30;   // diamond half-size — 60×60 per spec
const EVAL_MS  = 900;
const HOLD_MS  = 1500;
const ANIM_MS  = 300;
const LABEL_Y_OFFSET = S + 16;  // label baseline below diamond bottom tip
const LABEL_FONT = 13;
const LABEL_LINE_H = 16;

// Split label into lines of at most `maxChars` characters
function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function GovernanceGate({ kind, position, result, onDone, speed = 1 }: GateProps) {
  const [phase, setPhase] = useState<GatePhase>("evaluating");
  const { x, y } = position;

  const evalMs = EVAL_MS / speed;
  const holdMs = HOLD_MS / speed;
  const animMs = ANIM_MS / speed;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("resolved"), evalMs);
    return () => clearTimeout(t1);
  }, [evalMs]);

  useEffect(() => {
    if (phase !== "resolved") return;
    const t2 = setTimeout(() => {
      setPhase("exiting");
      setTimeout(() => onDone?.(), animMs);
    }, holdMs);
    return () => clearTimeout(t2);
  }, [phase, onDone, holdMs, animMs]);

  const isExiting  = phase === "exiting";
  const isResolved = phase === "resolved";
  const fillColor  = isResolved
    ? (result === "pass" ? colors.statePass : colors.stateBlock)
    : colors.stateGate;

  const points    = `${x},${y - S} ${x + S},${y} ${x},${y + S} ${x - S},${y}`;
  const labelLines = wrapLabel(kind, 20);
  // Centre the label block vertically starting below the diamond tip
  const labelStartY = y + LABEL_Y_OFFSET;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isExiting ? 0 : 1, opacity: isExiting ? 0 : 1 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transition={{ duration: animMs / 1000, ease: "backOut" }}
    >
      {/* Amber shimmer halo during evaluation */}
      {phase === "evaluating" && (
        <motion.circle
          cx={x} cy={y} r={S * 1.5}
          fill={colors.stateGate}
          animate={{ fillOpacity: [0, 0.2, 0] }}
          transition={{ duration: 0.9 / speed, repeat: Infinity }}
          fillOpacity={0}
        />
      )}

      {/* Green / red resolve glow */}
      {isResolved && (
        <motion.circle
          cx={x} cy={y} r={S * 1.7}
          fill={result === "pass" ? colors.statePass : colors.stateBlock}
          initial={{ fillOpacity: 0 }}
          animate={{ fillOpacity: [0, 0.28, 0.1] }}
          transition={{ duration: 0.4 / speed }}
          fillOpacity={0}
        />
      )}

      {/* Diamond */}
      <polygon
        points={points}
        fill={fillColor}
        fillOpacity={0.9}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={1.5}
      />

      {/* Inside diamond: ✓/✗ when resolved, small "?" while evaluating */}
      {isResolved ? (
        <motion.text
          x={x} y={y + 7}
          textAnchor="middle"
          fill="white"
          fontSize={20}
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ pointerEvents: "none", transformOrigin: `${x}px ${y}px` }}
          transition={{ duration: 0.25 / speed }}
        >
          {result === "pass" ? "✓" : "✗"}
        </motion.text>
      ) : (
        <text
          x={x} y={y + 5}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize={14}
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          style={{ pointerEvents: "none" }}
        >
          ?
        </text>
      )}

      {/* Label below the diamond — always visible */}
      <text
        textAnchor="middle"
        fill={colors.textPrimary}
        fontSize={LABEL_FONT}
        fontFamily="Inter, sans-serif"
        fontWeight={500}
        style={{ pointerEvents: "none" }}
      >
        {labelLines.map((line, i) => (
          <tspan key={i} x={x} y={labelStartY + i * LABEL_LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    </motion.g>
  );
}
