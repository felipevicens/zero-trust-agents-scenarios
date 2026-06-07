export type StepKind =
  | "agent-action"
  | "gate"
  | "permitted"
  | "blocked"
  | "adversarial"
  | "trace";

export interface ScenarioStep {
  id: string;
  kind: StepKind;
  actor?: string;
  target?: string;
  caption: string;
  gateLabel?: string;
  gateResult?: "pass" | "fail";
  durationMs?: number;
}

export interface Scenario {
  id: "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
  title: string;
  subtitle: string;
  emotion: string;
  takeaway: string;
  steps: ScenarioStep[];
}
