import type {
  IGRPGetFormDataForTaskOptions,
  IGRPFormEntry,
} from "../types";

/**
 * Decide se a chamada de `getFormDataForTask` deve cair no histórico
 * ou devolver os dados do step actual.
 *
 * Função puramente mecânica — não tem qualquer regra de negócio. O
 * consumidor é responsável por decidir QUANDO activar o fallback, seja:
 *   - passando `true` (sempre que current está vazio), ou
 *   - passando uma predicate `(variables) => boolean` que decide com
 *     base nas variáveis BPMN do step actual (injectadas pelo hook).
 *
 * @param current dados do step actual (lidos da variável
 *   `${userTaskInstanceId}_forms`)
 * @param opts opções da chamada — ver `IGRPGetFormDataForTaskOptions`
 * @param variables variáveis BPMN do step actual (vindas do
 *   `stepConfig.variables`). Passadas à predicate quando
 *   `opts.fallbackToHistory` é uma função.
 * @param historyLoader callback que vai buscar dados do histórico para
 *   a task actual (`getFormDataByTaskKey(userTaskKey)`). Só é invocado
 *   quando o fallback dispara.
 */
export function resolveFormDataForTask(
  current: Array<IGRPFormEntry> | undefined,
  opts: IGRPGetFormDataForTaskOptions | undefined,
  variables: Array<IGRPFormEntry>,
  historyLoader: () => Array<IGRPFormEntry> | undefined,
): Array<IGRPFormEntry> | undefined {
  const isEmpty =
    current === undefined ||
    current === null ||
    (Array.isArray(current) && current.length === 0);

  if (!isEmpty) return current;

  const enabled =
    typeof opts?.fallbackToHistory === "function"
      ? opts.fallbackToHistory(variables)
      : opts?.fallbackToHistory === true;

  if (!enabled) return current;

  return historyLoader();
}
