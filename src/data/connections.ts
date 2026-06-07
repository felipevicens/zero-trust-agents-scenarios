export interface Connection {
  id: string;
  from: string;
  to: string;
}

export const CONNECTIONS: Connection[] = [
  { id: "slo-cladra",         from: "slo-agent",          to: "cladra-agent" },
  { id: "pred-cladra",        from: "prediction-agent",   to: "cladra-agent" },
  { id: "policy-cladra",      from: "policy-mcp",         to: "cladra-agent" },
  { id: "cladra-ran",         from: "cladra-agent",       to: "ran-diagnostic-agent" },
  { id: "cladra-core",        from: "cladra-agent",       to: "core-diagnostic-agent" },
  { id: "cladra-capability",  from: "cladra-agent",       to: "capability-agent" },
  { id: "cladra-decision",    from: "cladra-agent",       to: "decision-agent" },
  { id: "cladra-act",         from: "cladra-agent",       to: "act-agent" },
  { id: "cladra-reporting",   from: "cladra-agent",       to: "reporting-agent" },
  { id: "mcp-prediction",     from: "monitoring-mcp",     to: "prediction-agent" },
  { id: "mcp-slo",            from: "monitoring-mcp",     to: "slo-agent" },
];
