---
name: irn-process-sdk-synchronizer
description: Refresh the Process Runtime OpenAPI contract, synchronize the hand-maintained TypeScript types and client packages, verify the SDK, and prepare or perform a production release. Use for Process Runtime API/SDK synchronization and release work in this repository.
---

# IRN-Process-SDK-Synchronizer

Synchronize this repository's SDK with the live Process Runtime contract while preserving its public API where possible.

## Contract refresh

Run `scripts/fetch-openapi.sh` from this skill directory. It reads the complete OpenAPI JSON endpoint from `OPENAPI_URL` in the repository-root `.env`, validates the downloaded document, formats it deterministically, and atomically replaces `packages/client/api-docs.json` only when content changed. Never embed an environment-specific endpoint in the skill or script.

If `.env` is absent, `OPENAPI_URL` is absent, or its value is empty, stop and ask the user for the complete OpenAPI JSON endpoint. Once supplied, add or update only `OPENAPI_URL` in the repository-root `.env` without displaying or changing unrelated environment values. Do not guess the endpoint or silently fall back to a fixed URL.

If network access is denied, request approval to run the fetch with network access. Stop if the endpoint is unavailable or the downloaded JSON fails validation; never replace the checked-in snapshot with an error response or partial file.

Review the contract diff before changing source. Treat unexpected contract removal, a different API title, or a large operation-count drop as suspicious and report it before proceeding.

## Synchronization workflow

Read `OPENAPI_SYNC_GUIDELINE.md` at the repository root completely and follow it as the authoritative synchronization and verification procedure. Apply it specifically to:

- Contract: `packages/client/api-docs.json`
- Types: `packages/types`
- HTTP client: `packages/client`

Keep the existing hand-maintained architecture, naming conventions, aliases, barrel exports, fetch transport, authentication, and base-URL behavior. Do not introduce a code generator unless the user explicitly requests that architectural change.

Build the types package before the client because the client consumes the types package's emitted declarations. Add or update focused tests for changed operations, including HTTP method, URL/query serialization, path encoding, request body, and response typing as applicable.

## Verification

From the repository root, run these checks in order:

1. `pnpm build:types`
2. `pnpm build:client`
3. `pnpm --filter @igrp/platform-process-management-client-ui exec tsc --noEmit -p tsconfig.json`
4. `pnpm test`

Report pre-existing failures separately and do not claim success unless the relevant checks pass. Do not commit generated `dist` output or TypeScript build-info files.

## Production release

Building and publishing are separate stages. A synchronization request authorizes fetching, source updates, tests, and package builds, but not publishing unless the user explicitly requests a production release.

Before publishing:

- Show the contract/code summary, compatibility impact, verification results, current versions, and proposed next version.
- Obtain the user's choice when the version is not specified.
- Keep `packages/types` and `packages/client` versions aligned. Preserve the client's `workspace:*` dependency on `@irn/platform-process-management-types`; pnpm converts that workspace protocol to the current package version in the published manifest.
- Confirm the working tree contains only intended release changes and that registry authentication is available without exposing credentials.

When publication is explicitly authorized, publish in dependency order using the repository scripts: `pnpm deploy:types`, then `pnpm deploy:client`. Do not run the root `pnpm release`, because that also publishes `packages/ui`, which is outside this skill's scope. Stop after the first failed publication; do not retry a publish blindly because the package version may already exist remotely.

Finish with the coverage/type-diff/compatibility summary required by `OPENAPI_SYNC_GUIDELINE.md`, plus the exact packages and versions published (or a clear statement that no publication occurred).
