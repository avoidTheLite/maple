# Maple — Agent Instructions

## Overview

Maple is a guitar sheet music generator that produces printable SVG reference pages. It is a **pnpm monorepo** managed by **Turborepo** with two apps and two shared packages:

| Package | Path | Description |
|---|---|---|
| `@maple/client` | `apps/client` | React + Vite frontend (port 5173) |
| `@maple/api` | `apps/api` | Express 5 backend (port 3001) |
| `@maple/types` | `packages/types` | Shared TypeScript types |
| `@maple/tsconfig` | `packages/tsconfig` | Shared TS base config |

See `reference/maple_project_instructions.md` for the full SVG design specification.

## Cursor Cloud specific instructions

### Running the dev servers

Start both services concurrently:
```
pnpm dev
```
This runs `turbo run dev`, which starts the Vite client on port 5173 and the Express API on port 3001. The client proxies `/api` requests to the API server.

### Environment variables

The API requires `ANTHROPIC_API_KEY` in the environment for live LLM generation. Create `apps/api/.env` from `apps/api/.env.example`:
```
ANTHROPIC_API_KEY=<your key>
PORT=3001
```
The API loads `apps/api/.env` via `src/loadEnv.ts` (not only `process.cwd()`), so variables are picked up when Turbo runs dev from the monorepo root.

**LLM file cache (dev / optional prod):**

| Variable | Values | Purpose |
|---|---|---|
| `MAPLE_LLM_CACHE` | `off` \| `read` \| `readwrite` | Default is `readwrite` in development and `off` when `NODE_ENV=production`. |
| `MAPLE_LLM_CACHE_DIR` | filesystem path | Override cache root; defaults to `apps/api/.llm-cache/` (gitignored). |
| `MAPLE_LLM_MODEL` | model id | Default `claude-opus-4-6`. |
| `MAPLE_SONGS_DIR` | filesystem path | Repo-backed `SongData` JSON directory; default `apps/api/songs/`. |

**Recording LLM goldens** (real API call; writes JSON under `apps/api/fixtures/llm/` when using `--golden`):

```
pnpm --filter @maple/api exec tsx scripts/record-llm-fixture.ts --golden "Song Title" "Artist Name"
```

After changing prompt text, tool schema, or user message template, CI-local cache keys change. Bump `PROMPT_VERSION` in `apps/api/src/generate/prompts/version.ts` when you want an explicit marker, then re-run the record command if you maintain committed cache files.

**Repo-backed sheets:** `GET /api/sheets/:slug` loads `apps/api/songs/{slug}.json` (validated `SongData`, no LLM). Example: `/api/sheets/demo-song`.

**Multi-template (future):** Same `SongData` with different React layouts can use an optional `layoutTemplateId` field on the JSON once the client supports it; that does not change the LLM prompt fingerprint. Separate LLM output shapes would need a `templateFormatId` (or similar) in both the user message and fingerprint inputs.

### Key gotchas

- **`packageManager` field**: The root `package.json` must include a `"packageManager"` field (e.g. `"pnpm@10.32.1"`) or Turborepo will refuse to resolve workspaces.
- **`pnpm.onlyBuiltDependencies`**: The root `package.json` includes `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` to allow esbuild post-install scripts without interactive prompts.
- **API type-check errors**: `pnpm run build` fails for `@maple/api` due to `@types/node@25` incompatibility with transitive dependencies. This does not affect runtime (`tsx watch` skips type-checking). The client builds and type-checks cleanly.
- **API tests**: `apps/api` uses Vitest (`src/**/*.test.ts`). `pnpm test` runs Turbo `test` across workspaces; the client uses `--passWithNoTests` until UI tests exist. HTTP routes are covered in [`apps/api/src/app.integration.test.ts`](apps/api/src/app.integration.test.ts) with **Supertest** and `createApp(getDeps)` (mock LLM, no `ANTHROPIC_API_KEY`).
- **Dev LLM logging**: When not in production and not under Vitest, `POST /api/generate` logs **cache HIT** vs **MISS** (short cache key prefix + title/artist + mode) and, after a live model call, **token usage** from the response (`input_tokens`, `output_tokens`, etc.). See [`apps/api/src/generate/llm/devLlmLog.ts`](apps/api/src/generate/llm/devLlmLog.ts).
- **Content filtering**: Anthropic's API may block generation for certain copyrighted songs. This is an external policy, not a bug.
- **Default demo data**: The client renders a hardcoded "Blue on Black" sheet on load, even without the API running. The API is only needed for the "generate sheet" search feature.

### Build & check commands

| Action | Command |
|---|---|
| Install deps | `pnpm install` |
| Dev servers | `pnpm dev` |
| Build all | `pnpm run build` |
| Type-check client | `cd apps/client && npx tsc --noEmit` |
| Run tests | `pnpm test` |
