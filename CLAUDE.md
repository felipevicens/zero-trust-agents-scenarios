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
| 1 — Static scene | `phase-1/static-scene` | ✅ **COMPLETE** |
| 2 — Animation primitives | `phase-2/animation-primitives` | 🔲 Next |
| 3 — Playback engine + S1 | `phase-3/playback-engine` | 🔲 |
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
- Shape: SVG `<polygon>`, shallow parallelogram, **not** a CSS-transformed div
- Skew: top edge shifts +48px right vs bottom edge (15° x-axis only)
- Vertices for `(cx, cy, W, H)`: `(cx-W/2, cy+H/2)` `(cx+W/2, cy+H/2)` `(cx+W/2+48, cy-H/2)` `(cx-W/2+48, cy-H/2)`
- Extrusion: same shape offset +16px y, filled `--bg-deep`
- Drop shadow: `filter: drop-shadow(0 8px 24px rgba(0,0,0,0.4))`

## Visual Rules (non-negotiable)

- CSS custom properties live in `src/styles/tokens.css` — never hardcode color hex values in components.
- **All connections are dashed**, always — `stroke-dasharray: 6 4`.
- **No model badge** anywhere in the UI.
- TypeScript strict mode: no `any`, no `@ts-ignore`.
- All agent state transitions interpolate over ≥300ms.
- `prefers-reduced-motion`: animations collapse to a single state change.

## Connection Opacity Rules

- **Base (idle):** `opacity: 0.4` — set via inline `style`, not SVG attribute (CSS class wins otherwise)
- **Hover — highlighted:** `opacity: 1.0` + purple glow filter
- **Flowing (animation):** `opacity: 1.0`
- The `.connection` CSS class in `globals.css` does NOT set opacity (removed to avoid conflict)

## Agent Node Visual (Phase 1 final design)

```
      [kagent-logo 36×36]     ← /public/kagent-logo.png
         agent-name           ← 16px Inter, textAnchor="middle", below logo
```

- **No background rect/box** — nodes are logo + label only
- Hover: subtle purple glow circle behind logo + description tooltip above
- On hover: connected line opacity → 1.0; other lines stay at 0.4

## Agent States (Framer Motion variants — Phase 2)

`idle` | `active` (blue glow) | `gate` (amber shimmer) | `passed` (green pulse) | `blocked` (red shake) | `adversarial` (dashed orange wobble) | `trace` (purple glow) | `dimmed` (opacity 0.35)

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

## Key Files

```
src/
  styles/tokens.css          # CSS variables — ONLY place to define colors
  styles/globals.css         # Tailwind + connection animation keyframes
  data/agents.ts             # AGENTS[] + VISIBLE_AGENTS
  data/mcps.ts               # MCPS[]
  data/connections.ts        # CONNECTIONS[] — 11 entries
  data/scenarios/types.ts    # ScenarioStep, Scenario interfaces
  lib/geometry.ts            # bezierPath(), clusterFloorVertices(), hexagonPoints()
  lib/colors.ts              # TS re-exports of token values
  components/scene/
    Scene.tsx                # SVG root + HoverProvider wrapper
    ClusterFloor.tsx         # Parallelogram floor + cluster name label
    AgentCard.tsx            # Logo-node + hover tooltip + HoverContext
    MCPNode.tsx              # Hexagon + MCPLogo + external infra line
    MCPLogo.tsx              # Official MCP SVG logo (white, inline)
    Connection.tsx           # Single Bézier path, highlighted/base opacity
    ConnectionLayer.tsx      # Builds all 11 connections, reads HoverContext
    HoverContext.tsx         # hoveredAgentId context
```
