# Changelog

Todas as alterações relevantes a este package são documentadas neste ficheiro.

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
