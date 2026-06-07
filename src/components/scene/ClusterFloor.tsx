import { roundedParallelogramPath } from "../../lib/geometry";
import { colors } from "../../lib/colors";
import { KubernetesLogo } from "./KubernetesLogo";

interface ClusterFloorProps {
  name: string;
  cx: number;
  cy: number;
  width?: number;
  height?: number;
}

const EXTRUSION_Y = 16;
const CORNER_R    = 14;

export function ClusterFloor({ name, cx, cy, width = 320, height = 180 }: ClusterFloorProps) {
  // extrusion: same shape shifted down by EXTRUSION_Y
  const topPath = roundedParallelogramPath(cx, cy,               width, height, CORNER_R);
  const extPath = roundedParallelogramPath(cx, cy + EXTRUSION_Y, width, height, CORNER_R);

  // ASSUMPTION: label floats ABOVE the floor, centered on the skewed top edge (cx + 24).
  const labelCx = cx + 24;
  const labelY  = cy - height / 2 - 28;

  return (
    <g filter="drop-shadow(0 20px 48px rgba(0,0,0,0.85))">
      {/* Extrusion — bottom perspective face */}
      <path
        d={extPath}
        fill={colors.bgDeep}
        stroke={colors.kagentPurple}
        strokeOpacity={0.25}
        strokeWidth={1}
      />
      {/* Top face — full-opacity border + purple neón glow */}
      <path
        d={topPath}
        fill={colors.bgSurface}
        stroke={colors.kagentPurpleGlow}
        strokeOpacity={1}
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 9px rgba(139,92,246,0.6))" }}
      />

      {/* Cluster name — white, uppercase, floats above */}
      <text
        x={labelCx}
        y={labelY}
        fill={colors.textPrimary}
        opacity={1}
        fontSize={19}
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        letterSpacing="2.5"
        textAnchor="middle"
      >
        {name.toUpperCase()}
      </text>

      {/* Kubernetes logo — top-right corner of the floor */}
      <KubernetesLogo
        cx={cx + width / 2 + 48 - 20}
        cy={cy - height / 2 + 20}
        size={32}
      />
    </g>
  );
}
