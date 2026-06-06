# Deployment

This repository deploys DEV from GitHub Actions to Vercel Preview deployments.

Auth sessions depend on stable hostnames. Do not test sign-in from one-off Vercel deployment URLs such as `project-git-sha-team.vercel.app`; those hosts change and Clerk/Google treat them as separate sites. Always use the configured environment URL.

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
- `NEXT_PUBLIC_APP_URL`, for example `https://petpoc-dev.vercel.app`
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

## Auth Domains

Use a stable URL for every environment:

| Environment | URL requirement | Clerk keys | Google OAuth |
| --- | --- | --- | --- |
| DEV | Stable Vercel alias, for example `https://petpoc-dev.vercel.app` | Clerk development keys are OK | Clerk development Google connection is OK |
| STAGE | Stable stage hostname, preferably on a real domain, for example `https://stage.your-domain.com` | Use the Clerk instance intended for staging | If using production Clerk keys, configure custom Google OAuth credentials |
| PROD | Real production domain, not `*.vercel.app` | Clerk production keys | Custom Google OAuth credentials are required |

For every environment, set these values in Vercel:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/`

For STAGE and PROD, configure the matching domain in Clerk Dashboard before testing Google sign-in. For production Clerk instances, enable Google with custom credentials and add the Clerk-provided Authorized Redirect URI to the Google OAuth client.

## Clerk Session Notes

Use the stable DEV alias when testing auth. Do not bookmark the one-off deployment URL emitted by `vercel deploy`, because each deployment can have a different hostname and Clerk session cookies are scoped by hostname. A changing hostname makes the browser look signed out and sends the user through Google again.

For DEV on Vercel Preview, use Clerk development keys with the Vercel Preview environment. If you later move DEV to a custom domain with production Clerk keys, configure the matching domain and social connection redirect settings in Clerk.

The sign-in page includes a "Stay signed in on this device" preference above Clerk's Continue button. Checked uses Clerk's normal persisted session behavior. The app does not force sign-out on browser close; session lifetime is controlled by Clerk's Sessions settings and browser cookie policy.

If users see Google's account chooser every time on Vercel but not locally, check these in order:

1. They are opening the stable environment URL, not a one-off deployment URL.
2. The Vercel environment is using the Clerk keys for that exact environment.
3. The Clerk instance has the environment domain configured.
4. Production-style Clerk instances have Google custom OAuth credentials configured.
5. The user has not manually signed out and browser cookies are not being blocked.
