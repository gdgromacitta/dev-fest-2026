# Deployment

## Build Static Output
1. `npm install`
2. `npm run build`

Static files are generated in `out/` because `next.config.ts` sets `output: "export"`.

## Host Options
- Netlify: publish `out/`
- Vercel static: import repo and deploy static output
- GitHub Pages: upload `out/` as site artifact

## Pre-deploy Verification
- `npm run lint`
- `npm run test`
- `npm run build`

## DevFest Guide

The wolf guide is split into two independently deployable parts:

- the static client under `src/features/devfest-guide`;
- the FastAPI service under `services/devfest-guide-api`.

The public site keeps the guide disabled unless both repository variables are configured:

```text
NEXT_PUBLIC_DEVFEST_GUIDE_ENABLED=true
NEXT_PUBLIC_DEVFEST_GUIDE_API_URL=https://<guide-api-domain>/api/guide
```

These values are public build configuration, not secrets.

Deploy the API as a separate Vercel project with `services/devfest-guide-api` as its Root
Directory. Configure the following server-side values in Vercel:

```text
OPENAI_API_KEY
OPENAI_MODEL
GUIDE_ALLOWED_ORIGINS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
LOGFIRE_TOKEN
LOGFIRE_ENVIRONMENT
```

`GUIDE_ALLOWED_ORIGINS` must contain the exact public site origin. Upstash credentials are
required in Preview and Production. Chat content is excluded from Logfire by default.

Before enabling the guide:

1. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
2. Run `npm run test:guide`.
3. Verify `<api-url>/api/guide/health`.
4. Test one Italian and one English streamed conversation.
5. Confirm the API project ownership, privacy copy, mascot branding, and DNS with a maintainer.
