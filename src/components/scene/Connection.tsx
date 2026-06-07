import { bezierPath } from "../../lib/geometry";
import { colors } from "../../lib/colors";
import type { ConnectionState } from "../../store/playback";

export type { ConnectionState };

interface ConnectionProps {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  state?: ConnectionState;
  highlighted?: boolean;
  arcHeight?: number;
  fromRadius?: number;  // offset dot to node perimeter (px from center)
  toRadius?: number;
}

export function Connection({
  id,
  fromX,
  fromY,
  toX,
  toY,
  state = "inactive",
  highlighted = false,
  arcHeight,
  fromRadius = 0,
  toRadius = 0,
}: ConnectionProps) {
  const computedArcHeight = arcHeight ?? 100;

  // Quadratic Bézier control point — mirrors bezierPath's formula
  const ctrlX = (fromX + toX) / 2;
  const ctrlY = Math.min(fromY, toY) - computedArcHeight;

  // Tangent at fromX/fromY: curve departs toward ctrl point
  const ftx = ctrlX - fromX, fty = ctrlY - fromY;
  const ftLen = Math.sqrt(ftx * ftx + fty * fty) || 1;
  const fux = ftx / ftLen, fuy = fty / ftLen;

  // Tangent at toX/toY: curve arrives from ctrl point direction
  const ttx = toX - ctrlX, tty = toY - ctrlY;
  const ttLen = Math.sqrt(ttx * ttx + tty * tty) || 1;
  const tux = ttx / ttLen, tuy = tty / ttLen;

  // Path starts/ends at perimeter, offset along the actual curve tangent
  const d = bezierPath(
    { x: fromX + fux * fromRadius, y: fromY + fuy * fromRadius },
    { x: toX  - tux * toRadius,   y: toY  - tuy * toRadius   },
    computedArcHeight,
  );

  const stateStroke: Record<ConnectionState, string> = {
    "inactive":          colors.kagentPurpleGlow,
    "flowing-permitted": colors.statePass,
    "flowing-blocked":   colors.stateBlock,
    "adversarial":       colors.stateAdversarial,
  };

  const stroke = highlighted ? colors.kagentPurpleGlow : stateStroke[state];
  const isFlowing = state !== "inactive";

  // Base: 0.6; on hover → highlighted connections: 1.0, others keep 0.6
  const opacity    = isFlowing ? 1 : highlighted ? 1 : 0.6;
  const strokeWidth = highlighted ? 2.5 : 1.5;
  const pathFilter  = highlighted ? "drop-shadow(0 0 6px rgba(139,92,246,0.7))" : undefined;

  // Dots sit at the perimeter, offset along the Bézier tangent at each endpoint
  const fromDotX = fromX + fux * fromRadius;
  const fromDotY = fromY + fuy * fromRadius;
  const toDotX   = toX  - tux * toRadius;
  const toDotY   = toY  - tuy * toRadius;

  const dotR       = highlighted ? 4.5 : 3.5;
  const dotOpacity = highlighted ? 1.0 : 0.65;
  const dotFilter  = highlighted ? "url(#dot-glow)" : undefined;

  return (
    <g>
      <path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray="6 4"
        style={{ opacity, filter: pathFilter, transition: "opacity 200ms, stroke-width 200ms" }}
        className={isFlowing ? `connection connection--flowing connection--${state}` : "connection"}
      />
      <circle
        cx={fromDotX} cy={fromDotY} r={dotR}
        fill={stroke} opacity={dotOpacity} filter={dotFilter}
        style={{ transition: "opacity 200ms" }}
      />
      <circle
        cx={toDotX} cy={toDotY} r={dotR}
        fill={stroke} opacity={dotOpacity} filter={dotFilter}
        style={{ transition: "opacity 200ms" }}
      />
    </g>
  );
}
