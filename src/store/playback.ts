import { create } from "zustand";
import type { AgentState } from "../data/agents";
import { AGENTS } from "../data/agents";
import { CONNECTIONS } from "../data/connections";
import { SCENARIOS_MAP } from "../data/scenarios";
import type { DynamicNodeSpec, Scenario, ScenarioStep } from "../data/scenarios/types";

export type ConnectionState = "inactive" | "flowing-permitted" | "flowing-blocked" | "adversarial";

export interface AdversarialLine {
  from: string;
  to: string;
  color: "orange" | "red";
}

export interface GateInstance {
  id: number;
  kind: string;
  position: { x: number; y: number };
  result: "pass" | "fail";
  actorId?: string;
}

const GATE_POSITIONS = {
  tools:      { x: 314,  y: 155 },
  datacenter: { x: 824,  y: 120 },
  monitoring: { x: 1334, y: 155 },
} as const;

function getGatePosition(
  actorId: string,
  override?: { x: number; y: number },
  dynamicNodes?: Record<string, DynamicNodeSpec>,
): { x: number; y: number } {
  if (override) return override;
  const agent = AGENTS.find((a) => a.id === actorId);
  if (agent) return GATE_POSITIONS[agent.cluster];
  if (dynamicNodes?.[actorId]) {
    const n = dynamicNodes[actorId];
    return { x: n.x, y: n.y - 80 };
  }
  return GATE_POSITIONS.datacenter;
}

function findConnectionId(from: string, to: string): string | undefined {
  return CONNECTIONS.find(
    (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from),
  )?.id;
}

interface VisualState {
  agentStates: Record<string, AgentState>;
  connectionStates: Record<string, ConnectionState>;
  gates: GateInstance[];
  gateIdCounter: number;
  traceText: string | null;
  dynamicNodes: Record<string, DynamicNodeSpec>;
  adversarialLine: AdversarialLine | null;
}

function applyStep(step: ScenarioStep, vs: VisualState): VisualState {
  const agentStates = { ...vs.agentStates };
  const connectionStates = { ...vs.connectionStates };
  const gates = [...vs.gates];
  let gateIdCounter = vs.gateIdCounter;
  let traceText = vs.traceText;
  const dynamicNodes = { ...vs.dynamicNodes };
  let adversarialLine = vs.adversarialLine;

  // Materialize dynamic node (S3 rogue-process, S6 shadow-mcp)
  if (step.dynamicNode) {
    dynamicNodes[step.dynamicNode.id] = step.dynamicNode;
  }

  switch (step.kind) {
    case "agent-action":
      if (step.actor) {
        agentStates[step.actor] = "active";
        if (step.target) {
          agentStates[step.target] = "active";
          const connId = findConnectionId(step.actor, step.target);
          if (connId) connectionStates[connId] = "flowing-permitted";
        }
      }
      break;

    case "gate":
      if (step.actor) {
        agentStates[step.actor] = "gate";
        gateIdCounter += 1;
        gates.push({
          id: gateIdCounter,
          kind: step.gateLabel ?? "Access check",
          position: getGatePosition(step.actor, step.gatePositionOverride, dynamicNodes),
          result: step.gateResult ?? "pass",
          actorId: step.actor,
        });
        // Turn the adversarial attempt line red on a failed gate, clear on a pass
        if (adversarialLine?.from === step.actor) {
          adversarialLine = step.gateResult === "fail"
            ? { ...adversarialLine, color: "red" }
            : null;
        }
      }
      break;

    case "permitted":
      if (step.actor) {
        agentStates[step.actor] = "passed";
        if (adversarialLine?.from === step.actor) adversarialLine = null;
      }
      break;

    case "blocked":
      if (step.actor) {
        agentStates[step.actor] = "blocked";
        for (const conn of CONNECTIONS) {
          if (conn.to === step.actor && connectionStates[conn.id] === "flowing-permitted") {
            connectionStates[conn.id] = "flowing-blocked";
          }
        }
        // adversarialLine stays red — it was already turned red at the gate step
      }
      break;

    case "adversarial":
      if (step.actor) {
        agentStates[step.actor] = "adversarial";
        // Start a new orange attempt line when a target is specified
        if (step.target) {
          adversarialLine = { from: step.actor, to: step.target, color: "orange" };
        }
      }
      break;

    case "trace":
      traceText = step.caption;
      if (step.clearAdversarialLine) adversarialLine = null;
      // Wrap up any still-active agents to "passed" for the happy-path final frame;
      // adversarial scenarios will keep blocked/adversarial states as-is.
      for (const id of Object.keys(agentStates)) {
        if (agentStates[id] === "active" || agentStates[id] === "gate") {
          agentStates[id] = "passed";
        }
      }
      break;
  }

  return { agentStates, connectionStates, gates, gateIdCounter, traceText, dynamicNodes, adversarialLine };
}

// Replay steps 0..upToIndex to reconstruct visual state for prev()
function buildVisualFromSteps(scenario: Scenario, upToIndex: number): VisualState {
  let vs: VisualState = {
    agentStates: {},
    connectionStates: {},
    gates: [],
    gateIdCounter: 0,
    traceText: null,
    dynamicNodes: {},
    adversarialLine: null,
  };
  for (let i = 0; i <= upToIndex; i++) {
    vs = applyStep(scenario.steps[i], vs);
  }
  // Don't replay gate animations when rebuilding history
  vs.gates = [];
  return vs;
}

export interface PlaybackStore {
  scenarioId: Scenario["id"] | null;
  currentStepIndex: number;  // -1 = scenario selected, not yet started
  isPlaying: boolean;
  speed: 0.5 | 1 | 2;
  autoplay: boolean;
  presenterMode: boolean;
  agentStates: Record<string, AgentState>;
  connectionStates: Record<string, ConnectionState>;
  gates: GateInstance[];
  gateIdCounter: number;
  traceText: string | null;
  dynamicNodes: Record<string, DynamicNodeSpec>;
  adversarialLine: AdversarialLine | null;
  caption: string;

  selectScenario: (id: Scenario["id"]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  setSpeed: (s: 0.5 | 1 | 2) => void;
  gateCompleted: (id: number) => void;
  toggleAutoplay: () => void;
  togglePresenterMode: () => void;
}

const _defaultScenario = SCENARIOS_MAP["S1"];

export const usePlaybackStore = create<PlaybackStore>()((set, get) => ({
  scenarioId: "S1",
  currentStepIndex: -1,
  isPlaying: false,
  speed: 1,
  autoplay: false,
  presenterMode: false,
  agentStates: {},
  connectionStates: {},
  gates: [],
  gateIdCounter: 0,
  traceText: null,
  dynamicNodes: {},
  adversarialLine: null,
  caption: _defaultScenario?.subtitle ?? "Press → to begin.",

  selectScenario: (id) => {
    const scenario = SCENARIOS_MAP[id];
    const { autoplay } = get();
    set({
      scenarioId: id,
      currentStepIndex: -1,
      isPlaying: autoplay,
      agentStates: {},
      connectionStates: {},
      gates: [],
      gateIdCounter: 0,
      traceText: null,
      dynamicNodes: {},
      adversarialLine: null,
      caption: scenario?.subtitle ?? "Press → to begin.",
    });
  },

  play: () => {
    const { scenarioId, currentStepIndex } = get();
    if (!scenarioId) return;
    const scenario = SCENARIOS_MAP[scenarioId];
    if (!scenario) return;
    if (currentStepIndex >= scenario.steps.length - 1) return;
    set({ isPlaying: true });
  },

  pause: () => set({ isPlaying: false }),

  next: () => {
    const state = get();
    const { scenarioId, currentStepIndex } = state;
    if (!scenarioId) return;
    const scenario = SCENARIOS_MAP[scenarioId];
    if (!scenario) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= scenario.steps.length) {
      set({ isPlaying: false });
      return;
    }

    const step = scenario.steps[nextIndex];
    const newVS = applyStep(step, {
      agentStates: { ...state.agentStates },
      connectionStates: { ...state.connectionStates },
      gates: [...state.gates],
      gateIdCounter: state.gateIdCounter,
      traceText: state.traceText,
      dynamicNodes: { ...state.dynamicNodes },
      adversarialLine: state.adversarialLine,
    });

    set({
      currentStepIndex: nextIndex,
      caption: step.caption,
      agentStates: newVS.agentStates,
      connectionStates: newVS.connectionStates,
      gates: newVS.gates,
      gateIdCounter: newVS.gateIdCounter,
      traceText: newVS.traceText,
      dynamicNodes: newVS.dynamicNodes,
      adversarialLine: newVS.adversarialLine,
    });
  },

  prev: () => {
    const { scenarioId, currentStepIndex } = get();
    if (!scenarioId) return;
    const scenario = SCENARIOS_MAP[scenarioId];
    if (!scenario) return;

    if (currentStepIndex <= 0) {
      set({
        currentStepIndex: -1,
        agentStates: {},
        connectionStates: {},
        gates: [],
        traceText: null,
        adversarialLine: null,
        caption: scenario.subtitle,
        isPlaying: false,
      });
      return;
    }

    const targetIndex = currentStepIndex - 1;
    const newVS = buildVisualFromSteps(scenario, targetIndex);

    set({
      currentStepIndex: targetIndex,
      caption: scenario.steps[targetIndex].caption,
      agentStates: newVS.agentStates,
      connectionStates: newVS.connectionStates,
      gates: [],
      gateIdCounter: newVS.gateIdCounter,
      traceText: newVS.traceText,
      dynamicNodes: newVS.dynamicNodes,
      adversarialLine: newVS.adversarialLine,
      isPlaying: false,
    });
  },

  restart: () => {
    const { scenarioId } = get();
    const scenario = scenarioId ? SCENARIOS_MAP[scenarioId] : null;
    set({
      currentStepIndex: -1,
      agentStates: {},
      connectionStates: {},
      gates: [],
      gateIdCounter: 0,
      traceText: null,
      dynamicNodes: {},
      adversarialLine: null,
      caption: scenario?.subtitle ?? _defaultScenario?.subtitle ?? "Press → to begin.",
      isPlaying: false,
    });
  },

  setSpeed: (s) => set({ speed: s }),

  toggleAutoplay: () => set((s) => ({ autoplay: !s.autoplay })),
  togglePresenterMode: () => set((s) => ({ presenterMode: !s.presenterMode })),

  gateCompleted: (id) => {
    const gate = get().gates.find((g) => g.id === id);
    set((state) => {
      const newGates = state.gates.filter((g) => g.id !== id);
      if (!gate?.actorId) return { gates: newGates };
      // Auto-transition actor after gate animation: pass → active, fail → blocked
      const nextAgentState: AgentState = gate.result === "pass" ? "active" : "blocked";
      return {
        gates: newGates,
        agentStates: { ...state.agentStates, [gate.actorId]: nextAgentState },
      };
    });
  },
}));
