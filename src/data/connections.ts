export interface Connection {
  id: string;
  from: string;
  to: string;
}

export const CONNECTIONS: Connection[] = [
  { id: "slo-cladra",      from: "slo-agent",             to: "cladra-agent" },
  { id: "policy-cladra",   from: "policy-mcp",            to: "cladra-agent" },
  { id: "itsm-cladra",     from: "itsm-mcp",              to: "cladra-agent" },
  { id: "cladra-ran",      from: "cladra-agent",          to: "ran-diagnostic-agent" },
  { id: "cladra-core",     from: "cladra-agent",          to: "core-diagnostic-agent" },
  { id: "cladra-act",      from: "cladra-agent",          to: "act-agent" },
  { id: "cladra-reporting", from: "cladra-agent",         to: "reporting-agent" },
  { id: "core-mcp-core",   from: "core-mcp",              to: "core-diagnostic-agent" },
  { id: "ran-mcp-ran",     from: "ran-mcp",               to: "ran-diagnostic-agent" },
  { id: "mcp-slo",         from: "monitoring-mcp",        to: "slo-agent" },
];
