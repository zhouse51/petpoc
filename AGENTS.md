# Workspace Rules

## Core Rules

- Do not commit or push changes unless the user explicitly asks.
- Keep changes scoped to the requested task.
- Use TypeScript throughout.
- Use arrow function definitions for TS/TSX functions.
- Add explicit return types to TS/TSX arrow functions.
- Shared types and validation models can live outside `src/app` and `src/services`, such as `src/models`.
- Backend/database access must stay in API routes and `src/services`.
- Frontend code must not has direct DB access or import Prisma or repository modules directly.
- Run validation after code changes when practical
- Do not commit real secret values.
- Keep API documentation in `openapi.yaml` in sync whenever adding, removing, or changing an API.
- Check available scripts in `package.json`
- Keep the necessary test scrips updated when add, edit code
- Run validation after code changes when practical:
  - `yarn test`
  - `yarn typecheck`
  - `yarn lint`
  - `yarn build`

## Agent Responses

- When implementing code, keep progress notes and final summaries concise.
- When answering questions, keep the answer simple.
- Provide detailed explanations only when the user asks for details.

## Project Structure

- Frontend code lives under `src/app`.
- API route entry points live under `src/app`.
- Backend/service logic lives under `src/services`.
- Repository/database code lives under `src/services/repositories`.
- Shared request/response schemas and types live under `src/models`.
- Unit tests live under `tests`.

## Frontend Conventions

- N/A

## API Conventions

- Clerk owns user authentication and JWT/session token issuance.
- Protected API calls must validate Clerk auth.
- Route files should be thin entry points and delegate to `src/services`.
- Keep business logic out of route files when reasonable.
- Use Zod schemas for request/response validation models where useful.
- Keep `openapi.yaml` in sync whenever adding a new API, removing an API, changing an API path/method/auth behavior, or changing request/response
- All API routes must start with `/api`.
