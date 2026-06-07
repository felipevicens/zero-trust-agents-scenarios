import { clusterFloorVertices, clusterFloorExtrusionVertices } from "../../lib/geometry";
import { colors } from "../../lib/colors";

interface ClusterFloorProps {
  name: string;
  cx: number;
  cy: number;
  width?: number;
  height?: number;
}

export function ClusterFloor({ name, cx, cy, width = 320, height = 180 }: ClusterFloorProps) {
  const topPoints = clusterFloorVertices(cx, cy, width, height);
  const extPoints = clusterFloorExtrusionVertices(cx, cy, width, height);

  // ASSUMPTION: label floats ABOVE the floor (outside the parallelogram), centered on the
  // skewed top edge (cx + 24). This avoids overlap with top-row agents such as
  // datacenter act-agent (y=350) which sits above the floor's top edge (y=360).
  const labelCx = cx + 24;
  const labelY = cy - height / 2 - 28;

  return (
    <g filter="drop-shadow(0 8px 24px rgba(0,0,0,0.4))">
      <polygon
        points={extPoints}
        fill={colors.bgDeep}
        stroke={colors.kagentPurple}
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      <polygon
        points={topPoints}
        fill={colors.bgSurface}
        stroke={colors.kagentPurple}
        strokeOpacity={0.6}
        strokeWidth={1.5}
      />

      {/* Cluster name label — floats above the floor */}
      <text
        x={labelCx}
        y={labelY}
        fill={colors.textPrimary}
        fontSize={19}
        fontFamily="Inter, sans-serif"
        fontWeight={600}
        letterSpacing="0.3"
        textAnchor="middle"
      >
        {name}
      </text>
    </g>
  );
}
