# ZTA‑Viz — Design Blueprint & Build Specification

> **Project:** ZTA‑Viz
> **Catalyst reference:** TM Forum Moonshot C26.0.933 — *Zero‑Trust Agents for Autonomous Networks*
> **Document version:** 2.0 (fused)
> **Status:** Ready for build

---

## 0. Mission

Build a **premium, conference-grade visualization** that explains six Zero‑Trust governance scenarios through motion, color, topology, and contrast.

An attendee standing 3–5 metres from the screen must understand the outcome of each scenario *without reading detailed text*.

This is a **storytelling system**, not an operational dashboard.

---

## 1. Experience Hierarchy

When two visual elements compete, the lower-priority one is reduced in prominence.

1. Active agent
2. Governance decision (gate result)
3. Permitted vs blocked path
4. Scenario title
5. Caption text
6. Topology context

This hierarchy is the tie-breaker for every design decision downstream.

---

## 2. Goals & Non-Goals

### Goals
- **G1.** Communicate cluster topology and agent placement at a glance.
- **G2.** Make the six scenarios self-explanatory through animation alone.
- **G3.** Match the visual language of the kagent dashboard (dark, purple/teal).
- **G4.** Portable: runnable from any static host or `file://`.
- **G5.** Data-driven: a new scenario or agent is a data-only change.

### Non-Goals
- Real-time cluster data (this is a demo model).
- True WebGL/Three.js 3D — we use **2.5D CSS isometric + SVG**.
- Mobile-first design (target 1920×1080).
- Authentication, persistence, multi-user state.

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Vite + React 18 + TypeScript (strict)** |
| Styling | **Tailwind CSS** + custom CSS for isometric transforms |
| Animation | **Framer Motion** + native SVG `stroke-dashoffset` |
| Icons | **lucide-react** |
| State | **Zustand** (single store) |
| Package mgr | **pnpm** |
| Build output | Static `dist/` folder, deployable anywhere |

No backend. No database. No runtime network calls.

---

## 4. Screen Blueprint

```
Target resolution:   1920 × 1080
Internal SVG scene:  1600 × 900 viewBox

┌────────────────────────────────────────────────┐
│  HEADER          120px   (title + scenario     │
│                           selector)            │
├────────────────────────────────────────────────┤
│                                                │
│  SCENE           600px   (~70% of attention)   │
│                                                │
├────────────────────────────────────────────────┤
│  FOOTER          180px   (caption + controls)  │
└────────────────────────────────────────────────┘
```

The scene must occupy ~70% of visual attention.

---

## 5. Visual Style

Inspired by the kagent dashboard.

**Use:**
- dark surfaces
- purple accents
- soft neon glows
- elevated cards with subtle gradients

**Avoid:**
- enterprise-dashboard clutter
- tables
- dense controls
- sidebars

---

## 6. Color System

```css
/* Base */
--bg-deep:        #0a0a14;
--bg-surface:     #12122a;
--bg-card:        #1a1a2e;
--border-subtle:  #2d2d5e;

/* Brand */
--kagent-purple:       #6c3fc5;
--kagent-purple-glow:  #8b5cf6;

/* Semantic — scenario states */
--state-active:        #3b82f6;   /* blue   — agent in action */
--state-gate:          #f59e0b;   /* amber  — gate evaluating */
--state-pass:          #10b981;   /* green  — permitted */
--state-block:         #ef4444;   /* red    — blocked */
--state-adversarial:   #fb923c;   /* orange — malicious / drift */
--state-trace:         #a855f7;   /* purple — kagent trace */

/* MCP / external */
--mcp-healthy:         #00d4aa;

/* Text */
--text-primary:        #f5f5fa;
--text-secondary:      #a0a0c0;
--text-muted:          #6c6c8a;
```

---

## 7. Typography

- **Font:** Inter (via `@fontsource/inter`)
- **Mono:** JetBrains Mono (for tokens/IDs in tooltips)

| Use | Size |
|---|---|
| Page title | 36px |
| Scenario title | 28px |
| Caption | 18px |
| Agent name | 16px |
| Description / label | 14px |
| Minimum | 14px |

---

## 8. Cluster Geometry

Three clusters, left → right.

| Cluster | Center (x, y) | Floor size | Extrusion |
|---|---|---|---|
| `tools` | 350, 450 | 320 × 180 | 16px |
| `datacenter` | 800, 450 | 320 × 180 | 16px |
| `monitoring` | 1250, 450 | 320 × 180 | 16px |

Each floor is an isometric parallelogram with a soft drop shadow underneath. Floors are styled with `--bg-surface` fill and `--kagent-purple` stroke at 60% opacity.

---

## 9. Agent Coordinates

All coordinates are SVG-space (1600×900 viewBox).

### `tools` cluster
| Element | x, y |
|---|---|
| `cladra-agent` | 350, 390 |
| `policy-mcp` | 250, 520 |

### `datacenter` cluster
| Element | x, y |
|---|---|
| `act-agent` | 700, 350 |
| `capability-agent` | 900, 350 |
| `core-diagnostic-agent` | 700, 460 |
| `decision-agent` | 900, 460 |
| `ran-diagnostic-agent` | 700, 570 |
| `reporting-agent` | 900, 570 |

> The two test agents (`test-cladra-policy-agent`, `test-policy-agent`) are **omitted from the scene** — they exist in the kagent deployment but add noise to the demo and play no role in scenarios. They remain in `agents.ts` for completeness but are flagged `displayInScene: false`.

### `monitoring` cluster
| Element | x, y |
|---|---|
| `prediction-agent` | 1250, 390 |
| `slo-agent` | 1250, 540 |
| `monitoring-mcp` | 1360, 520 |

---

## 10. Permanent Connection Topology

All connections are rendered on first paint with **20% opacity**. Active connections light up to their semantic color and animate.

```
slo-agent           → cladra-agent
prediction-agent    → cladra-agent
policy-mcp          → cladra-agent

cladra-agent        → ran-diagnostic-agent
cladra-agent        → core-diagnostic-agent
cladra-agent        → capability-agent
cladra-agent        → decision-agent
cladra-agent        → act-agent
cladra-agent        → reporting-agent

monitoring-mcp      → prediction-agent
monitoring-mcp      → slo-agent
```

**All connections use a dashed stroke** (`stroke-dasharray: 6 4`) — non-negotiable, this is what enables flow animation.

---

## 11. Bézier Routing Rules

- **Same cluster:** straight line or shallow curve.
- **Cross cluster:** quadratic Bézier.
- **Arc height:** 80–120px above the midpoint between endpoints.
- **Never intersect agent cards.**
- **Never cross cluster labels.**

Helper function in `src/lib/geometry.ts`:

```typescript
function bezierPath(from: Point, to: Point, arcHeight: number = 100): string {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - arcHeight;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}
```

---

## 12. Component Specifications

### 12.1 `<Scene />`
- SVG root, `viewBox="0 0 1600 900"`.
- Background: subtle dot grid at 10% opacity.
- Children: three `<ClusterFloor>`, all `<AgentCard>` / `<MCPNode>`, `<ConnectionLayer>` (z-index above floors, below cards), transient `<GovernanceGate>` overlays.

### 12.2 `<ClusterFloor name, position />`
- Isometric parallelogram, 320×180.
- Top-left label: cluster name + `Healthy` pill (matching kagent dashboard).
- Version pill `1.35.x` in muted text.

### 12.3 `<AgentCard agent, state />`

```
┌─────────────────────────────┐
│ ⚙  agent-name               │  16px, white
│                             │
│ Short description text...   │  14px, --text-secondary
│                             │
│ [kagent]                    │  badge — NO model badge
└─────────────────────────────┘
```

- Size: **240 × 120**.
- Border-radius: 10px.
- Border: 1.5px solid `--border-subtle` (default).
- Hover: border `--kagent-purple`, tooltip with full description.
- **No `gpt-4.1-mini` or other model badge — explicit requirement.**

### 12.4 `<MCPNode />`
- Hexagonal SVG polygon (differentiates from rectangular agents).
- Fill `--bg-card`, border `--mcp-healthy`.
- `lucide:plug` icon inside.
- Connected to external infra glyph beyond the canvas edge with a longer dashed teal line.

### 12.5 `<Connection from, to, state />`
- SVG `<path>`, dashed.
- States: `inactive` | `flowing-permitted` | `flowing-blocked` | `adversarial`.
- See §16 for animation specs.

### 12.6 `<GovernanceGate kind, position, result />`
- Yellow diamond (60×60), label inside.
- Lifecycle: Appear → Evaluate (shimmer 900ms) → Resolve (✓ green or ✗ red) → Fade.
- Gate kinds (label text):
  - `OIDC identity verified?`
  - `Token scope: CRM + PM read?`
  - `Scoped to RAN domain?`
  - `Scoped to Core domain?`
  - `Read-only Policy scope?`
  - `Within approved playbook?`
  - `Single-use write token?`
  - `Goal matches declared scope?`
  - `mTLS cert from trusted CA?`
  - `Token audience matches caller?`
  - `Capability in registry as 'approved'?`

### 12.7 `<TraceMarker />`
- Purple rounded pill that appears at the end of each scenario.
- Text varies per scenario (e.g., "All green ✓", "Two red nodes", "Green + Red block").

### 12.8 `<ScenarioSelector />`
- Six horizontal pills in the header: S1–S6.
- Active pill filled `--kagent-purple`, inactive outlined.
- Below each pill (on hover): full title.

### 12.9 `<PlaybackControls />`
- ⏮ Restart · ◀ Prev · ▶ Play / ⏸ Pause · ▶▶ Next · Speed (0.5×/1×/2×) · ☑ Autoplay toggle.

### 12.10 `<CaptionPanel />`
- Center of footer.
- Displays current step's caption (max 2 lines, 18px).
- Fade between steps (300ms).

### 12.11 `<Legend />`
- Bottom-right collapsible panel.
- Color → meaning mapping per §6.

---

## 13. Motion Language

| State | Treatment | Duration |
|---|---|---|
| `idle` | neutral border | — |
| `active` | blue pulse, soft glow | 1500ms loop |
| `gate` | amber shimmer | 900ms |
| `passed` | green pulse + ✓ tick | 1000ms |
| `blocked` | red border + shake (4 cycles) | 200ms × 4 |
| `adversarial` | dashed orange border + wobble | 1200ms loop |
| `trace` | purple glow | hold to end |
| `dimmed` | opacity 0.35 | 300ms fade |

**No abrupt transitions.** All state changes interpolate over ≥300ms.

---

## 14. Data Model

### 14.1 `src/data/agents.ts`

```typescript
export type Cluster = "tools" | "datacenter" | "monitoring";

export interface Agent {
  id: string;
  name: string;
  description: string;
  cluster: Cluster;
  position: { x: number; y: number };
  displayInScene: boolean;
}

export const AGENTS: Agent[] = [
  { id: "cladra-agent", name: "cladra-agent",
    description: "CLADRA orchestrator — coordinates diagnostic, capability, decision, and action agents",
    cluster: "tools", position: { x: 350, y: 390 }, displayInScene: true },

  { id: "act-agent", name: "act-agent",
    description: "Executes VoLTE remediation actions",
    cluster: "datacenter", position: { x: 700, y: 350 }, displayInScene: true },

  { id: "capability-agent", name: "capability-agent",
    description: "Evaluates available VoLTE remediation capabilities",
    cluster: "datacenter", position: { x: 900, y: 350 }, displayInScene: true },

  { id: "core-diagnostic-agent", name: "core-diagnostic-agent",
    description: "Diagnoses issues in the core network infrastructure using VoLTE data",
    cluster: "datacenter", position: { x: 700, y: 460 }, displayInScene: true },

  { id: "decision-agent", name: "decision-agent",
    description: "Makes remediation decisions based on diagnostics and capabilities",
    cluster: "datacenter", position: { x: 900, y: 460 }, displayInScene: true },

  { id: "ran-diagnostic-agent", name: "ran-diagnostic-agent",
    description: "Diagnoses issues in the Radio Access Network using VoLTE diagnostic tools",
    cluster: "datacenter", position: { x: 700, y: 570 }, displayInScene: true },

  { id: "reporting-agent", name: "reporting-agent",
    description: "Creates a ServiceNow incident that captures the pipeline outcome",
    cluster: "datacenter", position: { x: 900, y: 570 }, displayInScene: true },

  { id: "prediction-agent", name: "prediction-agent",
    description: "Predicts network issues and triggers CLADRA proactively",
    cluster: "monitoring", position: { x: 1250, y: 390 }, displayInScene: true },

  { id: "slo-agent", name: "slo-agent",
    description: "Monitors Service Level Objectives and triggers CLADRA for violations",
    cluster: "monitoring", position: { x: 1250, y: 540 }, displayInScene: true },

  // Excluded from scene — kept for inventory completeness
  { id: "test-cladra-policy-agent", name: "test-cladra-policy-agent",
    description: "Test agent to validate AccessPolicy enforcement against cladra-agent",
    cluster: "datacenter", position: { x: 0, y: 0 }, displayInScene: false },
  { id: "test-policy-agent", name: "test-policy-agent",
    description: "Test agent to validate AccessPolicy enforcement against moonshot1 agents",
    cluster: "datacenter", position: { x: 0, y: 0 }, displayInScene: false },
];
```

### 14.2 `src/data/mcps.ts`

```typescript
export interface MCPNode {
  id: string;
  cluster: Cluster;
  position: { x: number; y: number };
  externalTargets: string[];
}

export const MCPS: MCPNode[] = [
  { id: "policy-mcp", cluster: "tools", position: { x: 250, y: 520 },
    externalTargets: ["Policy Registry", "PCRF", "IMS Gateway", "ServiceNow"] },
  { id: "monitoring-mcp", cluster: "monitoring", position: { x: 1360, y: 520 },
    externalTargets: ["Prometheus", "Grafana", "xDR Records", "SLO Telemetry"] },
];
```

### 14.3 `src/data/scenarios/types.ts`

```typescript
export type StepKind =
  | "agent-action"     // an agent acts (no gate)
  | "gate"             // governance gate evaluation
  | "permitted"        // explicit pass marker
  | "blocked"          // explicit block marker
  | "adversarial"      // malicious / drift behavior
  | "trace";           // final kagent trace evidence

export interface ScenarioStep {
  id: string;
  kind: StepKind;
  actor?: string;              // agent id
  target?: string;             // agent id (for connections)
  caption: string;
  gateLabel?: string;
  gateResult?: "pass" | "fail";
  durationMs?: number;         // default 1500
}

export interface Scenario {
  id: "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
  title: string;
  subtitle: string;
  emotion: string;             // visual anchor — see §15
  takeaway: string;            // audience message
  steps: ScenarioStep[];
}
```

---

## 15. Scenarios — Storyboards & Detailed Steps

Each scenario carries **three layers**: emotion (visual anchor), step list (mechanical sequence), and peak moment (the frame that must read clearly from across the room).

> **Agent name mapping from PDF → kagent deployment:**
> - "Orchestrator Agent" → `cladra-agent`
> - "Root Cause Agent" → `capability-agent` (queries Policy MCP)
> - "Remediation Agent" → `act-agent`
> - "Diagnostic Agent (RAN)" → `ran-diagnostic-agent`
> - "Diagnostic Agent (Core)" → `core-diagnostic-agent`
> - "SLO Agent" → `slo-agent`

---

### S1 — Governed Autonomy

- **Subtitle:** Happy path — zero-trust governance enabling safe closed-loop remediation
- **Emotion:** Confidence
- **Path:** Blue → Green
- **Takeaway:** Zero Trust enables autonomy.

**Steps:**

```
 1. [agent-action]  slo-agent              — "SLO Agent detects anomaly"
 2. [gate]          slo-agent              — "OIDC identity verified?" → PASS
 3. [agent-action]  slo-agent → cladra     — "Triggers CLADRA orchestrator"
 4. [agent-action]  cladra                 — "Orchestrator correlates ITSM tickets"
 5. [gate]          cladra                 — "Token scope: CRM + PM read?" → PASS
 6. [agent-action]  cladra → ran-diag      — "Tasks RAN diagnostic"
 7. [gate]          ran-diag               — "Scoped to RAN domain?" → PASS
 8. [permitted]     ran-diag               — "RAN reads complete"
 9. [agent-action]  cladra → core-diag     — "Tasks Core diagnostic"
10. [gate]          core-diag              — "Scoped to Core domain?" → PASS
11. [permitted]     core-diag              — "Core reads complete"
12. [agent-action]  cladra → capability    — "Queries Policy MCP for capabilities"
13. [gate]          capability             — "Read-only Policy scope?" → PASS
14. [agent-action]  cladra → decision      — "Evaluates remediation"
15. [gate]          decision               — "Within approved playbook?" → PASS
16. [agent-action]  cladra → act           — "PCRF policy refresh"
17. [gate]          act                    — "Single-use write token?" → PASS
18. [permitted]     act                    — "Remediation executed"
19. [agent-action]  slo-agent              — "Validates fix"
20. [agent-action]  cladra → reporting     — "Creates ServiceNow incident"
21. [trace]         all                    — "kagent trace — all green ✓"
```

**Peak moment:** step 21 — every involved agent pulses green simultaneously for 2s, all connection paths replay end-to-end in green.

---

### S2 — The Hijacked Agent

- **Subtitle:** Adversarial — prompt injection / goal hijacking
- **Emotion:** Corruption
- **Path:** Blue → Orange → Red
- **Focus:** `core-diagnostic-agent`
- **Takeaway:** Prompt injection detected.

**Steps:**

```
1. [agent-action]  slo-agent              — "SLO Agent detects anomaly"
2. [agent-action]  cladra → core-diag     — "Orchestrator tasks Core diagnostic"
3. [agent-action]  core-diag              — "Reads xDR via Core MCP"
4. [adversarial]   core-diag              — "Malicious payload in xDR — goal state shifts"
5. [gate]          core-diag              — "Goal matches declared scope?" → FAIL
6. [blocked]       core-diag              — "BLOCKED — goal deviation"
7. [blocked]       core-diag              — "Agent suspended — escalated to NOC"
8. [trace]         core-diag              — "kagent trace — red blocked edge"
```

**Peak moment:** step 4 — `core-diagnostic-agent` flips to dashed orange border with a subtle wobble; step 6 it snaps to red with shake.

---

### S3 — The Impostor Agent

- **Subtitle:** Adversarial — unverified agent identity
- **Emotion:** Intrusion
- **Takeaway:** Identity matters.

A **dynamic node** `rogue-process` materializes at position (600, 250) — *outside* any cluster floor — as a dashed orange hexagon labeled `remediation-agent-v2`. Never enters the fabric.

**Steps:**

```
1. [adversarial]   rogue                  — "Rogue process 'remediation-agent-v2' appears"
2. [adversarial]   rogue → datacenter     — "Attempt 1: self-signed cert"
3. [gate]          rogue                  — "mTLS cert from trusted CA?" → FAIL
4. [blocked]       rogue                  — "REJECTED — untrusted CA"
5. [adversarial]   rogue → datacenter     — "Attempt 2: replayed token"
6. [gate]          rogue                  — "Token audience matches caller?" → FAIL
7. [blocked]       rogue                  — "REJECTED — audience mismatch / replay"
8. [trace]         rogue                  — "kagent trace — two red nodes"
```

**Peak moment:** both attempts visibly bounce off red gates without ever touching a cluster floor.

---

### S4 — The Overreaching Agent

- **Subtitle:** Adversarial — privilege escalation / lateral movement
- **Emotion:** Temptation
- **Focus:** `core-diagnostic-agent` (same agent, two outcomes)
- **Takeaway:** Tokens cannot be reused outside scope.

**Steps:**

```
1. [agent-action]  core-diag              — "Queries Core MCP"
2. [gate]          core-diag              — "Scoped to Core domain?" → PASS
3. [permitted]     core-diag              — "Core reads complete — anomaly confirmed"
4. [adversarial]   core-diag              — "LLM reasons: 'IMS reset might fix this'"
5. [adversarial]   core-diag              — "Constructs IMS call with Core-domain token"
6. [gate]          core-diag              — "Token audience = 'ims-remediation'?" → FAIL
7. [blocked]       core-diag              — "403 REJECTED — audience mismatch"
8. [blocked]       core-diag              — "Lateral movement flagged and logged"
9. [trace]         core-diag              — "kagent trace — green → red block"
```

**Peak moment:** the same agent shows a green tick at step 3, then an orange dashed outline at step 4, then red at step 7. **Contrast on a single agent is the message.**

---

### S5 — The Wandering Agent

- **Subtitle:** Adversarial — scope creep / domain boundary violation
- **Emotion:** Comparison
- **Takeaway:** Correct delegation beats autonomous drift.
- **Priority:** highest visual priority of all six scenarios.

Two **parallel tracks** play simultaneously. The canvas splits visually — left green (legitimate), right red (rogue).

**Steps (interleaved):**

```
LEGITIMATE TRACK                          ROGUE TRACK
 1. ran-diag queries RAN MCP
 2. [gate] Scoped to RAN domain? → PASS
 3. [permitted] RAN reads complete
                                          4'. [adversarial] LLM reasons:
 4. ran-diag → cladra (handoff)              "PCRF misconfig is cause"
 5. cladra → capability                   5'. [adversarial] Constructs PCRF
    (Root Cause via Policy MCP)              read with RAN-domain token
 6. [gate] Read-only Policy scope?         6'. [gate] PCRF in scope? → FAIL
    → PASS                                 7'. [blocked] BLOCKED at mesh
 7. [permitted] PCRF read succeeds            — PCRF not in scope
    under authorised token

 8. [trace] kagent trace — blocked + correct side by side
```

**Peak moment:** the split frame — green left half, red right half — converging on the trace pill.

---

### S6 — The Unregistered Capability

- **Subtitle:** Adversarial / governance drift — shadow MCP/tool/skill
- **Emotion:** Discovery
- **Takeaway:** Unregistered capabilities are denied by default.

A **dynamic node** `shadow-mcp` materializes at position (1040, 320) as an orange dashed hexagon.

**Steps:**

```
1. [agent-action]  core-diag              — "Using approved tools"
2. [permitted]     core-diag              — "Approved tool calls complete ✓"

Branch A (legitimate, continues in parallel):
3a. [agent-action] cladra                 — "Orchestrator notified of block"
4a. [permitted]    cladra                 — "Investigation continues on approved tooling"

Branch B (rogue):
3b. [adversarial]  shadow-mcp materializes — "Discovers unregistered MCP on network"
4b. [adversarial]  core-diag → shadow-mcp — "Constructs tool invocation request"
5b. [gate]         core-diag              — "Capability in registry as 'approved'?" → FAIL
6b. [blocked]      core-diag              — "BLOCKED — no registry entry"
7b. [blocked]      core-diag              — "Suggest: submit for registry approval"

8. [trace] all — "kagent trace — green + red block"
```

**Peak moment:** the phantom MCP appears beside `datacenter`, an attempted connection bounces off the gate and fades, while the legitimate `cladra` branch continues lit in green.

---

## 16. Animation System

### 16.1 Connection flow

```css
@keyframes dash-flow {
  to { stroke-dashoffset: -20; }
}

.connection {
  stroke-dasharray: 6 4;
  stroke-dashoffset: 0;
  opacity: 0.2;            /* default — inactive */
  transition: opacity 300ms, stroke 300ms;
}

.connection--flowing {
  opacity: 1;
  animation: dash-flow 1.2s linear infinite;
}

.connection--permitted   { stroke: var(--state-pass); }
.connection--blocked     { stroke: var(--state-block); animation-duration: 0.8s; }
.connection--adversarial { stroke: var(--state-adversarial); stroke-dasharray: 10 5; }
```

### 16.2 Agent card variants (Framer Motion)

```typescript
const cardVariants = {
  idle: {
    borderColor: "var(--border-subtle)",
    scale: 1,
    boxShadow: "none"
  },
  active: {
    borderColor: "var(--state-active)",
    scale: 1.02,
    boxShadow: "0 0 24px rgba(59,130,246,0.5)"
  },
  gate: {
    borderColor: "var(--state-gate)",
    boxShadow: "0 0 16px rgba(245,158,11,0.4)"
  },
  passed: {
    borderColor: "var(--state-pass)",
    boxShadow: "0 0 24px rgba(16,185,129,0.5)"
  },
  blocked: {
    borderColor: "var(--state-block)",
    x: [0, -4, 4, -4, 4, 0],
    transition: { x: { duration: 0.4 } }
  },
  adversarial: {
    borderColor: "var(--state-adversarial)",
    borderStyle: "dashed",
    rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
    transition: { rotate: { duration: 1.2, repeat: Infinity } }
  },
  dimmed: { opacity: 0.35 }
};
```

### 16.3 Default timings

- Step hold: **1500ms** (overridable per step)
- Gate evaluate → resolve: **900ms**
- Connection flow loop: **1200ms**
- Cross-step fade: **300ms**

All multiplied by `1 / speed`.

---

## 17. Zustand Store

```typescript
interface PlaybackStore {
  scenarioId: string | null;
  currentStepIndex: number;
  isPlaying: boolean;
  autoplay: boolean;
  speed: 0.5 | 1 | 2;
  elementStates: Record<string, ElementState>;
  connectionStates: Record<string, ConnectionState>;
  caption: string;

  // Actions
  selectScenario: (id: string) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  setSpeed: (s: 0.5 | 1 | 2) => void;
  toggleAutoplay: () => void;
}
```

Selectors required. **No prop drilling** — every component reads what it needs from the store.

---

## 18. Component Tree

```
App
├── Header
│   ├── Title
│   └── ScenarioSelector
├── Scene  (SVG root)
│   ├── ClusterFloor × 3
│   ├── AgentCard × N
│   ├── MCPNode × 2
│   ├── ConnectionLayer
│   ├── GovernanceGate (transient)
│   └── TraceMarker (transient)
└── Footer
    ├── CaptionPanel
    ├── PlaybackControls
    └── Legend
```

---

## 19. Interaction Flows

### 19.1 First load
- Base scene renders with all elements `idle`, all connections at 20% opacity.
- Header shows a tooltip: *"Pick a scenario to begin."*
- **Default state: paused.** No animation runs.

### 19.2 Selecting a scenario
- Scene resets to `idle`.
- Scenario title and emotion appear.
- **Does not autoplay** unless autoplay toggle is on.

### 19.3 Presenter workflow
- Presenter advances with `→` (Right Arrow) or the **Next** button.
- `←` steps backward.
- `Space` toggles play/pause.
- `R` restarts.
- `1`–`6` jump to scenarios.

### 19.4 During playback
- ⏸ pauses; current state holds.
- Clicking an agent shows tooltip with current state in this scenario; does not pause.

### 19.5 Scenario completion
- Final step holds 3× normal duration.
- "Replay" button appears.
- Trace marker remains until another scenario is selected.

---

## 20. File Structure

```
zta-viz/
├── index.html
├── package.json
├── tsconfig.json            # strict mode ON
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── DESIGN.md                # this document
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   ├── globals.css
    │   └── tokens.css         # CSS variables from §6
    ├── data/
    │   ├── agents.ts
    │   ├── mcps.ts
    │   ├── connections.ts
    │   └── scenarios/
    │       ├── types.ts
    │       ├── index.ts
    │       ├── s1-governed-autonomy.ts
    │       ├── s2-hijacked-agent.ts
    │       ├── s3-impostor-agent.ts
    │       ├── s4-overreaching-agent.ts
    │       ├── s5-wandering-agent.ts
    │       └── s6-unregistered-capability.ts
    ├── store/
    │   └── playback.ts
    ├── hooks/
    │   ├── useScenarioPlayer.ts
    │   ├── useKeyboardShortcuts.ts
    │   └── useElementState.ts
    ├── components/
    │   ├── scene/
    │   │   ├── Scene.tsx
    │   │   ├── ClusterFloor.tsx
    │   │   ├── AgentCard.tsx
    │   │   ├── MCPNode.tsx
    │   │   ├── ExternalInfra.tsx
    │   │   ├── ConnectionLayer.tsx
    │   │   ├── Connection.tsx
    │   │   ├── GovernanceGate.tsx
    │   │   └── TraceMarker.tsx
    │   ├── header/
    │   │   ├── Header.tsx
    │   │   └── ScenarioSelector.tsx
    │   ├── footer/
    │   │   ├── Footer.tsx
    │   │   ├── CaptionPanel.tsx
    │   │   ├── PlaybackControls.tsx
    │   │   └── Legend.tsx
    │   └── ui/
    │       ├── Pill.tsx
    │       └── Tooltip.tsx
    └── lib/
        ├── geometry.ts         # bezier path builder, iso projection
        └── colors.ts           # token re-exports for TS
```

---

## 21. Implementation Phases

Each phase ends with a commit on its own branch and an explicit acceptance check.

### Phase 1 — Static scene
- Vite + React + TS + Tailwind scaffolding.
- CSS tokens (§6) and Inter font.
- Render three `<ClusterFloor>` at coordinates from §8.
- Render all `<AgentCard>` and `<MCPNode>` at coordinates from §9.
- Render the permanent connection topology at 20% opacity (§10).
- Header with title; placeholder footer.

**Acceptance:**
- Screenshot at 1920×1080 matches the layout described.
- All 9 visible agents present with correct descriptions.
- Both MCPs visible.
- All connections from §10 rendered dashed.
- Zero TypeScript errors. Zero build warnings.

### Phase 2 — Animation primitives
- `<Connection>` flow animation (§16.1).
- `<GovernanceGate>` lifecycle component.
- Framer Motion variants on `<AgentCard>` (§16.2).
- A dev-only debug panel to manually trigger states.

**Acceptance:**
- Dev panel can set any agent to any of the 8 states.
- Connection flow animates correctly in all 4 states.
- A hardcoded gate appears, evaluates, resolves.

### Phase 3 — Playback engine
- Zustand store (§17).
- `useScenarioPlayer` hook.
- `<ScenarioSelector>`, `<PlaybackControls>`, `<CaptionPanel>`.
- `useKeyboardShortcuts` hook.
- **Implement S1 fully**.

**Acceptance:**
- S1 plays start to finish at 1× speed.
- All controls work (play, pause, next, prev, restart, speed).
- All keyboard shortcuts work.
- Step captions appear in sync.

### Phase 4 — Remaining scenarios
- Author S2–S6 step files.
- Dynamic-node logic for S3 (`rogue-process`) and S6 (`shadow-mcp`).
- Split-frame logic for S5.
- Special visual treatments per §15.

**Acceptance:**
- All 6 scenarios play through without errors.
- Each scenario's peak moment (§15) is visually unmistakable.

### Phase 5 — Polish
- `<Legend>` panel.
- Hover tooltips on agents and MCPs.
- Reduced motion toggle (`prefers-reduced-motion`).
- Focus states for accessibility.
- README with build/run/deploy instructions.

**Acceptance:**
- Demo runs offline.
- A non-developer can run it from the README alone.
- `pnpm build` produces a deployable `dist/`.

---

## 22. Accessibility

- Keyboard operable end-to-end (presenter mode is the primary input).
- Visible focus states on all interactive elements.
- Color contrast AA minimum.
- `prefers-reduced-motion` respected: animations shorten to a single state change.

---

## 23. Performance

- 60fps target on a modern laptop.
- SVG only — no WebGL, no Three.js.
- No runtime network requests.
- All assets bundled.

---

## 24. Code Generation Rules

These are inviolable.

- **Do not invent** colors, coordinates, agent names, scenario steps, or gate labels.
- **All values come from this document.**
- If something is ambiguous, **use the nearest defined value and add a `// ASSUMPTION:` comment in the code** explaining the choice.
- **TypeScript strict mode is mandatory.** No `any`. No `@ts-ignore`.
- **No `gpt-4.1-mini` or model badge** anywhere in the UI.
- All connections are **dashed**, always.

---

## 25. Definition of Done

- [ ] All 6 scenarios play correctly.
- [ ] Presenter mode (keyboard navigation) works.
- [ ] Keyboard shortcuts: `←` `→` `Space` `R` `1`–`6`.
- [ ] Offline-capable (no runtime network).
- [ ] TypeScript strict, zero errors.
- [ ] All 9 visible agents render with correct descriptions; 2 hidden agents stay out of the scene.
- [ ] No model badges anywhere.
- [ ] Visual style matches §5 and §6.
- [ ] `pnpm build` produces a clean `dist/` deployable to a static host.
- [ ] README sufficient for a non-developer to run.
- [ ] Suitable for live TM Forum demonstration.

---

## 26. Future Enhancements (out of scope)

- Live data binding to kagent API.
- Audio narration per scenario.
- Export each scenario as MP4 / GIF.
- Compare two scenarios side-by-side.
- Free-explore mode (manual gate triggering).
- Embed/iframe mode for slide decks.

---

## 27. References

- TM Forum Moonshot Catalyst C26.0.933 — *Zero-Trust Agents for Autonomous Networks*
- `ZTA-ScenarioFlows-v0_4.pdf` — source of truth for scenario semantics and color legend
- kagent dashboard screenshot — source of truth for palette and typography

---

*End of design specification.*
