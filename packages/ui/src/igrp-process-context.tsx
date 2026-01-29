"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useIGRPProcess } from "./use-igrp-process";
import type {
  IGRPProcessClientConfig,
  IGRPResolveStepComponent,
  IGRPStepConfigParams,
} from "./types";

export type IGRPProcessContextValue = ReturnType<typeof useIGRPProcess> & {
  /** Resolve step component (e.g. dynamic import in app). Required to render steps. */
  resolveStepComponent?: IGRPResolveStepComponent | null;
};

const IGRPProcessContext = createContext<IGRPProcessContextValue | null>(null);

interface IGRPProcessProviderProps {
  children: ReactNode;
  params: IGRPStepConfigParams;
  config: IGRPProcessClientConfig;
  /** Resolve step component. App does dynamic import with static prefix (e.g. `import(\`@/app/steps/${processKey}/${version}/${userTaskKey}\`)`). */
  resolveStepComponent?: IGRPResolveStepComponent | null;
}

/**
 * Provider component that wraps the process context and makes it available to all children
 */
export function IGRPProcessProvider({
  children,
  params,
  config,
  resolveStepComponent = null,
}: IGRPProcessProviderProps) {
  const processContext = useIGRPProcess(params, config);

  return (
    <IGRPProcessContext.Provider
      value={{ ...processContext, resolveStepComponent }}
    >
      {children}
    </IGRPProcessContext.Provider>
  );
}

/**
 * Hook to access the IGRP Process context
 * Must be used within an IGRPProcessProvider
 */
export function useIGRPProcessContext(): IGRPProcessContextValue {
  const context = useContext(IGRPProcessContext);

  if (!context) {
    throw new Error(
      "useIGRPProcessContext must be used within an IGRPProcessProvider",
    );
  }

  return context;
}
