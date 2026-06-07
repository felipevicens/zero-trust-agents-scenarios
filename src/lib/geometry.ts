export interface Point {
  x: number;
  y: number;
}

export function bezierPath(from: Point, to: Point, arcHeight: number = 100): string {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - arcHeight;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

// ASSUMPTION: Per the Step 0 confirmation, cluster floors use a shallow
// parallelogram skew (15° on x-axis only, top edge offset +48px right).
// Vertices for a floor centered at (cx, cy) with given width/height.
export function clusterFloorVertices(
  cx: number,
  cy: number,
  width: number,
  height: number,
  skewX: number = 48
): string {
  const l = cx - width / 2;
  const r = cx + width / 2;
  const t = cy - height / 2;
  const b = cy + height / 2;
  // bottom-left, bottom-right, top-right (skewed right), top-left (skewed right)
  return `${l},${b} ${r},${b} ${r + skewX},${t} ${l + skewX},${t}`;
}

// Extrusion polygon — same vertices, offset downward
export function clusterFloorExtrusionVertices(
  cx: number,
  cy: number,
  width: number,
  height: number,
  skewX: number = 48,
  extrusionY: number = 16
): string {
  const l = cx - width / 2;
  const r = cx + width / 2;
  const t = cy - height / 2 + extrusionY;
  const b = cy + height / 2 + extrusionY;
  return `${l},${b} ${r},${b} ${r + skewX},${t} ${l + skewX},${t}`;
}

// Rounded-corner parallelogram as SVG path — same layout as clusterFloorVertices
// Uses quadratic bézier arcs at each corner (r = corner radius in px).
export function roundedParallelogramPath(
  cx: number,
  cy: number,
  width: number,
  height: number,
  r: number = 12,
  skewX: number = 48
): string {
  const verts: [number, number][] = [
    [cx - width / 2,         cy + height / 2], // BL
    [cx + width / 2,         cy + height / 2], // BR
    [cx + width / 2 + skewX, cy - height / 2], // TR
    [cx - width / 2 + skewX, cy - height / 2], // TL
  ];
  const n = verts.length;

  const tangents = verts.map(([vx, vy], i) => {
    const [px, py] = verts[(i - 1 + n) % n];
    const [nx, ny] = verts[(i + 1) % n];
    const inLen  = Math.sqrt((px - vx) ** 2 + (py - vy) ** 2) || 1;
    const outLen = Math.sqrt((nx - vx) ** 2 + (ny - vy) ** 2) || 1;
    return {
      inPt:  [vx + ((px - vx) / inLen)  * r, vy + ((py - vy) / inLen)  * r] as [number, number],
      outPt: [vx + ((nx - vx) / outLen) * r, vy + ((ny - vy) / outLen) * r] as [number, number],
      corner: [vx, vy] as [number, number],
    };
  });

  const f = (v: number) => +v.toFixed(2);
  let d = `M ${f(tangents[0].outPt[0])} ${f(tangents[0].outPt[1])}`;
  for (let i = 1; i < n; i++) {
    const t = tangents[i];
    d += ` L ${f(t.inPt[0])} ${f(t.inPt[1])}`;
    d += ` Q ${f(t.corner[0])} ${f(t.corner[1])} ${f(t.outPt[0])} ${f(t.outPt[1])}`;
  }
  const t0 = tangents[0];
  d += ` L ${f(t0.inPt[0])} ${f(t0.inPt[1])}`;
  d += ` Q ${f(t0.corner[0])} ${f(t0.corner[1])} ${f(t0.outPt[0])} ${f(t0.outPt[1])} Z`;
  return d;
}

// Hexagon polygon centered at (cx, cy) with given radius
export function hexagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

// Card anchor point (center of bottom edge) for connection routing
export function cardAnchor(pos: Point, width: number = 240, height: number = 120): Point {
  return { x: pos.x + width / 2, y: pos.y + height / 2 };
}
