# ZTA-Viz

Conference-grade visualization for **TM Forum Moonshot Catalyst C26.0.933 — Zero-Trust Agents for Autonomous Networks**.

Six zero-trust governance scenarios told through SVG animation on a 2.5D map of three Kubernetes clusters and their kagent agents. Target resolution 1920×1080. No backend, no runtime network calls.

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 10 — `npm install -g pnpm`

---

## Quick start

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server → http://localhost:5173
```

---

## Build & deploy

```bash
pnpm build            # TypeScript compile + Vite build → dist/
pnpm preview          # serve dist/ locally to verify

pnpm typecheck        # strict type check, no any
```

The `dist/` directory is a fully static site — deploy to any static host.

**Vercel:** connect the repo, set build command `pnpm build`, output directory `dist`.  
**Manual:** upload the contents of `dist/` to your host root.

---

## Scenarios

| ID | Title | Story |
|----|-------|-------|
| S1 | Governed Autonomy | Happy path — zero-trust enables safe closed-loop remediation |
| S2 | The Hijacked Agent | Prompt injection detected via goal-scope mismatch |
| S3 | The Impostor Agent | Unverified identity — two failed mTLS / token attempts |
| S4 | The Overreaching Agent | Lateral movement blocked by audience mismatch |
| S5 | The Wandering Agent | Scope creep vs. correct delegation — side-by-side contrast |
| S6 | The Unregistered Capability | Shadow MCP denied — unregistered capabilities blocked by default |

---

## Controls

| Key | UI | Action |
|-----|----|--------|
| `→` | Next Step → | Advance one step |
| `←` | ← Previous Step | Go back one step |
| `Space` | ▶ / ⏸ | Play / Pause auto-advance |
| `R` | ⏹ Stop | Restart current scenario |
| `1`–`6` | Scenario pills | Jump to scenario S1–S6 |

Speed: **0.5×** / **1×** / **2×** — scales step hold time.

---

## Legend

Click the **◉ Legend** button (bottom-left of scene) for a color → meaning reference:

| Color | State | Meaning |
|-------|-------|---------|
| Blue | Active | Agent in action |
| Amber | Gate | Access check evaluating |
| Green | Permitted | Access granted |
| Red | Blocked | Access denied |
| Orange | Adversarial | Malicious / drift behavior |
| Purple | Trace | kagent audit trail |
| Teal | MCP | Model Context Protocol node |

---

## Architecture

See `DESIGN.md` for the full specification.

```
src/
  data/scenarios/     # S1–S6 step files — pure config, no logic
  store/playback.ts   # Zustand store — single source of truth
  hooks/              # useScenarioPlayer, useKeyboardShortcuts
  components/scene/   # SVG scene, agents, MCP nodes, gates, legend
  components/header/  # title + scenario selector
  components/footer/  # caption, playback controls
  styles/tokens.css   # all color tokens — never hardcode hex in components
```

Adding a new scenario: create `src/data/scenarios/sN-title.ts` following `Scenario` type in `types.ts`, register it in `index.ts`. Pills and controls wire up automatically.

---

*TM Forum Moonshot Catalyst C26.0.933 — Zero-Trust Agents for Autonomous Networks*
