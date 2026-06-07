import { motion } from "framer-motion";
import { colors } from "../../lib/colors";

export interface TraceMarkerProps {
  text: string;
  position: { x: number; y: number };
}

const PAD_X = 18;
const PAD_Y = 10;
const FONT_SIZE = 13;
const HEIGHT = FONT_SIZE + PAD_Y * 2;

export function TraceMarker({ text, position }: TraceMarkerProps) {
  // Approximate pill width — SVG text length is hard to measure; use char count heuristic
  const approxWidth = text.length * 7.5 + PAD_X * 2;
  const { x, y } = position;
  const rx = HEIGHT / 2; // fully rounded pill

  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Outer glow */}
      <rect
        x={x - approxWidth / 2 - 3}
        y={y - HEIGHT / 2 - 3}
        width={approxWidth + 6}
        height={HEIGHT + 6}
        rx={rx + 3}
        fill={colors.stateTrace}
        fillOpacity={0.15}
      />

      {/* Pill background */}
      <rect
        x={x - approxWidth / 2}
        y={y - HEIGHT / 2}
        width={approxWidth}
        height={HEIGHT}
        rx={rx}
        fill={colors.bgCard}
        stroke={colors.stateTrace}
        strokeWidth={1.5}
        strokeOpacity={0.85}
      />

      <text
        x={x}
        y={y + FONT_SIZE * 0.36}
        textAnchor="middle"
        fill={colors.stateTrace}
        fontSize={FONT_SIZE}
        fontFamily="Inter, sans-serif"
        fontWeight={600}
        style={{ pointerEvents: "none" }}
      >
        {text}
      </text>
    </motion.g>
  );
}
