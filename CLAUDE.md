# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ZTA-Viz** — a conference-grade, static visualization for TM Forum Moonshot C26.0.933 (*Zero-Trust Agents for Autonomous Networks*). It tells six zero-trust governance stories through SVG animation. Target resolution: 1920×1080. No backend, no runtime network calls.

**Deployment:** Vercel (static site). GitHub remote: `git@github.com:felipevicens/zero-trust-agents-scenarios.git`. `pnpm build` produces `dist/` which Vercel serves directly.

**DESIGN.md is the authoritative specification.** All scenario steps, gate labels, and color tokens come from it. Do not invent values; if something is ambiguous, use the nearest defined value and add a `// ASSUMPTION:` comment.

> **Coordinates and visual layout have been adjusted from DESIGN.md spec values** during Phase 1 at the owner's request (see "Actual Layout" section below). Always read the source files — not the spec — for current positions.

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start Vite dev server (http://localhost:5173)
pnpm build            # TypeScript compile + Vite production build → dist/
pnpm preview          # serve dist/ locally
pnpm typecheck        # tsc --noEmit (strict mode, no any, no @ts-ignore)
```

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Vite + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + custom CSS |
| Animation | Framer Motion + native SVG `stroke-dashoffset` |
| Icons | lucide-react |
| State | Zustand (single store — no prop drilling, added Phase 3) |
| Package mgr | pnpm |

## Implementation Phases — Current Status

| Phase | Branch | Status |
|---|---|---|
| 1 — Static scene + visual polish | `phase-1/static-scene` | ✅ **COMPLETE** |
| 2 — Animation primitives | `phase-2/animation-primitives` | ✅ **COMPLETE** |
| 3 — Playback engine + S1 | `phase-3/playback-engine` | 🔄 **NEXT** |
| 4 — Scenarios S2–S6 | `phase-4/remaining-scenarios` | 🔲 |
| 5 — Polish | `phase-5/polish` | 🔲 |

## Architecture

The app is a single-page static site. State will live in one Zustand store (`src/store/playback.ts`) once Phase 3 lands.

**Data layer** (`src/data/`) is pure config — no logic:
- `agents.ts` — 9 visible agents + 2 hidden test agents (`displayInScene: false`)
- `mcps.ts` — 2 MCP nodes
- `connections.ts` — 11 permanent connections, all dashed (`stroke-dasharray: 6 4`)
- `scenarios/` — 6 scenario files (`s1`–`s6`), each exporting a `Scenario` with typed `ScenarioStep[]`

**Scene** (`src/components/scene/`) renders an SVG with `viewBox="0 0 1600 900"`:
- Three `<ClusterFloor>` — shallow parallelogram (15° x-skew, top edge +48px right)
- `<AgentCard>` — **node style**: kagent logo (36×36) + name below, NO card box/rect
- `<MCPNode>` — teal hexagon with official white MCP logo (SVG inline, `MCPLogo.tsx`)
- `<ConnectionLayer>` — above floors, below agents; quadratic Bézier paths
- `<HoverContext>` — React context providing `hoveredAgentId`; wires agent hover → connection highlight
- `<GovernanceGate>` and `<TraceMarker>` — transient overlays (Phase 2+)

**Keyboard shortcuts** (`src/hooks/useKeyboardShortcuts.ts`, Phase 3): `←`/`→` step, `Space` play/pause, `R` restart, `1`–`6` jump to scenario.

## Actual Layout (source of truth — modified from DESIGN.md §8–9)

### Cluster floors
| Cluster | cx | cy | width | height |
|---|---|---|---|---|
| `tools` | 290 | 450 | 400 | 312 |
| `datacenter` | 800 | 450 | 480 | 396 |
| `monitoring` | 1310 | 450 | 400 | 312 |

### Agent positions (center of logo)
| Agent | x | y | Cluster |
|---|---|---|---|
| `cladra-agent` | 290 | 390 | tools |
| `policy-mcp` | 190 | 520 | tools |
| `act-agent` | 700 | 350 | datacenter |
| `capability-agent` | 900 | 350 | datacenter |
| `core-diagnostic-agent` | 700 | 460 | datacenter |
| `decision-agent` | 900 | 460 | datacenter |
| `ran-diagnostic-agent` | 700 | 570 | datacenter |
| `reporting-agent` | 900 | 570 | datacenter |
| `prediction-agent` | 1310 | 390 | monitoring |
| `slo-agent` | 1310 | 540 | monitoring |
| `monitoring-mcp` | 1420 | 520 | monitoring |

### Floor geometry
- Shape: SVG `<path>` via `roundedParallelogramPath()` in `lib/geometry.ts` — **not** `<polygon>`
- Skew: top edge shifts +48px right vs bottom edge (15° x-axis only)
- Corner radius: `r=14` (quadratic bézier arcs at each corner)
- Vertices for `(cx, cy, W, H)`: `(cx-W/2, cy+H/2)` `(cx+W/2, cy+H/2)` `(cx+W/2+48, cy-H/2)` `(cx-W/2+48, cy-H/2)`
- Extrusion: same shape at `cy+16`, filled `--bg-deep`, `strokeOpacity=0.25`
- Top face stroke: `--kagent-purple-glow` at full opacity + `drop-shadow(0 0 9px rgba(139,92,246,0.6))`
- Outer drop shadow: `filter: drop-shadow(0 20px 48px rgba(0,0,0,0.85))`
- Kubernetes logo (32×32) at top-right corner: `cx = cx+W/2+48-20`, `cy = cy-H/2+20`

## Visual Rules (non-negotiable)

- CSS custom properties live in `src/styles/tokens.css` — never hardcode color hex values in components.
- **All connections are dashed**, always — `stroke-dasharray: 6 4`.
- **No model badge** anywhere in the UI.
- TypeScript strict mode: no `any`, no `@ts-ignore`.
- All agent state transitions interpolate over ≥300ms.
- `prefers-reduced-motion`: animations collapse to a single state change.

## Connection Opacity Rules

- **Base (idle):** `opacity: 0.6` — set via inline `style`, not SVG attribute (CSS class wins otherwise)
- **Hover — highlighted:** `opacity: 1.0` + purple glow filter
- **Flowing (animation):** `opacity: 1.0`
- The `.connection` CSS class in `globals.css` does NOT set opacity (removed to avoid conflict)

## Connection Endpoint Dots

- Small circles (`r=3.5`) rendered at each connection endpoint
- Position: **perimeter of the node**, not the center — offset along the **Bézier tangent** at that endpoint (not the straight-line vector)
- `fromRadius=28` for agents (just outside 54/2=27px logo), `fromRadius=42` for MCP hexagons
- Base: `opacity=0.65`, no filter; Hover: `opacity=1.0` + `url(#dot-glow)` SVG filter (defined in `Scene.tsx` defs)
- Glow filter id: `dot-glow` — `feGaussianBlur stdDeviation=3.5` + `feMerge`

## Agent Node Visual (final — post visual polish)

```
      [kagent-logo 54×54]     ← /public/kagent-logo.png
         agent-name           ← 16px Inter, textAnchor="middle", fill=textPrimary, below logo
```

- **No background rect/box** — nodes are logo + label only
- Hover: purple glow circle behind logo (`r=LOGO_SIZE*0.9`) + description tooltip above
- **No glow circle at rest** — circle only appears on hover
- Agent name always `textPrimary` (#f5f5fa), `fontWeight=400` at rest, `600` on hover
- On hover: connected line opacity → 1.0; other lines stay at 0.6

## Agent States (Framer Motion — implemented Phase 2)

`idle` | `active` (blue pulse aura, 1.5s loop) | `gate` (amber shimmer aura, 0.9s loop) | `passed` (green aura + ✓ overlay) | `blocked` (red aura + ✗ overlay + 0.8s shake) | `adversarial` (dashed orange ring + 1.2s wobble loop) | `trace` (purple glow aura) | `dimmed` (opacity 0.35, 300ms)

- `AgentCard` accepts `state?: AgentState` prop (default `idle`)
- All transitions on `motion.g` wrapper + `motion.circle` aura; `transformOrigin` set to node center
- `AgentState` type exported from `src/data/agents.ts`

## GovernanceGate (Phase 2)

- SVG diamond, S=30 (60×60 bounding box per spec)
- **Label rendered below the diamond** (not inside) at 13px, up to 20 chars/line
- Inside diamond: `?` while evaluating, large `✓`/`✗` after resolve
- Lifecycle: appear (scale 0→1, 300ms) → evaluate (amber shimmer halo, 900ms) → resolve (green/red fill + glow pop) → hold 1500ms → fade + `onDone()`
- Multiple gates can stack simultaneously (unique IDs via `useRef` counter)
- Wrapped in `<AnimatePresence>` in `Scene.tsx`

## GovernanceGate preset positions (DevPanel)

| Preset | SVG x | SVG y | Notes |
|---|---|---|---|
| Above TOOLS | 314 | 155 | cx+24 of tools cluster |
| Above DATACENTER | 824 | 120 | cx+24 of datacenter cluster |
| Above MONITORING | 1334 | 155 | cx+24 of monitoring cluster |

## TraceMarker (Phase 2)

- Purple rounded pill, centered at `(800, 840)` (bottom of scene)
- Slides in from below (400ms ease-out) via `motion.g`
- Text preset via DevPanel; shown/hidden via `<AnimatePresence>`

## DevPanel (Phase 2, dev-only)

- Rendered only when `import.meta.env.DEV` — not in production builds
- Top-right collapsible toggle
- Sections: Agent State | Connection State | Governance Gate | Trace Marker
- `src/components/debug/DevPanel.tsx`

## Dynamic Nodes (Phase 4)

Scenarios S3 and S6 materialize nodes not in `agents.ts`:
- S3: `rogue-process` at (600, 250) — dashed orange hexagon, outside all cluster floors
- S6: `shadow-mcp` at (1040, 320) — orange dashed hexagon

## Typography (current values)

| Element | Size |
|---|---|
| Page title | 22px (header) |
| Cluster name | 19px |
| Agent name | 16px |
| MCP label | 16px |
| Tooltip / caption | 12–14px |
| Minimum | 12px |

## Color Tokens (confirmed palette — do not change without owner approval)

| Token | Value | Usage |
|---|---|---|
| `--bg-deep` | `#0a0a14` | SVG background |
| `--bg-surface` | `#12122a` | Cluster floor fill |
| `--bg-card` | `#1a1a2e` | Tooltip + card backgrounds |
| `--kagent-purple` | `#6c3fc5` | Floor extrusion stroke, fills |
| `--kagent-purple-glow` | `#8b5cf6` | Floor border, connections, dots |
| `--kagent-purple-soft` | `#9f7aea` | Available for Phase 2+ accent use |
| `--mcp-healthy` | `#00d4aa` | MCP hexagon stroke |

## Key Files

```
src/
  vite-env.d.ts              # /// <reference types="vite/client" /> — enables import.meta.env
  styles/tokens.css          # CSS variables — ONLY place to define colors
  styles/globals.css         # Tailwind + connection animation keyframes
  data/agents.ts             # AGENTS[], VISIBLE_AGENTS, AgentState type
  data/mcps.ts               # MCPS[]
  data/connections.ts        # CONNECTIONS[] — 11 entries
  data/scenarios/types.ts    # ScenarioStep, Scenario interfaces
  lib/geometry.ts            # bezierPath(), roundedParallelogramPath(), hexagonPoints()
  lib/colors.ts              # TS re-exports of token values
  components/
    debug/
      DevPanel.tsx           # Dev-only state trigger panel (import.meta.env.DEV)
    scene/
      Scene.tsx              # SVG root + state management + DevPanel + AnimatePresence gates
      ClusterFloor.tsx       # Rounded parallelogram floor + K8s logo + cluster label
      AgentCard.tsx          # motion.g node — 8 AgentState variants via Framer Motion
      MCPNode.tsx            # Hexagon + MCPLogo + external infra labels
      MCPLogo.tsx            # Official MCP SVG logo (white, inline)
      KubernetesLogo.tsx     # Official K8s SVG logo (inline, placed on floor corners)
      Connection.tsx         # Bézier path + perimeter dots + ConnectionState flow classes
      ConnectionLayer.tsx    # Builds all 11 connections; accepts connectionStates prop
      GovernanceGate.tsx     # Transient diamond gate — appear/evaluate/resolve/fade lifecycle
      TraceMarker.tsx        # Purple pill — AnimatePresence slide-in from bottom
      HoverContext.tsx       # hoveredAgentId context
```
