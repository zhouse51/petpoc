# PetPOC

Next.js 15 + React 19 + TypeScript scaffold for a Clerk-authenticated frontend and Vercel Function-backed REST API.

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

Open `http://localhost:3000`. After login, the index page calls `GET /echo` with the Clerk JWT bearer token and displays the authenticated user name/email returned by the backend. `GET /api/echo` is also available as a Next.js API-style alias.

## Environments

- `DEV`: local development, represented by `.env.local` and `.env.development.example`.
- `STAGE`: create a Vercel preview or dedicated staging project and set the values from `.env.stage.example`.
- `PROD`: set production values in Vercel using `.env.production.example` as the checklist.

Do not commit real Clerk secret keys. Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and the Clerk redirect URLs separately for each Vercel environment.
