// Types
export * from "./types";

// Process actions (server actions – ficheiro tem "use server")
export {
  fetchStepConfig,
  callCompleteTask,
  callSaveTask,
} from "./process-actions";

// Context & hook
export {
  IGRPProcessProvider,
  useIGRPProcessContext,
} from "./igrp-process-context";
export type { IGRPProcessContextValue } from "./igrp-process-context";

// Hook
export { useIGRPProcess } from "./use-igrp-process";

// Components
export { IGRPProcessPage } from "./process-page";
export { IGRPProcessPageRenderer } from "./process-page-renderer";
export { IGRPConfirmationDialog } from "./components/igrp-confirmation-dialog";
export type { IGRPConfirmationDialogProps } from "./components/igrp-confirmation-dialog";
