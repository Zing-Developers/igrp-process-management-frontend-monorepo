# @igrp/process-ui

UI centralizada para gestão de processo IGRP. Permite reutilizar a página de processo, contexto, renderer e ações em vários projetos (ex: INSS, process-management-frontend).

## Conteúdo

- **ProcessPage** – Página de processo com `[...process]` (processKey, processInstanceId, userTaskKey, userTaskInstanceId).
- **IGRPProcessProvider** / **useIGRPProcessContext** – Contexto de processo.
- **ProcessPageRenderer** – Renderer com stepper, botões Guardar/Completar e diálogos.
- **createProcessActions** – Factory para criar ações de processo (fetchStepConfig, callCompleteTask, callSaveTask) injetando o client.
- **Tipos** – StepConfigParams, FetchStepConfigResult, ProcessActions, etc.

## Uso num projeto consumidor

### 1. Server actions (obter client do projeto e criar ações)

No projeto (ex: INSS), criar ficheiro com server actions que usam o client local:

```ts
// src/app/(igrp)/(generated)/process/process-actions.ts
"use server";

import { createProcessActions } from "@igrp/process-ui";
import { getIGRPProcessClient } from "@/lib/api-client";

const actions = createProcessActions(getIGRPProcessClient);

export const fetchStepConfig = actions.fetchStepConfig;
export const callCompleteTask = actions.callCompleteTask;
export const callSaveTask = actions.callSaveTask;
```

### 2. Página de processo (rota `process/[...process]`)

O projeto define a rota e passa `processActions` e o resolver do step (dynamic import local):

```tsx
// src/app/(igrp)/(generated)/process/[...process]/page.tsx
"use client";

import { ProcessPage } from "@igrp/process-ui";
import {
  fetchStepConfig,
  callCompleteTask,
  callSaveTask,
} from "../process-actions";

const processActions = { fetchStepConfig, callCompleteTask, callSaveTask };

export default function Page({
  params,
}: {
  params: Promise<{ process: string[] }>;
}) {
  return (
    <ProcessPage
      params={params}
      processActions={processActions}
      resolveStepComponent={async ({ processKey, version, userTaskKey }) => {
        const mod = await import(`./(${processKey})/${version}/${userTaskKey}`);
        return mod.default;
      }}
      getBackUrl={() =>
        typeof window !== "undefined"
          ? `${window.location.origin}/apps/igrp-process-management/my-tasks`
          : "/"
      }
    />
  );
}
```

Os steps (ex: `(P1.1.1)/v9/Task_pedido.tsx`) continuam no projeto, na mesma pasta da página; apenas a página, o contexto e o renderer vêm do package.

### 3. Dependências no projeto

- `@igrp/process-ui` (este package).
- `@igrp/igrp-framework-react-design-system`.
- Next.js 14+.
- React 18+.

## API resumida

| Export                            | Descrição                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `ProcessPage`                     | Página completa; recebe `params`, `processActions`, `resolveStepComponent`, `getBackUrl?`. |
| `IGRPProcessProvider`             | Provider com `params` e `processActions`.                                                  |
| `useIGRPProcessContext`           | Hook para aceder ao contexto.                                                              |
| `useIGRPProcess`                  | Hook com estado e ações (usa `processActions`).                                            |
| `createProcessActions(getClient)` | Cria `fetchStepConfig`, `callCompleteTask`, `callSaveTask`.                                |
| `ProcessPageRenderer`             | Renderer configurável com `resolveStepComponent` e `getBackUrl?`.                          |
| `ConfirmationDialog`              | Diálogo de confirmação (sucesso/erro).                                                     |

Tipos: `StepConfigParams`, `FetchStepConfigResult`, `ProcessActions`, `ResolveStepComponentParams`, `StepComponentProps`, `StepComponentConfig`, `StepMethods`, `IGRPGetFormDataForTaskOptions`, `IGRPProcessVariable`, `IGRPFormEntry`, etc.

## Ler dados de form do step

O contexto expõe duas funções para ler dados de form persistidos no engine BPMN:

- `getFormDataForTask(opts?)` — dados do step actual.
- `getFormDataByTaskKey(taskKey)` — dados de qualquer step pelo `taskKey`.

### Fallback histórico (ciclos de RECTIFICAR)

Quando o utilizador volta a uma etapa anterior via _Rectificar_, o step actual
está vazio porque ainda não foi persistido nada de novo. Para reidratar o form
com os últimos dados submetidos para o MESMO step, passa `fallbackToHistory: true`:

```ts
import { useIGRPProcessContext } from "@igrp/platform-process-management-client-ui";

function MyStep() {
  const { getFormDataForTask, stepConfig } = useIGRPProcessContext();

  // Carrega current; se vazio E houver decision=RECTIFICAR no processo,
  // cai automaticamente no histórico do mesmo step.
  const data = getFormDataForTask({
    fallbackToHistory: true,
    variables: stepConfig?.variables,
  });

  // ...
}
```

**Comportamento:**

1. Lê dados do step actual.
2. Se vazio E `opts.fallbackToHistory === true`:
   - Se `opts.variables` for passado, o fallback só dispara quando existe
     `decision = "RECTIFICAR"` (ou `"RETIFICAR"` legacy, case-insensitive).
   - Se `opts.variables` for omitido, o fallback dispara sempre que current
     está vazio.
   - Carrega via `getFormDataByTaskKey(userTaskKey)` (latest activity progress).
3. Caso contrário, devolve o current original.

**Retro-compatibilidade:** chamadas sem args (`getFormDataForTask()`) mantêm
**exactamente** o comportamento legacy — sem fallback.
