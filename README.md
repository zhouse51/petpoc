# PetPOC

Next.js 15 + React 19 + TypeScript scaffold for a Clerk-authenticated frontend and Vercel Function-backed REST API.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Clerk for authentication
- Vercel Functions / Next route handlers for backend APIs
- REST APIs documented in `openapi.yaml`
- Zod validation
- Prisma ORM
- Supabase PostgreSQL

## Local setup

1. Install dependencies:

```bash
yarn install
```

2. Copy the environment template:

```bash
cp .env.local.example .env.local
```

3. Fill in the Clerk keys in `.env.local`.

4. Run the app:

```bash
yarn dev
```

Open `http://localhost:3000`. After login, the index page calls `GET /api/v1/echo` with the Clerk JWT bearer token and displays the authenticated user name/email returned by the backend. It also calls the `/api/v1/users` endpoints to register and display the database user.

## Scripts

Available scripts are defined in `package.json`. Common scripts include:

```bash
yarn dev
yarn test
yarn typecheck
yarn lint
yarn build
```

## Environments

- `DEV`: local development, represented by `.env.local` and `.env.development.example`.
- `STAGE`: create a Vercel preview or dedicated staging project and set the values from `.env.stage.example`.
- `PROD`: set production values in Vercel using `.env.production.example` as the checklist.

Do not commit real Clerk secret keys. Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and the Clerk redirect URLs separately for each Vercel environment.

## Deployment

DEV deploys through GitHub Actions to Vercel Preview deployments. Use a stable DEV alias for auth testing so Clerk sessions survive across deployments. See `docs/deployment.md` for required GitHub secrets, optional alias config, and Vercel environment variables.

## Agent Instructions

Developers using Codex, Claude, or another coding agent should read `AGENTS.md` before making changes.

## Database

The backend uses Prisma for database access. Keep database calls inside `src/services` and API route handlers; frontend components should call APIs instead of importing Prisma directly.

Required environment variables:

```bash
DATABASE_URL=postgresql://user:[YOUR-PASSWORD]@host:5432/database?schema=public
DATABASE_DIRECT_URL=postgresql://user:[YOUR-PASSWORD]@host:5432/database?schema=public
DATABASE_PWD=replace-with-database-password
```

`DATABASE_URL` is used by the app at runtime. 
`DATABASE_DIRECT_URL` is optional and used by Prisma CLI commands when the runtime URL points at a pooler. You can also provide a complete URL with the password already included. If either URL contains 
`[YOUR-PASSWORD]`, `${DATABASE_PWD}`, or `{DATABASE_PWD}`, the backend and Prisma CLI will fill it from `DATABASE_PWD`.

Useful Prisma scripts are defined in `package.json`. Common Prisma scripts include:

```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:deploy
yarn prisma:studio
```
