import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { VISIBLE_AGENTS } from "../../data/agents";
import { MCPS } from "../../data/mcps";
import { ClusterFloor } from "./ClusterFloor";
import { AgentCard } from "./AgentCard";
import { MCPNode } from "./MCPNode";
import { ConnectionLayer } from "./ConnectionLayer";
import { HoverProvider } from "./HoverContext";
import { GovernanceGate } from "./GovernanceGate";
import { TraceMarker } from "./TraceMarker";
import { DevPanel } from "../debug/DevPanel";
import type { AgentState } from "../../data/agents";
import type { ConnectionState } from "./Connection";

// ASSUMPTION: Floor sizes enlarged from spec §8 (320×180) per user request.
// Floor cx/positions shifted ±60px outward from spec to increase cluster separation.
const CLUSTERS = [
  { name: "tools",      cx: 290,  cy: 450, width: 400, height: 312 },
  { name: "datacenter", cx: 800,  cy: 450, width: 480, height: 396 },
  { name: "monitoring", cx: 1310, cy: 450, width: 400, height: 312 },
] as const;

interface GateState {
  id: number;
  kind: string;
  position: { x: number; y: number };
  result: "pass" | "fail";
}

function DotGrid() {
  return (
    <>
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.06" />
        </pattern>
        {/* Glow filter for connection endpoint dots */}
        <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#dot-grid)" />
    </>
  );
}

export function Scene() {
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const [connectionStates, setConnectionStates] = useState<Record<string, ConnectionState>>({});
  const [gates, setGates] = useState<GateState[]>([]);
  const gateIdRef = useRef(0);
  const [traceText, setTraceText] = useState<string | null>(null);

  const handleAgentState = useCallback((agentId: string, state: AgentState) => {
    setAgentStates((prev) => ({ ...prev, [agentId]: state }));
  }, []);

  const handleConnectionState = useCallback((connId: string, state: ConnectionState) => {
    setConnectionStates((prev) => ({ ...prev, [connId]: state }));
  }, []);

  const handleTriggerGate = useCallback(
    (kind: string, position: { x: number; y: number }, result: "pass" | "fail") => {
      const id = ++gateIdRef.current;
      setGates((prev) => [...prev, { id, kind, position, result }]);
    },
    [],
  );

  const handleGateDone = useCallback((id: number) => {
    setGates((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <HoverProvider>
        <svg
          viewBox="0 0 1600 900"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <rect width="1600" height="900" fill="#0a0a14" />
          <DotGrid />

          {CLUSTERS.map((c) => (
            <ClusterFloor key={c.name} name={c.name} cx={c.cx} cy={c.cy} width={c.width} height={c.height} />
          ))}

          <ConnectionLayer connectionStates={connectionStates} />

          {VISIBLE_AGENTS.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              state={agentStates[agent.id] ?? "idle"}
            />
          ))}

          {MCPS.map((mcp) => (
            <MCPNode key={mcp.id} mcp={mcp} />
          ))}

          {/* Transient governance gates — topmost layer */}
          <AnimatePresence>
            {gates.map((g) => (
              <GovernanceGate
                key={g.id}
                kind={g.kind}
                position={g.position}
                result={g.result}
                onDone={() => handleGateDone(g.id)}
              />
            ))}
          </AnimatePresence>

          {/* Trace marker */}
          <AnimatePresence>
            {traceText && (
              <TraceMarker
                key={traceText}
                text={traceText}
                position={{ x: 800, y: 840 }}
              />
            )}
          </AnimatePresence>
        </svg>
      </HoverProvider>

      {import.meta.env.DEV && (
        <DevPanel
          agentStates={agentStates}
          onAgentState={handleAgentState}
          connectionStates={connectionStates}
          onConnectionState={handleConnectionState}
          onTriggerGate={handleTriggerGate}
          onTrace={setTraceText}
        />
      )}
    </div>
  );
}
