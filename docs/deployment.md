# Deployment

This repository deploys DEV from GitHub Actions to Vercel Preview deployments.

## DEV

Workflow: `.github/workflows/deploy-dev.yml`

Triggers:

- Push to `main`
- Manual `workflow_dispatch`

GitHub environment:

- `DEV`

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Required Vercel Preview environment variables:

- `NEXT_PUBLIC_APP_ENV=DEV`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/`

## Setup Checklist

1. In Vercel, import or link this GitHub repository to a Vercel project.
2. Add the Clerk DEV keys to the Vercel project under the Preview environment.
3. Create a Vercel access token.
4. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to GitHub repository secrets or to the `DEV` environment secrets.
5. Push to `main` or run the `Deploy DEV to Vercel` workflow manually.

Vercel uses `preview` as the non-production deployment target. In this project, that Preview target is treated as `DEV` until `STAGE` and `PROD` workflows are added.
