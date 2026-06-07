import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface HoverContextValue {
  hoveredAgentId: string | null;
  setHoveredAgentId: (id: string | null) => void;
}

const HoverContext = createContext<HoverContextValue>({
  hoveredAgentId: null,
  setHoveredAgentId: () => undefined,
});

export function HoverProvider({ children }: { children: ReactNode }) {
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  return (
    <HoverContext.Provider value={{ hoveredAgentId, setHoveredAgentId }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  return useContext(HoverContext);
}
