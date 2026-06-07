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
