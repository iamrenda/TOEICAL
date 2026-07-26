# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

TOEICAL is an English-learning app for Japanese speakers (UI copy is in Japanese), built around three modes: Reading (TOEIC questions), Writing (AI-graded essays), and Speaking (planned). The repo is a monorepo of independent services, each with its own dependencies and run command.

## Services & how to run them

There is no root-level build/test orchestration — each service is started independently in its own terminal.

| Dir         | Stack                                     | Dev command                                                                                                         |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `frontend/` | React Native + Expo (expo-router)         | `cd frontend && npm run dev` (`npm run ios` / `android` / `web` for a target; `npm run clear` to reset Metro cache) |
| `backend/`  | Express 5 + TypeScript (ESM) + PostgreSQL | `cd backend && npm run dev` (nodemon)                                                                               |
| `ai/`       | Python FastAPI + Google GenAI (Gemini)    | `cd ai && ./venv/Scripts/activate && fastapi dev main.py`                                                           |

- **Lint (frontend):** `cd frontend && npm run lint` (eslint-config-expo). There is no test suite in any service.
- **Type-check (frontend):** `cd frontend && npx tsc --noEmit`. Note: an unrelated pre-existing error exists in `components/reading/question/questionOption.tsx` (missing `@/types/questions` module) — it is not caused by your changes.
- The backend runs TypeScript directly via Node's ESM loader, so **relative imports include the `.ts` extension** (e.g. `import DB from "../../db/db.ts"`). Match this in new backend files.

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

- Database is PostgreSQL; the backend connects via `pg` using `DB_*` env vars.
- Domain types are duplicated per service (`backend/src/types/`, `frontend/types/`, and the FastAPI Pydantic models in `ai/main.py`). When changing a shared payload (e.g. the writing-analysis request/response), update all three so the cross-service contract stays aligned.

## Environment variables (not committed)

- **frontend:** `EXPO_PUBLIC_IP`, `EXPO_PUBLIC_PORT` (used by `constants/Links.ts` to build the backend base URL — must point at the running backend, including for physical-device testing over LAN).
- **backend:** `PORT`, `DB_USER`/`DB_HOST`/`DB_DATABASE`/`DB_PASSWORD`/`DB_PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `FASTAPI_URL`.
- **ai:** `GEMINI_KEY`.
