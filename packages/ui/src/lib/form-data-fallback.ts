import type {
  IGRPGetFormDataForTaskOptions,
  IGRPFormEntry,
} from "../types";

/**
 * Decide se a chamada de `getFormDataForTask` deve cair no histórico
 * ou devolver os dados do step actual.
 *
 * Função puramente mecânica — não tem qualquer regra de negócio. O
 * consumidor é responsável por decidir QUANDO activar o fallback
 * (ex.: `fallbackToHistory: isRectifyingCycle(variables)`).
 *
 * Regra: se `opts.fallbackToHistory === true` E o step actual está
 * vazio (undefined / null / array vazio), invoca `historyLoader()`.
 * Caso contrário, devolve `current`.
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

  return historyLoader();
}
