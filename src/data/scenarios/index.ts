import { s1 } from "./s1-governed-autonomy";
import { s2 } from "./s2-hijacked-agent";
import { s3 } from "./s3-impostor-agent";
import { s4 } from "./s4-overreaching-agent";
import { s5 } from "./s5-wandering-agent";
import { s6 } from "./s6-unregistered-capability";
import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [s1, s2, s3, s4, s5, s6];

export const SCENARIOS_MAP: Partial<Record<Scenario["id"], Scenario>> = {
  S1: s1,
  S2: s2,
  S3: s3,
  S4: s4,
  S5: s5,
  S6: s6,
};
