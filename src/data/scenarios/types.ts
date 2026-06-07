export type StepKind =
  | "agent-action"
  | "gate"
  | "permitted"
  | "blocked"
  | "adversarial"
  | "trace";

export interface DynamicNodeSpec {
  id: string;
  x: number;
  y: number;
  type: "rogue-process" | "shadow-mcp";
  label: string;
}

export interface ScenarioStep {
  id: string;
  kind: StepKind;
  actor?: string;
  target?: string;
  caption: string;
  gateLabel?: string;
  gateResult?: "pass" | "fail";
  durationMs?: number;
  /** Materialize a dynamic node (S3 rogue-process, S6 shadow-mcp) when this step runs */
  dynamicNode?: DynamicNodeSpec;
  /** Override the auto-computed gate diamond position (for non-cluster actors) */
  gatePositionOverride?: { x: number; y: number };
  /** On trace steps: explicitly clear the adversarial attempt line (default: keep it) */
  clearAdversarialLine?: true;
}

export interface Scenario {
  id: "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
  title: string;
  subtitle: string;
  emotion: string;
  takeaway: string;
  steps: ScenarioStep[];
}
