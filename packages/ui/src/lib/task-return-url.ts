/**
 * Resolve para onde o utilizador volta depois de completar uma tarefa
 * (botão "Voltar" do popup de sucesso).
 *
 * Ordem de resolução:
 *
 * 1. `?returnUrl=` no URL actual — declarado por quem abriu a tarefa
 *    (my-tasks, task-management, process-map, ou uma página do projecto de
 *    origem). É a única fonte que sabe exactamente de onde o utilizador veio.
 * 2. `config.taskReturnUrl` — a app lê `IGRP_APP_PAGE_TASK` no servidor (por
 *    request) e passa ao `IGRPProcessProvider`.
 * 3. History back, quando existe entrada anterior no browser.
 * 4. `/`.
 *
 * A lib não lê env directamente: `IGRP_APP_PAGE_TASK` não tem prefixo
 * `NEXT_PUBLIC_` e por isso não existe no bundle do browser. É esse o ponto —
 * `NEXT_PUBLIC_*` é inlined no `next build`, logo um valor definido só no
 * cluster (env do K8s) nunca chegava ao cliente.
 */

/** Query param usado para declarar a página de origem. */
export const IGRP_RETURN_URL_PARAM = "returnUrl";

export type IGRPTaskReturnTarget =
  | { kind: "url"; href: string }
  | { kind: "history-back" };

/**
 * Aceita apenas paths relativos ao app (`/algo`) ou URLs http(s) absolutos.
 * Protege contra `javascript:`, `data:` e protocol-relative (`//host`).
 */
function sanitizeReturnUrl(candidate?: string | null): string | null {
  const value = candidate?.trim();
  if (!value) return null;

  if (value.startsWith("//")) return null;
  if (value.startsWith("/")) return value;

  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveTaskReturnTarget({
  configuredUrl,
  search = "",
  canGoBack = false,
}: {
  /** `config.taskReturnUrl` do provider (`IGRP_APP_PAGE_TASK` em runtime). */
  configuredUrl?: string | null;
  /** `window.location.search` da página da tarefa. */
  search?: string;
  /** Existe entrada anterior no history do browser. */
  canGoBack?: boolean;
}): IGRPTaskReturnTarget {
  const fromQuery = sanitizeReturnUrl(
    new URLSearchParams(search).get(IGRP_RETURN_URL_PARAM),
  );
  if (fromQuery) return { kind: "url", href: fromQuery };

  const configured = sanitizeReturnUrl(configuredUrl);
  if (configured) return { kind: "url", href: configured };

  if (canGoBack) return { kind: "history-back" };

  return { kind: "url", href: "/" };
}

/** `true` quando o href aponta para fora do app Next actual (outro app/host). */
export function isExternalReturnUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
