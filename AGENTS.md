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

The API requires `ANTHROPIC_API_KEY` in the environment. Create `apps/api/.env` from `apps/api/.env.example`:
```
ANTHROPIC_API_KEY=<your key>
PORT=3001
```
The API uses `dotenv` to load this file at startup.

### Key gotchas

- **`packageManager` field**: The root `package.json` must include a `"packageManager"` field (e.g. `"pnpm@10.32.1"`) or Turborepo will refuse to resolve workspaces.
- **`pnpm.onlyBuiltDependencies`**: The root `package.json` includes `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` to allow esbuild post-install scripts without interactive prompts.
- **API type-check errors**: `pnpm run build` fails for `@maple/api` due to `@types/node@25` incompatibility with transitive dependencies. This does not affect runtime (`tsx watch` skips type-checking). The client builds and type-checks cleanly.
- **No test files**: Neither app has test files yet; `pnpm test` exits with code 1 because vitest finds no test files.
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
