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

Tipos: `StepConfigParams`, `FetchStepConfigResult`, `ProcessActions`, `ResolveStepComponentParams`, `StepComponentProps`, `StepComponentConfig`, `StepMethods`, etc.
