# Changelog

Todas as alterações relevantes a este package são documentadas neste ficheiro.

## 0.1.0-beta.44

### Fixed

- Modal de erro da tarefa deixava de ter `max-width` e o texto técnico (NPE
  Java numa linha) esticava o diálogo. O modal fica limitado a `max-w-md`,
  os detalhes quebram/scrollam, e a mensagem de erro deixa de mostrar o
  stack Java em cru.

## 0.1.0-beta.43

### Fixed

- Completar/guardar tarefa sem variáveis deixava de enviar `variables`/`forms`
  (`undefined` → omitido no JSON). O backend (`TaskDataDTO.getVariables()`)
  recebia `null` e rebentava com NPE no `forEach`. O payload passa a enviar
  sempre listas (`[]` quando o step não devolve variáveis).

## 0.1.0-beta.42

### Changed

- Labels e mensagens da UI de execução/consulta de processo passam a
  Português de Portugal: botões "Guardar" / "Concluir Tarefa", textos de
  loading ("A guardar...", "A processar...", "A carregar o passo…"),
  toasts e erros genéricos ("Erro", "Erro desconhecido", "Tarefa guardada
  com sucesso!").

## 0.1.0-beta.41

### Fixed

- Saída do popup "Tarefa completada com sucesso" voltava a `/` em cluster. O
  destino deixou de depender do slug hardcoded
  `/apps/igrp-process-management/my-tasks` e de `NEXT_PUBLIC_IGRP_BASE_PATH`
  (que não existe nas apps — usam `NEXT_PUBLIC_BASE_PATH`).
- URLs absolutos passam a navegar com `window.location.replace`. Com
  `router.replace` o Next prefixava o basePath do app actual (ex.:
  `/apps/core/apps/igrp-process-management/my-tasks` → 404).

### Added

- `?returnUrl=` no URL da tarefa: quem abre a tarefa declara a página de
  origem e o popup volta exactamente para lá. Exportados
  `IGRP_RETURN_URL_PARAM`, `resolveTaskReturnTarget` e `isExternalReturnUrl`.
- `IGRPProcessClientConfig.taskReturnUrl`: fallback injectado pela app a partir
  de `IGRP_APP_PAGE_TASK` (env do servidor, lida por request), para funcionar em
  cluster.

### Migração de `NEXT_PUBLIC_IGRP_APP_PAGE_TASK`

`NEXT_PUBLIC_*` é inlined no `next build`, por isso a variável definida apenas
no deployment do K8s nunca chegava ao browser. A lib deixou de ler env: passa a
usar-se **só `IGRP_APP_PAGE_TASK`** (sem prefixo), lida no servidor pela app e
passada em `config.taskReturnUrl`.

```ts
// layout.tsx (server component) da rota de execução
const config = {
  baseUrl: process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL ?? "",
  accessToken: token?.accessToken ?? null,
  taskReturnUrl: process.env.IGRP_APP_PAGE_TASK ?? "",
};
```

Ordem de resolução: `?returnUrl=` → `config.taskReturnUrl` → history back →
`/`.

## 0.1.0-beta.40

### Fixed

- Consulta (`/process/view`): o conteúdo do step deixou de usar `pointer-events-none`.
  Em consulta os cliques (links, expanders, abrir PDF, …) voltam a funcionar; o
  modo read-only continua via `readOnly` no config do step. O lock de pointer
  events mantém-se apenas após submit com sucesso em execução.

## 0.1.0-beta.39

### Fixed

- Flash do fallback “Erro ao carregar o processo” no primeiro paint: `isLoadingStepConfig`
  passa a iniciar a `true`, e `IGRPProcessPage` trata estado pending (`!stepConfig` sem erro)
  como loading em vez de erro.

## 0.1.0-beta.21

### Added

- `opts.fallbackToHistory` aceita agora **`boolean | (variables) => boolean`**.
  Quando passada uma predicate, recebe as variáveis BPMN do step actual
  (`stepConfig.variables`, injectadas pela lib) e devolve `true` para
  activar o fallback. Permite ao consumidor codificar regras de negócio
  sem precisar de ir buscar variables ao contexto e sem inflar a API
  pública da lib com nomes/valores de domínio.

### Migration desde `beta.20`

`beta.20` já suportava apenas `boolean`. Continua válido:

```ts
getFormDataForTask({ fallbackToHistory: true });
```

Para regras de negócio, em vez de:

```ts
const decision = stepConfig?.variables?.find(
  (v) => v.name === "decision",
)?.value;
const isRectifying =
  typeof decision === "string" &&
  ["RECTIFICAR", "RETIFICAR"].includes(decision.toUpperCase());

getFormDataForTask({ fallbackToHistory: isRectifying });
```

passa a poder escrever:

```ts
getFormDataForTask({
  fallbackToHistory: (vars) => {
    const d = vars.find((v) => v.name === "decision")?.value;
    return (
      typeof d === "string" &&
      ["RECTIFICAR", "RETIFICAR"].includes(d.toUpperCase())
    );
  },
});
```

Nenhuma quebra: chamadas existentes com `boolean` continuam a funcionar.

## 0.1.0-beta.20

### Changed (breaking — relativo a `beta.19`)

- **Removida** a opção `opts.variables` de `getFormDataForTask`. A lib não
  conhece regras de negócio (nomes de variáveis BPMN, valores de decisão
  como `RECTIFICAR`/`RETIFICAR`, etc.) — o gate de "quando activar o
  fallback" pertence ao consumidor.
- **Removido** o tipo exportado `IGRPProcessVariable`.
- O fallback agora dispara sempre que `fallbackToHistory === true` E o
  step actual está vazio (`undefined`/`null`/`[]`).

### Migration

Antes (`beta.19`):

```ts
getFormDataForTask({
  fallbackToHistory: true,
  variables: stepConfig?.variables,
});
```

Agora (`beta.20`):

```ts
const decision = stepConfig?.variables?.find(
  (v) => v.name === "decision",
)?.value;
const isRectifying =
  typeof decision === "string" &&
  ["RECTIFICAR", "RETIFICAR"].includes(decision.toUpperCase());

getFormDataForTask({ fallbackToHistory: isRectifying });
```

Chamadas sem args (`getFormDataForTask()`) continuam sem qualquer
alteração.

## 0.1.0-beta.19

> Nota: a versão `0.1.0-beta.18` foi publicada no registry Sonatype sem
> commit do bump em git (`main`/`develop` ficaram em `beta.17`). Esta
> entrada salta directamente para `beta.19` para evitar colisão.
> O código publicado em `beta.18` era idêntico ao git `beta.17`; apenas
> tinha bumps de `tailwind-merge` e `zod` (sincronizados em baixo).

### Changed

- `tailwind-merge` `^3.4.0` → `^3.5.0` (sincronização com o que estava
  no `beta.18` publicado mas não committed).
- `zod` `^4.1.12` → `^4.3.6` (idem).

### Added

- `getFormDataForTask(opts?)` aceita agora um parâmetro opcional para
  suporte a fallback histórico:
  - `opts.fallbackToHistory: boolean` (default `false`) — quando `true`,
    se o step actual estiver vazio, a função lê automaticamente os dados
    do histórico do mesmo step (via `getFormDataByTaskKey(userTaskKey)`).
    Útil em ciclos de RECTIFICAR onde o utilizador volta a uma etapa
    anterior.
  - `opts.variables: Array<{name, value}>` — se fornecido, o fallback só
    dispara quando a variável BPMN `decision` for `RECTIFICAR` ou
    `RETIFICAR` (uppercase, com tolerância à grafia legacy).
- Novos tipos exportados: `IGRPGetFormDataForTaskOptions`,
  `IGRPProcessVariable`, `IGRPFormEntry`.

### Backwards compatibility

- Chamadas existentes `getFormDataForTask()` (sem args) mantêm
  **exactamente** o comportamento anterior — só leem o step actual,
  sem fallback.
