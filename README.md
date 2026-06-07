# ZTA-Viz

Interactive visualization for **TM Forum Moonshot Catalyst C26.0.933** — *Zero-Trust Agents for Autonomous Networks*.

Animates six zero-trust governance scenarios on a 2.5D map of three Kubernetes clusters and their kagent agents.

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 10 (`npm install -g pnpm`)

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Build for production

```bash
pnpm build        # outputs to dist/
pnpm preview      # serve dist/ locally
```

## Type check

```bash
pnpm typecheck    # tsc --noEmit (strict mode)
```

## Deploy

The `dist/` directory is a fully static site — deploy it to any static host (Vercel, Netlify, GitHub Pages, `file://`).

**Vercel:** connect the repo and set the build command to `pnpm build` and output directory to `dist`.

## Controls (Phase 3+)

| Key | Action |
|---|---|
| `←` / `→` | Step backward / forward |
| `Space` | Play / Pause |
| `R` | Restart scenario |
| `1`–`6` | Jump to scenario |

## Architecture

See `DESIGN.md` for the full specification. Quick summary:

- **Scene** (`src/components/scene/`) — SVG `1600×900` with cluster floors, agent cards, MCP nodes, connection layer
- **Data** (`src/data/`) — pure config; no logic
- **Store** (`src/store/playback.ts`) — Zustand, added in Phase 3
- **Hooks** (`src/hooks/`) — playback engine + keyboard shortcuts, added in Phase 3
