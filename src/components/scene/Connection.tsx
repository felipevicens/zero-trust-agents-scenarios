import { bezierPath } from "../../lib/geometry";
import { colors } from "../../lib/colors";

export type ConnectionState = "inactive" | "flowing-permitted" | "flowing-blocked" | "adversarial";

interface ConnectionProps {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  state?: ConnectionState;
  highlighted?: boolean;
  arcHeight?: number;
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
}: ConnectionProps) {
  const computedArcHeight = arcHeight ?? 100;
  const d = bezierPath({ x: fromX, y: fromY }, { x: toX, y: toY }, computedArcHeight);

  const stateStroke: Record<ConnectionState, string> = {
    "inactive":          colors.kagentPurpleGlow,
    "flowing-permitted": colors.statePass,
    "flowing-blocked":   colors.stateBlock,
    "adversarial":       colors.stateAdversarial,
  };

  const stroke = highlighted ? colors.kagentPurpleGlow : stateStroke[state];
  const isFlowing = state !== "inactive";

  // Base: 0.4; on hover → highlighted connections: 1.0, others keep 0.4
  const opacity = isFlowing ? 1 : highlighted ? 1 : 0.4;
  const strokeWidth = highlighted ? 2.5 : 1.5;
  const filter = highlighted ? "drop-shadow(0 0 6px rgba(139,92,246,0.7))" : undefined;

  return (
    <path
      id={id}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray="6 4"
      // opacity in style (not SVG attr) so it wins over the .connection CSS class
      style={{ opacity, filter, transition: "opacity 200ms, stroke-width 200ms" }}
      className={isFlowing ? `connection connection--flowing connection--${state}` : "connection"}
    />
  );
}
