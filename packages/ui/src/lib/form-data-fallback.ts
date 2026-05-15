import type {
  IGRPGetFormDataForTaskOptions,
  IGRPFormEntry,
  IGRPProcessVariable,
} from "../types";

/**
 * Decide se a chamada de `getFormDataForTask` deve cair no histórico
 * (RECTIFICAR cycle) ou devolver os dados do step actual.
 *
 * Função pura — toda a lógica de fallback vive aqui para ser fácil
 * de testar sem React.
 *
 * @param current dados do step actual (lidos da variável `${userTaskInstanceId}_forms`)
 * @param opts opções da chamada — ver `IGRPGetFormDataForTaskOptions`
 * @param historyLoader callback que vai buscar dados do histórico para
 *   a task actual (`getFormDataByTaskKey(userTaskKey)`). Só é invocado
 *   quando o fallback dispara.
 */
export function resolveFormDataForTask(
  current: Array<IGRPFormEntry> | undefined,
  opts: IGRPGetFormDataForTaskOptions | undefined,
  historyLoader: () => Array<IGRPFormEntry> | undefined,
): Array<IGRPFormEntry> | undefined {
  const isEmpty =
    current === undefined ||
    current === null ||
    (Array.isArray(current) && current.length === 0);

  if (!opts?.fallbackToHistory || !isEmpty) {
    return current;
  }

  if (opts.variables) {
    const decision = opts.variables.find(
      (v: IGRPProcessVariable) => v.name === "decision",
    )?.value;
    const decisionUpper =
      typeof decision === "string" ? decision.toUpperCase() : "";
    if (decisionUpper !== "RECTIFICAR" && decisionUpper !== "RETIFICAR") {
      return current;
    }
  }

  return historyLoader();
}
