# Phase 1 Notes

## Assumptions

All assumptions are marked with `// ASSUMPTION:` comments in the code.

### 1. Cluster floor geometry (`src/lib/geometry.ts`, `src/components/scene/Scene.tsx`)

Confirmed with user in Step 0 thread:
- **Shallow parallelogram (Option B)** — 15° skew on x-axis only, top edge shifted +48px right relative to bottom edge.
- Vertices for floor at `(cx, cy)`, `W×H`: bottom-left `(cx-W/2, cy+H/2)`, bottom-right `(cx+W/2, cy+H/2)`, top-right `(cx+W/2+48, cy-H/2)`, top-left `(cx-W/2+48, cy-H/2)`.
- Extrusion polygon is the same shape offset +16px on y.
- SVG `filter: drop-shadow(0 8px 24px rgba(0,0,0,0.4))` on the group.
- Agent nodes and MCPs use raw SVG coordinates — no projection transform.

### 2. Agent position = center of logo (`src/components/scene/AgentCard.tsx`)

`DESIGN.md §9` lists coordinates without specifying top-left vs. center. Treated as the **center** of the kagent logo. Connection endpoints also resolve to these center positions.

### 3. Same-cluster arc height = 40px (`src/components/scene/ConnectionLayer.tsx`)

`DESIGN.md §11` says same-cluster connections use "straight line or shallow curve". Chose `arcHeight = 40px` as a minimal Bézier curve that avoids the appearance of a flat line.

### 4. External infra line direction (`src/components/scene/MCPNode.tsx`)

Spec says "beyond canvas edge" but no direction given. `policy-mcp` (left cluster) → line extends left; `monitoring-mcp` (right cluster) → line extends right.

### 5. Cluster label above floor boundary

Labels float 28px above the floor top edge, centered on the skewed top edge (`cx + 24`). This avoids overlap with top-row agents (e.g. datacenter act-agent at y=350 sits above the floor's original top edge at y=360).

### 6. Floor sizes enlarged from spec values

`DESIGN.md §8` specifies 320×180 for all floors. Enlarged per user request to fully contain agent logos and labels:
- `tools` / `monitoring`: 400×260
- `datacenter`: 480×290 (2×3 grid spans y=350–570)

## User-requested changes (iterative refinements during Phase 1)

| Change | What | Implementation |
|---|---|---|
| Descriptions on hover | Description text removed from card body; shown in tooltip on `mouseenter` | `AgentCard.tsx` — SVG overlay with `<foreignObject>` |
| kagent logo next to name | Official kagent logo (GitHub org avatar) replaces the ⚙ icon | Downloaded to `public/kagent-logo.png`; rendered as `<image>` at 36×36 |
| Remove card box | Removed rect background; nodes are logo + name only | `AgentCard.tsx` — no `<rect>`, optional hover glow circle |
| Connected links glow on hover | Hovered agent's connections brighten with purple glow | `HoverContext.tsx` + `ConnectionLayer.tsx` + `Connection.tsx` |
| Remove "Healthy" status pill | Removed per user — adds noise at conference scale | `ClusterFloor.tsx` — label now just the cluster name |
| Remove version string `v1.35.x` | Removed per user | `ClusterFloor.tsx` |
| Larger cluster floors | Floors enlarged to contain all agent nodes within boundaries | `Scene.tsx` — per-cluster width/height |
