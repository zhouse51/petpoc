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

Optional GitHub environment variable:

- `VERCEL_DEV_ALIAS`, for example `petpoc-dev.vercel.app`

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
5. Add a stable DEV domain or alias in Vercel, then set `VERCEL_DEV_ALIAS` in the GitHub `DEV` environment variables.
6. Push to `main` or run the `Deploy DEV to Vercel` workflow manually.

Vercel uses `preview` as the non-production deployment target. In this project, that Preview target is treated as `DEV` until `STAGE` and `PROD` workflows are added.

## Clerk Session Notes

Use the stable DEV alias when testing auth. Do not bookmark the one-off deployment URL emitted by `vercel deploy`, because each deployment can have a different hostname and Clerk session cookies are scoped by hostname. A changing hostname makes the browser look signed out and sends the user through Google again.

For DEV on Vercel Preview, use Clerk development keys with the Vercel Preview environment. If you later move DEV to a custom domain with production Clerk keys, configure the matching domain and social connection redirect settings in Clerk.

To keep users signed in for 15 days, configure the Clerk instance used by DEV:

1. Open Clerk Dashboard.
2. Go to Sessions.
3. Enable Maximum lifetime.
4. Set Maximum lifetime to 15 days.
5. Save the change.

Clerk controls maximum session lifetime at the instance level. The login page keeps the "Keep me signed in for 15 days" option lightweight; the actual persisted session duration is enforced by the Clerk Sessions setting.
