// context/DynamicSidebarContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

interface DynamicSidebarContextProps {
  dynamicContent: React.ReactNode | null;
  setDynamicContent: (content: React.ReactNode | null) => void;
}

const DynamicSidebarContext = createContext<DynamicSidebarContextProps>({
  dynamicContent: null,
  setDynamicContent: () => {},
});

export function DynamicSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dynamicContent, setDynamicContent] = useState<React.ReactNode | null>(null);
  return (
    <DynamicSidebarContext.Provider value={{ dynamicContent, setDynamicContent }}>
      {children}
    </DynamicSidebarContext.Provider>
  );
}

export function useDynamicSidebar() {
  return useContext(DynamicSidebarContext);
}
