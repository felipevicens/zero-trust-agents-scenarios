import { useCallback, useMemo, useState } from "react";
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
import { DynamicNode } from "./DynamicNode";
import { Legend } from "./Legend";
import { DevPanel } from "../debug/DevPanel";
import { usePlaybackStore } from "../../store/playback";
import { bezierPath } from "../../lib/geometry";
import type { AgentState } from "../../data/agents";
import type { ConnectionState } from "../../store/playback";

const CLUSTERS = [
  { name: "tools",      cx: 290,  cy: 450, width: 400, height: 312 },
  { name: "datacenter", cx: 800,  cy: 450, width: 480, height: 396 },
  { name: "monitoring", cx: 1310, cy: 450, width: 400, height: 312 },
] as const;

// Scene logical center
const CX = 800;
const CY = 450;
const BASE_W = 1600;
const BASE_H = 900;
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1.0;

function DotGrid() {
  return (
    <>
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.06" />
        </pattern>
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

function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const btnBase: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "14px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background 0.15s, color 0.15s",
    padding: 0,
    flexShrink: 0,
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        right: "12px",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "2px",
        background: "rgba(10,10,20,0.82)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "3px 4px",
        backdropFilter: "blur(6px)",
      }}
    >
      <button
        style={btnBase}
        onClick={onZoomOut}
        disabled={zoom <= ZOOM_MIN}
        title="Zoom out"
      >
        −
      </button>

      <button
        style={{
          ...btnBase,
          width: "48px",
          fontSize: "11px",
          color: zoom !== ZOOM_DEFAULT ? "var(--kagent-purple-glow)" : "var(--text-muted)",
        }}
        onClick={onReset}
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        style={btnBase}
        onClick={onZoomIn}
        disabled={zoom >= ZOOM_MAX}
        title="Zoom in"
      >
        +
      </button>
    </div>
  );
}

export function Scene() {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);

  const agentStates = usePlaybackStore((s) => s.agentStates);
  const connectionStates = usePlaybackStore((s) => s.connectionStates);
  const gates = usePlaybackStore((s) => s.gates);
  const traceText = usePlaybackStore((s) => s.traceText);
  const dynamicNodes = usePlaybackStore((s) => s.dynamicNodes);
  const adversarialLineSpec = usePlaybackStore((s) => s.adversarialLine);
  const gateCompleted = usePlaybackStore((s) => s.gateCompleted);
  const speed = usePlaybackStore((s) => s.speed);

  // Compute the SVG path for the adversarial attempt line from node IDs → positions
  const adversarialLinePath = useMemo(() => {
    if (!adversarialLineSpec) return null;
    const getPos = (id: string) => {
      const agent = VISIBLE_AGENTS.find((a) => a.id === id);
      if (agent) return agent.position;
      const mcp = MCPS.find((m) => m.id === id);
      if (mcp) return mcp.position;
      const dn = dynamicNodes[id];
      if (dn) return { x: dn.x, y: dn.y };
      return null;
    };
    const from = getPos(adversarialLineSpec.from);
    const to = getPos(adversarialLineSpec.to);
    if (!from || !to) return null;
    return bezierPath(from, to, 90);
  }, [adversarialLineSpec, dynamicNodes]);

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2)))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2)))), []);
  const zoomReset = useCallback(() => setZoom(ZOOM_DEFAULT), []);

  // Zoom by shrinking the viewBox around the scene center
  const vbW = BASE_W / zoom;
  const vbH = BASE_H / zoom;
  const vbX = CX - vbW / 2;
  const vbY = CY - vbH / 2;
  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const handleDevAgentState = useCallback((agentId: string, state: AgentState) => {
    usePlaybackStore.setState((s) => ({
      agentStates: { ...s.agentStates, [agentId]: state },
    }));
  }, []);

  const handleDevConnectionState = useCallback((connId: string, state: ConnectionState) => {
    usePlaybackStore.setState((s) => ({
      connectionStates: { ...s.connectionStates, [connId]: state },
    }));
  }, []);

  const handleDevTriggerGate = useCallback(
    (kind: string, position: { x: number; y: number }, result: "pass" | "fail") => {
      usePlaybackStore.setState((s) => {
        const id = s.gateIdCounter + 1;
        return {
          gateIdCounter: id,
          gates: [...s.gates, { id, kind, position, result }],
        };
      });
    },
    [],
  );

  const handleDevTrace = useCallback((text: string | null) => {
    usePlaybackStore.setState({ traceText: text });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <HoverProvider>
        <svg
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="#0a0a14" />
          <DotGrid />

          {CLUSTERS.map((c) => (
            <ClusterFloor key={c.name} name={c.name} cx={c.cx} cy={c.cy} width={c.width} height={c.height} />
          ))}

          <ConnectionLayer connectionStates={connectionStates} />

          {/* Adversarial attempt line — orange on probe, red when gate fails or blocked */}
          {adversarialLinePath && (
            <path
              d={adversarialLinePath}
              fill="none"
              strokeWidth={2}
              opacity={0.8}
              className={
                adversarialLineSpec?.color === "red"
                  ? "connection connection--flowing connection--blocked"
                  : "connection connection--flowing connection--adversarial"
              }
            />
          )}

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

          <AnimatePresence>
            {Object.values(dynamicNodes).map((spec) => (
              <DynamicNode
                key={spec.id}
                spec={spec}
                state={agentStates[spec.id] ?? "adversarial"}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {gates.map((g) => (
              <GovernanceGate
                key={g.id}
                kind={g.kind}
                position={g.position}
                result={g.result}
                onDone={() => gateCompleted(g.id)}
                speed={speed}
              />
            ))}
          </AnimatePresence>

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

      <ZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={zoomReset}
      />

      <Legend />

      {import.meta.env.DEV && (
        <DevPanel
          agentStates={agentStates}
          onAgentState={handleDevAgentState}
          connectionStates={connectionStates}
          onConnectionState={handleDevConnectionState}
          onTriggerGate={handleDevTriggerGate}
          onTrace={handleDevTrace}
        />
      )}
    </div>
  );
}
