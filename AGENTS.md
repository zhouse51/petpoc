# PetPOC Project Instructions

## Core Rules

- Do not commit or push changes unless the user explicitly asks.
- Keep changes scoped to the requested task.
- Use TypeScript throughout.
- Use arrow function definitions for TS/TSX functions.
- Add explicit return types to TS/TSX arrow functions.
- Shared types and validation models can live outside `src/app` and `src/services`, such as `src/models`.
- Backend/database access must stay in API routes and `src/services`.
- Frontend code must not import Prisma or repository modules directly.
- Run validation after code changes when practical:
  - `yarn typecheck`
  - `yarn lint`
  - `yarn build`

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Clerk for authentication
- Vercel Functions / Next route handlers for backend APIs
- REST APIs
- Zod validation
- Prisma ORM
- Supabase PostgreSQL

## Project Structure

- Frontend code lives under `src/app`.
- API route entry points live under `src/app`.
- Backend/service logic lives under `src/services`.
- Repository/database code lives under `src/services/repositories`.
- Shared request/response schemas and types live under `src/models`.
- Prisma schema lives at `prisma/schema.prisma`.
- Prisma config lives at `prisma.config.ts`.

## Authentication

- Clerk owns user authentication and JWT/session token issuance.
- Protected API calls must validate Clerk auth using `auth({ acceptsToken: "session_token" })`.
- Frontend API calls to protected endpoints must include:

```http
Authorization: Bearer <Clerk session token>
```

- The signed-in page is protected server-side and redirects unauthenticated users to Clerk sign-in.
- The app currently uses Clerk default auth UI with light customization.
- The user menu customizes "Manage account" to "My Profile".
- The user menu includes a custom no-op item: "Do whatever Brian wants".
- Clerk development mode warning disappears only when using production Clerk keys.

## API Conventions

- Route files should be thin entry points and delegate to `src/services`.
- Keep business logic out of route files when reasonable.
- Use Zod schemas for request/response validation models where useful.
- Keep `openapi.yaml` in sync whenever adding a new API, removing an API,
  changing an API path/method/auth behavior, or changing request/response
  definitions.
- All API routes must start with `/api`.
- Current API routes include:
  - `GET /api/v1/echo`
  - `POST /api/v1/users/register`
  - `GET /api/v1/users/{clerk_user_id}`
- The GET user API only allows the authenticated Clerk user to fetch their own row.

## Database And Prisma

- Prisma Client is initialized in `src/services/repositories/client.ts`.
- Repository functions live in `src/services/repositories`.
- The current DB models were introspected from Supabase with `prisma db pull`.
- Runtime app DB access uses `DATABASE_URL`.
- Prisma CLI commands prefer `DATABASE_DIRECT_URL` when available.
- `DATABASE_DIRECT_URL` is local/admin tooling only unless deployment runs Prisma migrations.
- `DATABASE_PWD` may be used to fill password placeholders in DB URLs.
- Supported password placeholders:
  - `[YOUR-PASSWORD]`
  - `${DATABASE_PWD}`
  - `{DATABASE_PWD}`
- For Supabase:
  - `DATABASE_URL` can use the transaction pooler on port `6543` for Vercel/serverless runtime.
  - `DATABASE_DIRECT_URL` can use the session pooler on port `5432` for Prisma CLI commands.
- Run `yarn prisma:generate` after changing `prisma/schema.prisma`.
- `yarn build` already runs `prisma generate && next build`.

## Environment And Deployment

- DEV, STAGE, and PROD have separate env example files.
- Do not commit real secret values.
- Required Vercel runtime DB env vars:
  - `DATABASE_URL`
  - `DATABASE_PWD` when the URL has a password placeholder
- `DATABASE_DIRECT_URL` is not required on Vercel runtime unless deployment runs Prisma CLI migration commands.
- Use stable environment URLs for Clerk/Google OAuth testing.
- Avoid one-off Vercel deployment URLs for auth testing because cookies are hostname-scoped.
- DEV can use a stable Vercel alias such as `https://petpoc-dev.vercel.app`.
- STAGE/PROD should use stable real domains where possible.
- Production Clerk + Google OAuth requires the proper domain and custom Google OAuth credentials configured in Clerk/Google.

## Frontend Behavior

- After login, the home page calls `GET /api/v1/echo` with the Clerk token.
- After login, the home page calls `POST /api/v1/users/register`.
- After login, the home page calls `GET /api/v1/users/{clerk_user_id}`.
- Display echo data near the top of the page as:

```text
Echo: xxxx, xxxx
```

- Display DB user data below it as:

```text
User from DB: xxxx, xxxx
```

## Coding Style

- Prefer existing project patterns.
- Use arrow functions in TS/TSX.
- Add explicit return types to functions and callbacks where practical.
- Use repository functions for DB access.
- Keep route handlers small.
- Keep UI simple and consistent with the current Tailwind/shadcn-style components.
- Do not add direct DB imports to frontend components.
- If Prisma types look stale, run:

```bash
yarn prisma:generate
```

- If VS Code still shows stale Prisma/TypeScript errors, restart the TypeScript server from VS Code Command Palette:

```text
TypeScript: Restart TS Server
```

## Useful Commands

```bash
yarn dev
yarn typecheck
yarn lint
yarn build
yarn prisma:generate
yarn prisma:validate
yarn prisma db pull
yarn prisma:deploy
```
