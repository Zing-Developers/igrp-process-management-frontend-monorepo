// Types
export * from "./types";

// Form key / discovery helpers (ui:shared:* vs ui:form:*)
export {
  DEFAULT_FORM_KEY,
  formFromFormKey,
  getFormDiscovery,
  getFormKeyType,
  getKeyFromFormKey,
  getNameFromFormKey,
  getNormalizeClassNameFromFormKey,
  getNormalizedFormKey,
  getVersionFromFormKey,
  isFormFormKey,
  isSharedFormKey,
  isVersionFolderName,
} from "./lib/form-key-utils";
export type {
  FormKeyType,
  IGRPFormDiscovery,
} from "./lib/form-key-utils";

export {
  isProcessInstanceUuid,
  resolveProcessInstance,
} from "./lib/resolve-process-instance";

// Return URL após completar tarefa (origem do link / config runtime)
export {
  IGRP_RETURN_URL_PARAM,
  isExternalReturnUrl,
  resolveTaskReturnTarget,
} from "./lib/task-return-url";
export type { IGRPTaskReturnTarget } from "./lib/task-return-url";

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
