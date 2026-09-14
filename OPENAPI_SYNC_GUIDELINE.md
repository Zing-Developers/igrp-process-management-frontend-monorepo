# Agent Guide — Synchronize a TypeScript SDK with its OpenAPI contract

A reusable brief for any task of the form *"make the TypeScript types and/or HTTP
client match the OpenAPI document."* It is API-agnostic and repo-agnostic — it does
**not** assume a particular framework, package layout, or product.

**How to use it:** hand the whole file to a coding agent, or read it yourself.
Work on a dedicated branch (`chore/openapi-sync`, `feat/api-<version>`). Start at
**Step 0** — you must profile the repo before changing anything.

---

## Step 0 — Build the project profile

Fill this in from the actual repo before touching code. Everything downstream
depends on it.

| Question | How to find it |
|---|---|
| **Where is the contract?** | `*.json` / `*.yaml` with an `openapi` or `swagger` key. Note the version — **2.0** (`definitions`, `nullable` absent), **3.0** (`components.schemas`, `nullable: true`), **3.1** (`type: ["x","null"]`, JSON-Schema aligned). |
| **Is it one package or two layers?** | A *models/types* package (no runtime) and a *client* package (transport + operations) are often separate. May also be a single SDK package. Adapt the steps to whatever exists. |
| **What is the transport layer?** | `fetch` wrapper, `axios`, `got`, generated core. Find the one base class / module that builds the URL, sets headers, serializes the body, parses the response, and raises errors. |
| **How are operations grouped?** | Commonly one client class per OpenAPI `tag`. Sometimes flat. Match the existing split. |
| **What is the naming convention?** | Are method names derived from `operationId`, or hand-authored domain verbs? Are model types named after schemas (`FooDto`) or given friendly names with aliases? **Keep doing what the repo does.** |
| **Who consumes these packages inside the repo?** | Other workspace packages, apps, examples. For each, note **whether it imports built output or source** (read its dependency's `package.json` → `exports` / `main` / `types`). |
| **Build & check commands?** | Per-package `tsc -b` / `tsc --noEmit`, the test runner (`vitest`, `jest`, `node:test`), any lint/format gate. |
| **Versioning & publishing?** | Are the packages version-locked? Private registry? Is publishing done via a workspace script rather than raw `npm publish`? |

Write the answers down (in the PR description or a scratch note). The rest of this
guide refers back to them.

---

## Step 1 — Endpoint coverage matrix

Enumerate **every** `paths[<path>][<method>]` in the contract. For each row record:

- `operationId`, tag
- path parameters, query parameters (name, type, `required`)
- request body: schema `$ref`, `required` flag, content-type
- success response: status code, schema `$ref` (or array/primitive/none), content-type

Map each operation to a client method. Produce three lists:

1. **Missing** — in the contract, no client method → **implement**.
2. **Stale** — client method whose path+verb is not in the contract → **deprecate**
   with a note (delete only if proven dead — see Step 5).
3. **Renamed/moved** — same operation, different path/verb than the client assumes
   → fix the client, keep the old method as a deprecated shim if it was public.

## Step 2 — Schema diff

For **every** entry in `components.schemas` (3.x) / `definitions` (2.0), compare
against its TypeScript type, property by property:

- **Presence** — every schema property exists on the type; no invented properties.
- **Optionality** — a property is required on the type **iff** it appears in the
  schema's `required` array. Everything else is `?:`.
  - 3.0 `nullable: true` → add `| null` (independent of required/optional).
  - 3.1 `type: ["string", "null"]` → `string | null`.
  - A field can be **required *and* nullable** — model both.
- **Type mapping**
  - `string` + `format: date-time` / `date` / `uuid` → `string` (unless the repo
    hydrates to `Date`).
  - `integer` `format: int64` / `number` `BigDecimal` → `number`, but **flag
    possible precision loss** if values can exceed `Number.MAX_SAFE_INTEGER`
    (consider `string`).
  - `type: object` with no `properties` / `additionalProperties: true` →
    `Record<string, unknown>` (or `unknown` for opaque values).
  - free-form value fields (`{}` schema) → `unknown`, never `any`.
- **Enums** → string-literal unions, values verbatim. Hoist an enum repeated
  across schemas into one named union.
- **Composition**
  - `allOf` → intersection (`A & B`), or `extends` when the base is a named type.
  - `oneOf` / `anyOf` → union; use the `discriminator` property if present.
- **Nested `$ref`** → reference the corresponding named type, do not re-inline.
- **`additionalProperties` on a typed object** → intersection with an index
  signature.

Add any schema that has **no** type at all.

## Step 3 — Parameter diff

For each operation, check the method's query/params type against the contract's
`parameters`: names match exactly, optionality matches `required`, enums are
unions. Path params are interpolated (and URL-encoded), not passed as query.

## Step 4 — Apply changes

- Add missing methods and types; correct drift.
- Preserve existing alias exports (`FooDto` ↔ `Foo`) — external code imports both.
- Keep the public barrel/index exports stable (see *Backward compatibility*).

## Step 5 — Dead code

Remove a type or method **only** when a repo-wide search shows zero references
**and** it is absent from the contract:

```bash
grep -rn '<Name>' <src dirs> <test dirs> --include='*.ts' --include='*.tsx'   # exclude build output
```

Otherwise mark `@deprecated` with a one-line reason. List every removal in the
summary as a candidate breaking change.

## Step 6 — Verify (in this order)

1. **Type/models package** — clean `tsc` build; delete stale `*.tsbuildinfo`
   first.
2. **Client package** — clean `tsc` build **against the freshly built models
   package**.
3. **Every in-repo consumer that imports built output** — type-check it *after*
   steps 1–2, or you are checking stale `.d.ts`.
4. **Test suite** — run the actual runner (not just `tsc`); it catches wiring the
   `tsc` project graph may miss.
5. **Package build** — if there is a bundler/emit step, run it.

## Step 7 — Deliverable

A written summary with:

1. **Coverage table** — operation → client method, every row, gaps flagged.
2. **Type diffs applied** — schema → type → what changed.
3. **Intentional deviations** — every place the code deliberately differs from the
   literal contract, with rationale (see *Generator quirks*).
4. **Backward-compat notes** — deprecations, removals, any renamed export.
5. Confirmation that every Step 6 check is green.

---

## Conventions (recommended defaults — defer to the repo)

### Types

- **One type per schema.** If the repo uses both generator names and friendly
  names, keep both: the friendly name is the definition, the generator name is a
  re-exported alias.
  ```ts
  export interface Order { /* ... */ }
  export type OrderDto = Order;              // keep the alias
  export type OrderListItemDto = Partial<Order>;
  ```
- **Shared field fragments** (audit metadata, soft-delete markers, envelope
  fields) → one shared interface, composed in:
  ```ts
  export interface AuditMetadata {           // all optional
    createdAt?: string; updatedAt?: string;
    createdBy?: string; updatedBy?: string;
  }
  export interface Invoice extends AuditMetadata { /* ... */ }
  export type Order = AuditMetadata & { /* ... */ };
  ```
  Do not re-declare the shared fields on each type.
- **Pagination** → one generic wrapper type reused everywhere
  (`Page<T>` / `PaginatedResponse<T>`); never re-hand-roll per endpoint.
- **`Partial<A & B>`** distributes correctly — alias helpers like
  `type XDto = Partial<Friendly>` keep working when `Friendly` becomes an
  intersection. Verify anyway.
- Enums are unions of string literals, not bare `string` — unless a filter
  parameter deliberately accepts free text (`Status | (string & {})` with a
  comment).

### Client methods

- One method per operation. Signature order: required path params positionally →
  request body (if any) → an options object for query params / overrides.
- Interpolate path params through the repo's encode helper (URL-encodes `/`, etc.).
- Query params: hand the transport a plain object; it should drop
  `undefined` / `null` / `""`. Don't pre-filter in every method.
- Honour `requestBody.required`: if the server demands a body, default it
  (`= {}`) rather than sending nothing.
- Bodyless POST/PUT (actions like "claim", "rotate"): call the helper with no
  body argument.
- Response typing:
  - `204` / empty / `content: */*` string → `void`.
  - `text/plain` or schema `{ "type": "string" }` → `string`.
  - collection → `T[]`; page → `Page<T>`.
- Whatever base-class helper wrappers exist (`get`/`post`/`put`/`delete`), make
  sure they **all** forward query params consistently — a common latent bug is
  one wrapper dropping the params argument.
- Don't rewire auth. Whatever mechanism resolves credentials per request
  (token callback, interceptor) stays as-is; just ensure required security
  schemes are expressible.
- `servers[].url` may carry a base path — make sure the client's base-URL logic
  doesn't concatenate it twice.

### Backward compatibility

- **Add, don't rename.** A renamed exported type or method is a breaking change.
- **Deprecate, don't delete** — unless proven dead (Step 5).
- Keep the barrel/index export surface stable.
- Follow the repo's version policy; if packages are version-locked, bump them
  together.

---

## Cross-cutting gotchas

1. **Monorepo consumers usually resolve a sibling package through its built
   output** (`dist/`, `lib/`, `build/`) as declared by `exports` / `main` /
   `types` — **not** its source. Editing source and then type-checking a consumer
   without rebuilding checks stale declarations. Rebuild the changed package
   first. (If `exports` points at `./src/*.ts`, you're fine — verify.)
2. **Build output is normally git-ignored** — never stage `dist/` etc.
3. **`*.tsbuildinfo` / incremental caches mask changes** — delete before a clean
   verification pass.
4. **Workspace package managers may ignore nested `.npmrc` / registry config**
   (a warning about "ignoring workspace config" is normal). Publishing usually
   runs through a workspace-aware script and may target a **private registry**,
   not the public one.
5. **Test project configs (`rootDir`, project references) can carry pre-existing
   errors** unrelated to your change. Run the real test runner for signal; don't
   be blocked by `tsc -p test/tsconfig.json` noise you didn't introduce.
6. **`operationId`s can be terse, duplicated across tags, or absent.** Don't
   derive method names blindly; match the repo's naming.
7. **Path templating differs** between spec (`{id}`) and some clients (`:id`).
8. **Regenerate-from-scratch vs hand-maintained.** If the SDK is produced by a
   generator (`openapi-generator`, `openapi-typescript`, `orval`, `kubb`), the
   right fix may be to re-run the generator and re-apply local patches — check for
   a generator config file before hand-editing.

---

## Common OpenAPI generator quirks (deliberate deviations to watch for)

Generated specs are often imprecise. Where the client is intentionally *more*
correct than the document, **record it** in the Step 7 summary and re-confirm
against a real response when possible.

| Quirk | Symptom | Handling |
|---|---|---|
| **List-as-object** | A `List<T>` / array endpoint is documented as a single `$ref` to `T` (common with springdoc). | Cross-check the endpoint summary ("List of…") and existing consumers; type as `T[]`. |
| **Everything optional** | No `required` arrays anywhere (Java/Kotlin field nullability lost). | Don't blindly make every field optional. Keep IDs and always-present fields required; note the assumption. |
| **Optional ≠ nullable** | 3.0 `nullable: true` conflated with `required: false`. | A property can be required and nullable. Model `T \| null` separately from `?:`. |
| **Opaque maps** | `type: object` with no `properties`. | `Record<string, unknown>`. |
| **Inline duplicated enums** | Same enum repeated in many schemas. | Hoist to one named union; watch for value/casing drift between copies. |
| **Missing `format`** | Obvious date/UUID fields typed as plain `string` with no format. | Fine to keep as `string`; just be consistent. |
| **Number precision** | `int64`, `BigDecimal`, money as `number`. | Flag if values may exceed `2^53`; consider `string`. |
| **`*/*` response content** | Success body under `*/*`. | Usually `void` or `string`. |
| **`allOf` for "extends"** | Base + delta expressed as `allOf`. | Intersection / `extends`, not a flattened copy. |
| **Enum drift** | Server adds a member; spec not regenerated. | Prefer unions but keep a widening escape hatch on filter inputs. |

---

## Definition of done

- [ ] Every contract operation has a client method (coverage table in the summary).
- [ ] Every schema matches its type: presence, optionality, nullability, types,
      enums, nested refs, `allOf`/`oneOf`.
- [ ] Every operation's parameters match the contract.
- [ ] New/changed methods have tests (URL, verb, body, path-encoding).
- [ ] Models package: clean type build.
- [ ] Client package: clean type build against the fresh models build.
- [ ] Every in-repo consumer type-checks (after rebuilding what it depends on).
- [ ] Test suite green.
- [ ] No renamed/removed public export without a breaking-change note.
- [ ] Summary written: coverage, type diffs, intentional deviations, compat notes.

---

## Appendix A — Project profile template

```text
CONTRACT
  path:            <file>
  openapi version: <2.0 | 3.0.x | 3.1.x>
  operations:      <count>   tags: <list>

PACKAGES
  models/types:    <name> @ <path>      build: <cmd>   emits to: <dir>
  client/SDK:      <name> @ <path>      build: <cmd>   emits to: <dir>
  generator:       <none | openapi-generator | openapi-typescript | orval | …>

TRANSPORT
  base module:     <file>
  http lib:        <fetch | axios | …>
  path encode:     <helper>
  query handling:  <helper / behaviour>
  auth:            <mechanism — do not modify>

CONSUMERS (in repo)
  <name>  imports: <source | dist>   check: <cmd>
  …

VERIFY
  models build:    <cmd>
  client build:    <cmd>
  consumer checks: <cmds>
  tests:           <cmd>

RELEASE
  version policy:  <locked | independent>
  registry:        <public | private url>
  publish:         <cmd / script>
```

## Appendix B — Worked example (this repo)

Illustration only; the guide above is the general procedure.

```text
CONTRACT      packages/client/api-docs-process-runtime.json — OpenAPI 3.1
              51 operations; tags: TaskInstances, Activities, ProcessInstance,
              Areas, ProcessDefinition, m-2m-key-controller

PACKAGES      types  @irn/platform-process-management-types  @ packages/types
                     build: tsc -b        emits: packages/types/dist
              client @irn/platform-process-management-client-ts @ packages/client
                     build: tsc -b        emits: packages/client/dist
              generator: none (hand-maintained)

TRANSPORT     base: packages/client/src/client/base-client.ts (fetch)
              path encode: this.encodePath()
              query: BaseApiClient.buildQueryString() drops undefined/null/""
              auth: ApiClientConfig.getHeaders() resolved per request

CONSUMERS     packages/ui  imports: dist (via package "exports")  check: tsc --noEmit -p tsconfig.json
              → MUST rebuild types + client before checking ui

VERIFY        (cd packages/types  && rm -f tsconfig.tsbuildinfo && npx tsc -b)
              (cd packages/client && rm -f tsconfig.tsbuildinfo && npx tsc -b)
              (cd packages/ui     && npx tsc --noEmit -p tsconfig.json)
              npx vitest run

RELEASE       version: locked across types/client/ui (0.1.0-beta.N)
              registry: private (Sonatype/Nexus), not npmjs
              publish: pnpm publish --registry=<url> via each package's `release` script

CONVENTIONS   friendly name + `XxxDTO` alias re-export
              AuditMetadata (shared.ts) composed into persisted DTOs
              PaginatedResponse<T> for every `*PageDTO`
              deprecated-not-deleted: getProcessById, createProcessArtifact, updateProcessArtifact

DEVIATIONS    activities/status/priorities/artifacts/task-status endpoints typed as
              arrays though the spec shows a single object (springdoc list-as-object)
              ProcessInstance.cancelledBy is contract spelling; canceledBy kept as deprecated alias
```
