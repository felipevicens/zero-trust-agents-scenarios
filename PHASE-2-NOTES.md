# Phase 2 — Animation Primitives: Completion Notes

## What was built

### Agent state variants (`AgentCard.tsx`)
All 8 states implemented via Framer Motion on `motion.g` + `motion.circle`:

| State | Visual |
|---|---|
| `idle` | Default (no aura) |
| `active` | Blue pulsing aura (1.5s loop) |
| `gate` | Amber shimmer aura (0.9s loop) |
| `passed` | Green aura + ✓ overlay |
| `blocked` | Red aura + ✗ overlay + 0.8s shake keyframe |
| `adversarial` | Dashed orange ring + continuous wobble (1.2s loop) |
| `trace` | Purple glow aura |
| `dimmed` | Group opacity → 0.35 (300ms) |

### Connection flow animation (`ConnectionLayer.tsx`)
Accepts `connectionStates?: Record<string, ConnectionState>`. All 4 states:
- `inactive` — purple dashed, 0.6 opacity
- `flowing-permitted` — green flowing dash animation
- `flowing-blocked` — red flowing dash animation (faster)
- `adversarial` — orange wider dasharray

### `GovernanceGate.tsx`
- Yellow diamond (70×70 — slightly enlarged from 60×60 spec for label legibility; `// ASSUMPTION` comment added)
- Lifecycle: appear (scale 0→1, 300ms) → evaluate (amber shimmer, 900ms) → resolve (green ✓ / red ✗ with pop-in) → fade + `onDone()` (1500ms hold)
- Multiple gates can stack (each has unique ID via ref)
- `AnimatePresence` handles mount/unmount

### `TraceMarker.tsx`
- Purple pill at bottom-center of SVG
- Slides in from below (400ms ease-out)
- `AnimatePresence` handles visibility toggle

### `DevPanel.tsx` (dev-only)
- Toggle button top-right, only rendered when `import.meta.env.DEV`
- Agent State section: dropdown + 8 state buttons + "Reset all → idle"
- Connection State section: dropdown (11 connections) + 4 state buttons
- Governance Gate section: kind dropdown (11 kinds), position preset dropdown, Pass/Fail trigger
- Trace Marker section: preset text dropdown, Show/Hide

## Acceptance criteria ✅
- [x] Dev panel sets any agent to any of the 8 states
- [x] Connection flow animates in all 4 states
- [x] Gate appears, evaluates (amber 900ms), resolves (✓ green / ✗ red), fades

## Files changed
- `src/data/agents.ts` — added `AgentState` type
- `src/components/scene/AgentCard.tsx` — full rewrite with Framer Motion
- `src/components/scene/ConnectionLayer.tsx` — added `connectionStates` prop
- `src/components/scene/GovernanceGate.tsx` — new
- `src/components/scene/TraceMarker.tsx` — new
- `src/components/scene/Scene.tsx` — manages debug state, wires DevPanel + gate + trace
- `src/components/debug/DevPanel.tsx` — new
- `src/vite-env.d.ts` — new (enables `import.meta.env.DEV`)

## Branch
`phase-2/animation-primitives`
