# Style Guide Compliance Remediation

Full audit and remediation of the `maple` monorepo against the project style guide.
Completed on branch `initialBuild`.

---

## Clarifications and Conventions

- `@battleship/*` in style guide examples = `@maple/*` in this project
- `apps/client` renamed to `apps/web`; package name `@maple/client` → `@maple/web`
- SVG elements are **excluded** from the Tailwind styling rule — SVG styling standards are TBD (noted as a style guide gap in `memory/style_guide_svg_gap.md`)
- `@maple/types` uses **source-export-via-aliases** permanently — no build step, no `dist/` output
- Types in `apps/api/src/generate/llm/types.ts` were package-scoped → moved to `apps/api/src/types.ts`
- `useMutation` (TanStack Query) used for the generate action per style guide; last successful song held in `useState`

## Post-remediation updates (standards refresh)

- API runtime is intentionally **no-emit TypeScript**: `apps/api` uses `tsc --noEmit` for build checks and `tsx src/index.ts` for startup.
- Root standards gates are now explicit command targets: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, and `pnpm format:check`.
- Node runtime baseline is pinned to 22 (`.nvmrc` + root `package.json` engines).
- Client API boundaries validate response payloads before use through `apps/web/src/api/schemas.ts`.
- Layout persistence and hydration use TanStack Query hooks via `apps/web/src/api/client.ts`.

---

## Phase 0 — Baseline

- [x] Run `pnpm install`
- [x] Run `pnpm test` and confirm all existing tests pass before making any changes

---

## Phase 1 — Infrastructure

- [x] Add `.prettierrc` at repo root (`semi`, `singleQuote`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`)
- [x] Delete dead code: `apps/client/src/components/MapleBand.tsx` (unused component)
- [x] Delete dead code: `apps/client/src/components/music/Measure.tsx` (unused component)
- [x] Delete duplicate: `apps/client/src/types/music.ts` (shadowed by `packages/types/src/music.ts`)
- [x] Rename `apps/client/` → `apps/web/`; update `package.json` name to `@maple/web`
- [x] Add `globals: true` to `apps/api/vitest.config.ts`
- [x] Run tests ✅

---

## Phase 2 — API Structural Foundations

- [x] Create `packages/util/` package (`@maple/util`) with `package.json`, `tsconfig.json`, `vitest.config.ts`
- [x] Implement `packages/util/src/logger.ts` — `createLogger` wrapping Pino (`LogLevel`, `LoggerOptions`)
- [x] Write tests for `createLogger` (`logger.test.ts`) — module name, default level, explicit level override
- [x] Implement `packages/util/src/errorHandler.ts` — `AppError`, `ValidationError`, `NotFoundError`, `errorHandler` middleware
- [x] Write tests for error handler (`errorHandler.test.ts`) — 6 tests covering all error classes and middleware behaviour
- [x] Create `packages/util/src/index.ts` re-exporting all public symbols
- [x] Create `apps/api/src/types.ts` — consolidated package-scoped types (`LlmClient`, `LlmMessage`, `CreateMessageParams`, `LlmCacheEnvelope`, `LlmCacheMode`, `GenerateDeps`)
- [x] Delete `apps/api/src/generate/llm/types.ts`; update all import paths to `../../types.ts` / `../types.ts`
- [x] Add backwards-compat re-export in `generateService.ts`: `export type { GenerateDeps, LlmCacheMode } from '../types.ts'`
- [x] Create `apps/api/src/config.ts` — Zod env validation at startup (PORT, NODE*ENV, LOG_LEVEL, ANTHROPIC_API_KEY, MAPLE_LLM*\*)
- [x] Write tests for `config.ts` (`config.test.ts`) — defaults and PORT coercion
- [x] Add `@maple/util: workspace:*` to `apps/api/package.json`; add `pino-pretty` devDep
- [x] Run tests ✅

---

## Phase 3 — API Conformance

- [x] Register `errorHandler` from `@maple/util` as last middleware in `app.ts`
- [x] Remove global `app.use(express.json())` from `app.ts`
- [x] Add `router.use(express.json())` inside `createGenerateRouter` (per-router body parsing)
- [x] Add explicit return type `express.Application` to `createApp`
- [x] Add explicit return type `ExpressRouter` to `createGenerateRouter` and `createSheetsRouter`
- [x] Replace inline `catch`/`res.status(500)` in `generateController.ts` with `next(new AppError(...))`
- [x] Replace inline `catch`/`res.status(500)` in `sheetsRouter.ts` with `next(new AppError(...))`
- [x] Replace `console.log` in `apps/api/src/index.ts` with Pino logger; use `env.PORT` from `config.ts`
- [x] Replace `console.log` in `createGenerateDeps.ts` with `logger.debug`
- [x] Rewrite `devLlmLog.ts` — import `createLogger`, replace all `console.log` with `logger.debug`
- [x] Add `logger.error` in `generateService.ts` for LLM upstream failures
- [x] Update dev script: `tsx watch src/index.ts | pino-pretty`
- [x] Run tests ✅

---

## Phase 4 — Linting and Client Foundations

- [x] Create `packages/eslint-config/` package (`@maple/eslint-config`) with `package.json` and `index.js`
  - Flat config: `import/no-default-export: error`, `@typescript-eslint/explicit-module-boundary-types: error`, `@typescript-eslint/consistent-type-imports: error`, `no-console: error`
  - Overrides: config files allowed `export default`; `scripts/` allowed `console`; `_`-prefixed args ignored for unused-vars
- [x] Create root `eslint.config.js` importing `@maple/eslint-config`
- [x] Add `"type": "module"` to root `package.json`
- [x] Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) in `apps/web`
- [x] Add `tailwindcss()` plugin to `apps/web/vite.config.ts`
- [x] Create `apps/web/src/index.css` with Tailwind import and CSS custom property theme tokens
- [x] Import `./index.css` in `apps/web/src/main.tsx`
- [x] Install `clsx` and `tailwind-merge` in `apps/web`
- [x] Create `apps/web/src/lib/utils.ts` — `cn()` helper
- [x] Install TanStack Query (`@tanstack/react-query`) in `apps/web`
- [x] Wrap app in `QueryClientProvider` in `apps/web/src/main.tsx`
- [x] Run tests ✅

---

## Phase 5 — Client Conformance

- [x] `App.tsx` — named export, `React.JSX.Element` return type, `useMutation` for generate, `useState` to hold last successful song, Tailwind classes on HTML elements
- [x] `SongSearch.tsx` — named export, explicit return types, Tailwind classes on HTML elements (dynamic button color retained via `style={{}}`)
- [x] `MapleCanvas.tsx` — named export, `React.JSX.Element`, `import type React`
- [x] `BandHeader.tsx` — named export, `React.JSX.Element`, named import of `ChordDiagram`
- [x] `BandIntroRiff.tsx` — named export, `React.JSX.Element`
- [x] `BandVerse.tsx` — named export, `React.JSX.Element`
- [x] `BandChorus.tsx` — named export, `React.JSX.Element`
- [x] `BandHarmonicMap.tsx` — named export, `React.JSX.Element`
- [x] `BandNotes.tsx` — named export, `React.JSX.Element`
- [x] `ChordDiagram.tsx` — named export, `React.JSX.Element`, explicit `: number` on `fretDotY`
- [x] Run tests ✅

---

## Phase 6 — Final Pass

- [x] Run `prettier --write .` across entire repo
- [x] Run `eslint .` and fix all violations:
  - Removed unused `fp` variable from `generateService.test.ts` (read-mode-miss test)
  - Removed unused `PROMPT_VERSION` import from `scripts/verify-llm-cache-smoke.ts`
  - Fixed `_next: NextFunction` unused-arg false positive via `argsIgnorePattern: '^_'`
  - Config files (`*.config.ts`, `eslint.config.js`, `packages/eslint-config/index.js`) exempted from `import/no-default-export`
  - Script files exempted from `no-console`
- [x] Fix `Usage` type error — Anthropic SDK `Usage` now requires `cache_creation_input_tokens` and `cache_read_input_tokens`; updated all mock `usage` objects in tests and smoke script
- [x] Final `pnpm test` — 28 tests passing (19 API + 9 util) ✅

---

## Style Guide Gaps Noted

| Gap                            | Location                                         | Notes                                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SVG styling standard undefined | All SVG components in `apps/web/src/components/` | Tailwind rule excludes SVG elements. SVG design pattern and class conventions to be defined when the project's visual system matures. Tracked in `memory/style_guide_svg_gap.md`. |

---

## Files Created

| File                                     | Purpose                               |
| ---------------------------------------- | ------------------------------------- |
| `.prettierrc`                            | Repo-wide Prettier config             |
| `apps/api/src/types.ts`                  | Package-scoped API types              |
| `apps/api/src/config.ts`                 | Zod env validation                    |
| `apps/api/src/config.test.ts`            | Tests for env config                  |
| `apps/web/src/index.css`                 | Tailwind entry + CSS theme tokens     |
| `apps/web/src/lib/utils.ts`              | `cn()` helper                         |
| `packages/util/package.json`             | `@maple/util` package manifest        |
| `packages/util/tsconfig.json`            | TypeScript config for util            |
| `packages/util/vitest.config.ts`         | Vitest config for util                |
| `packages/util/src/logger.ts`            | `createLogger` (Pino wrapper)         |
| `packages/util/src/logger.test.ts`       | Logger tests                          |
| `packages/util/src/errorHandler.ts`      | `AppError`, `errorHandler` middleware |
| `packages/util/src/errorHandler.test.ts` | Error handler tests                   |
| `packages/util/src/index.ts`             | Public barrel export                  |
| `packages/eslint-config/package.json`    | `@maple/eslint-config` manifest       |
| `packages/eslint-config/index.js`        | Shared ESLint flat config             |
| `eslint.config.js`                       | Root ESLint config                    |

## Files Deleted

| File                                           | Reason                                     |
| ---------------------------------------------- | ------------------------------------------ |
| `apps/client/src/components/MapleBand.tsx`     | Dead code — unused                         |
| `apps/client/src/components/music/Measure.tsx` | Dead code — unused                         |
| `apps/client/src/types/music.ts`               | Duplicate of `packages/types/src/music.ts` |
| `apps/api/src/generate/llm/types.ts`           | Consolidated into `apps/api/src/types.ts`  |
