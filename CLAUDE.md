# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ZTA-Viz** — a conference-grade, static visualization for TM Forum Moonshot C26.0.933 (*Zero-Trust Agents for Autonomous Networks*). It tells six zero-trust governance stories through SVG animation. Target resolution: 1920×1080. No backend, no runtime network calls.

**Deployment:** Vercel (static site). GitHub remote: `git@github.com:felipevicens/zero-trust-agents-scenarios.git`. `pnpm build` produces `dist/` which Vercel serves directly.

**DESIGN.md is the authoritative specification.** All coordinates, colors, agent names, scenario steps, and gate labels come from it. Do not invent values; if something is ambiguous, use the nearest defined value and add a `// ASSUMPTION:` comment.

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start Vite dev server (http://localhost:5173)
pnpm build            # TypeScript compile + Vite production build → dist/
pnpm preview          # serve dist/ locally
pnpm typecheck        # tsc --noEmit (strict mode, no any, no @ts-ignore)
```

No test runner is defined yet. Phase 2 of the implementation plan adds a dev-only debug panel for manual state testing.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Vite + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + custom CSS for isometric transforms |
| Animation | Framer Motion + native SVG `stroke-dashoffset` |
| Icons | lucide-react |
| State | Zustand (single store — no prop drilling) |
| Package mgr | pnpm |

## Architecture

The app is a single-page static site. The entire application state lives in one Zustand store (`src/store/playback.ts`). Components read from it directly; no prop drilling.

**Data layer** (`src/data/`) is pure config — no logic:
- `agents.ts` — 9 visible agents + 2 hidden test agents (`displayInScene: false`)
- `mcps.ts` — 2 MCP nodes (hexagonal, distinct from agent cards)
- `connections.ts` — 11 permanent connections, all dashed (`stroke-dasharray: 6 4`)
- `scenarios/` — 6 scenario files (`s1`–`s6`), each exporting a `Scenario` with typed `ScenarioStep[]`

**Scene** (`src/components/scene/`) renders an SVG with `viewBox="0 0 1600 900"`:
- Three `<ClusterFloor>` (isometric parallelograms) at fixed coordinates
- `<AgentCard>` (240×120 rect) and `<MCPNode>` (hexagon) at SVG-space coordinates from `agents.ts` / `mcps.ts`
- `<ConnectionLayer>` sits above floors but below cards; all paths are quadratic Bézier (`src/lib/geometry.ts`)
- `<GovernanceGate>` and `<TraceMarker>` are transient overlays driven by the store

**Playback engine** (`src/hooks/useScenarioPlayer.ts`) advances `currentStepIndex` and derives `elementStates` / `connectionStates` from the current step. It reads `speed` (0.5×/1×/2×) from the store and multiplies all durations by `1/speed`. Default step hold is 1500ms; gate evaluate→resolve is 900ms.

**Keyboard shortcuts** (`src/hooks/useKeyboardShortcuts.ts`): `←`/`→` step, `Space` play/pause, `R` restart, `1`–`6` jump to scenario.

## Visual Rules (non-negotiable)

- CSS custom properties live in `src/styles/tokens.css` — never hardcode color hex values in components, always use `var(--token-name)`.
- **All connections are dashed**, always — `stroke-dasharray: 6 4`.
- **No model badge** (no `gpt-4.1-mini` or any model label anywhere in the UI).
- TypeScript strict mode: no `any`, no `@ts-ignore`.
- All agent state transitions interpolate over ≥300ms (no abrupt cuts).
- `prefers-reduced-motion`: animations collapse to a single state change.

## Agent States (Framer Motion variants on `<AgentCard>`)

`idle` | `active` (blue glow) | `gate` (amber shimmer) | `passed` (green pulse) | `blocked` (red shake) | `adversarial` (dashed orange wobble) | `trace` (purple glow) | `dimmed` (opacity 0.35)

## Dynamic Nodes

Scenarios S3 and S6 materialize nodes that don't exist in `agents.ts`:
- S3: `rogue-process` at (600, 250) — dashed orange hexagon, outside all cluster floors
- S6: `shadow-mcp` at (1040, 320) — orange dashed hexagon

These are created and destroyed by the playback engine; they are not in the static data files.

## Implementation Phases (current status: not started)

1. Static scene — cluster floors, agents, MCPs, connections
2. Animation primitives — connection flow, GovernanceGate, AgentCard variants, debug panel
3. Playback engine — store, hooks, controls, S1 complete
4. Remaining scenarios — S2–S6, dynamic nodes, S5 split-frame
5. Polish — Legend, tooltips, reduced-motion, README
