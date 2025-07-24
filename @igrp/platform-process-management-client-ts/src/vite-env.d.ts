/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PROCESSES_ENDPOINT: string;
  readonly VITE_PROCESS_START_ENDPOINT: string;
  readonly VITE_TASKS_ENDPOINT: string;
  readonly VITE_TASKS_CLAIM_ENDPOINT: string;
  readonly VITE_TASKS_RELEASE_ENDPOINT: string;
  readonly VITE_TASKS_COMPLETE_ENDPOINT: string;
  readonly VITE_AREAS_ENDPOINT: string;
  readonly VITE_AREA_PROJECTS_ENDPOINT: string;
  readonly VITE_PROJECTS_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}