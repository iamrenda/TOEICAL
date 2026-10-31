# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

TOEICAL is an English-learning app for Japanese speakers (UI copy is in Japanese), built around three modes: Reading (TOEIC questions), Writing (AI-graded essays), and Speaking (planned). The repo is a monorepo of independent services, each with its own dependencies and run command.

## Services & how to run them

`frontend/`, `backend/` and `shared/` (`@toeical/shared`, zod schemas/types) are **npm workspaces** declared in the root `package.json`. Dependencies are installed **once, from the repo root** (`npm install` / `npm ci`) into a single hoisted root `node_modules/` and a single root `package-lock.json`. There is no `frontend/node_modules` and no per-workspace lockfile — don't run `npm install` inside a workspace dir or commit a workspace-level `package-lock.json`. `ai/` is Python and separate. Root scripts: `npm run typecheck` (`tsc --b` across the project references), `npm run format` / `format:check` (prettier). There is no root dev orchestration — each service is still started independently in its own terminal.

| Dir         | Stack                                     | Dev command                                                                                                         |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `frontend/` | React Native + Expo (expo-router)         | `cd frontend && npm run dev` (`npm run ios` / `android` / `web` for a target; `npm run clear` to reset Metro cache) |
| `backend/`  | Express 5 + TypeScript (ESM) + PostgreSQL | `cd backend && npm run dev` (nodemon)                                                                               |
| `ai/`       | Python FastAPI + Google GenAI (Gemini)    | `cd ai && ./venv/Scripts/activate && fastapi dev main.py`                                                           |

- **Lint (frontend):** `cd frontend && npm run lint` (eslint-config-expo). There is no test suite in any service.
- **Type-check (frontend):** `cd frontend && npx tsc --noEmit`. Note: an unrelated pre-existing error exists in `components/reading/question/questionOption.tsx` (missing `@/types/questions` module) — it is not caused by your changes.
- The backend runs TypeScript directly via Node's ESM loader, so **relative imports include the `.ts` extension** (e.g. `import DB from "../../db/db.ts"`). Match this in new backend files.

### Troubleshooting: `Cannot find module '@babel/...'` (or any hoisted transitive dep)

Seen on `expo-router/entry.js` and `app/(auth)/_layout.tsx` — the error appears in many unrelated files because Metro's Babel transform itself fails. Root cause was a **root `package-lock.json` that nested every `@babel/generator` copy under individual packages and had no top-level `node_modules/@babel/generator` entry**. `npm ci` installs exactly what the lockfile says, so reinstalling reproduced the gap. Fix: delete `node_modules`, `package-lock.json` and any stray `frontend/package-lock.json`, run `npm install` at the repo root to regenerate a consistent lockfile, then `npx expo start --clear` from `frontend/`. Verify with `Test-Path node_modules\@babel\generator`. `npm ci` cannot repair a bad lockfile — regenerate it with `npm install`.

## Request flow / architecture

A single user action can cross all three services. Example — submitting a writing essay:

```
frontend (useWritingStore.submitEssay)
  → POST /api/writing                         [backend, behind auth middleware]
    → POST {FASTAPI_URL}/ai/writing/analysis  [ai service grades the essay with Gemini]
    → DB().transaction(...)                    [persist writing_results + users_writing]
  ← scores + revised essay + feedback
```

The **backend is the only service the frontend talks to.** The `ai/` FastAPI service is private and called server-to-server from backend controllers via `backend/src/api/api.ts` (an axios client pointed at `FASTAPI_URL`). The frontend never calls FastAPI directly.

### Backend layering (`backend/src`)

- `index.ts` mounts two routers: `/auth` (public) and `/api` (everything else).
- **`/api` is globally guarded** — `routes/api/api.routes.ts` applies `authenticateToken` before mounting `question` and `writing` sub-routers, so every `/api/*` route requires a valid access token and populates `req.user`. Auth routes under `/auth` are deliberately outside this guard.
- Routes validate input with `express-zod-safe`'s `validate({ body|query|params })` using schemas in `schemas/`. Controllers assume input is already validated.
- All DB access goes through `db/db.ts` — `DB().query(...)` for single statements and `DB().transaction(async (client) => ...)` for multi-statement atomic writes (used wherever more than one table is written, e.g. writing analysis). It maps Postgres error codes to `ApiError` with appropriate HTTP statuses.
- Controllers never send error responses directly: they `next(e)`, and `middleware/errorHandler.ts` formats the response. Throw `ApiError(status, message)` for expected failures.
- Every response follows the discriminated-union `ApiResponse<T>` shape (`types/ApiResponse.ts`): `{ status: "success", data, ... }` or `{ status: "error", ... }`. The frontend keys off `res.data.status === "success"`.

### Frontend structure (`frontend`)

- **Routing is file-based (expo-router).** `app/_layout.tsx` is the auth gate: it calls `useAuthStore.initialize()` on mount and uses `<Stack.Protected guard={...}>` to render the `(auth)` stack vs `(tabs)` stack based on `isLoggedIn`. **Navigation is driven declaratively by `isLoggedIn` — flipping it to `false` (e.g. via `logout()`) automatically returns the user to the login screen; there is no manual redirect.** Route groups: `(auth)`, `(tabs)` (bottom tabs: home/reading/writing/speaking/profile), and the full-screen flows `(reading)` and `(writing)`.
- **State lives in Zustand stores** (`store/`), one per domain (`useAuthStore`, `useWritingStore`, `useWritingHistory`, `useQuizStore`, etc.). Stores own all async/API logic and return a `ZustandResponse` (`{ success, errorType?, data? }`) rather than throwing. Components stay presentational and read/dispatch from stores.
- **`api/api.ts` is the axios instance** used for all authenticated calls. A request interceptor attaches `accessToken` from `useAuthStore`; a response interceptor handles `401` by attempting a refresh via `useAuthStore.refreshAccessToken()` and, on failure, calls `logout()` (→ redirect to login). Auth endpoints themselves use plain `axios` (not this instance) to avoid interceptor recursion.
- **Error handling convention:** stores wrap calls in `try/catch` and `return handleError(e)`. `handleError` distinguishes "custom" (already-normalized) errors from unknown ones and returns a `ZustandResponse`; UI-facing side effects (alerts) live in `handleErrorSideEffects` / `showErrorAlert`.
- **Path alias `@/*` maps to the `frontend/` root** (`tsconfig.json`). Components are re-exported through the barrel `components/index.ts`; import shared components from `@/components`.
- **Styling:** React Native `StyleSheet` only (no CSS framework). Use the design tokens in `constants/Variables.ts` (colors, radii) rather than hard-coded hex values; user-facing strings are Japanese.

### Auth token model (spans frontend + backend)

- Login returns an access token (1h) and a refresh token (30d). Refresh tokens are persisted server-side in the `refresh_tokens` table and validated on refresh/logout; logout sets `is_revoked = TRUE`.
- On the frontend, the access token, refresh token, and their client-computed expiries are stored together as a single `token-data` blob in `expo-secure-store`, and mirrored into `useAuthStore` state. The store keeps memory and secure-store in sync via `setTokenData` (memory) + `persistTokenData` (storage); `clearSession` tears both down on logout. `initialize()` rehydrates from storage on app launch and proactively refreshes an expired access token.

## Data & schemas

- Database is PostgreSQL; the backend connects via `pg` using the single `DATABASE_URL` connection string (the old `DB_*` vars are no longer read).
- Domain types are duplicated per service (`backend/src/types/`, `frontend/types/`, and the FastAPI Pydantic models in `ai/main.py`). When changing a shared payload (e.g. the writing-analysis request/response), update all three so the cross-service contract stays aligned.

## Environment variables (not committed)

Each service ships a committed `.env.example` — copy it to `.env` and fill it in. `.env*` is gitignored except `.env.example` (and `.env.test.example` in the backend).

- **frontend:** `EXPO_PUBLIC_API_HOST` (backend host, no scheme or port; falls back to the Metro `hostUri` in dev; `Links.ts` throws if neither is set), `EXPO_PUBLIC_PORT` (default `3000`). Used by `constants/Links.ts` to build the backend base URL — must point at the running backend, including for physical-device testing over LAN.
- **backend:** all env access goes through `src/config/env.ts`, which validates `process.env` with zod at import time and exports a typed `env`. Never read `process.env` directly elsewhere. Variables: `NODE_ENV` (`development|production|test`, required), `PORT` (default `3000`), `DATABASE_URL` (required), `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` (required), `ACCESS_TOKEN_EXPIRATION` (default `1h`), `REFRESH_TOKEN_EXPIRATION` (default `30d`), `FASTAPI_URL` (required; use `127.0.0.1`, not `localhost`, since uvicorn binds IPv4 only).
- **backend tests:** `npm test` loads `backend/.env.test` (via `dotenv -e .env.test`) so tests hit a separate test database, never the dev one.
- **ai:** `GEMINI_KEY`.
