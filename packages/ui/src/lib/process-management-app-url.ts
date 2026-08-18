export const IGRP_PROCESS_MANAGEMENT_PAGES = [
  "my-tasks",
  "available-tasks",
  "process-map",
] as const;

export type IGRPProcessManagementPage =
  (typeof IGRP_PROCESS_MANAGEMENT_PAGES)[number];

/**
 * Base URL da app Process Management (UI), não da API.
 *
 * Aceita o valor limpo (`https://host/apps/igrp-process-management`) ou o
 * legado com uma página no fim (`.../my-tasks`, `.../available-tasks`).
 */
export function resolveProcessManagementAppBase(raw?: string): string {
  let value = String(raw ?? "")
    .trim()
    .replace(/\/+$/, "");
  if (!value) return "";
  for (const page of IGRP_PROCESS_MANAGEMENT_PAGES) {
    const suffix = `/${page}`;
    if (value.endsWith(suffix)) {
      return value.slice(0, -suffix.length);
    }
  }
  return value;
}

/** `{base}/{page}` — `my-tasks`, `available-tasks` ou `process-map`. */
export function processManagementAppHref(
  page: IGRPProcessManagementPage,
  rawBase?: string,
): string {
  const base = resolveProcessManagementAppBase(rawBase);
  if (!base) return "";
  return `${base}/${page}`;
}

export function processManagementAppUrls(rawBase?: string) {
  return {
    myTasksUrl: processManagementAppHref("my-tasks", rawBase),
    availableTasksUrl: processManagementAppHref("available-tasks", rawBase),
    processMapUrl: processManagementAppHref("process-map", rawBase),
  };
}
