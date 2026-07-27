# DevFest Guide API

Isolated FastAPI and Pydantic AI backend for the DevFest Roma wolf mascot.

## Local development

From the repository root:

```bash
npm run dev:guide
```

The service listens on `http://127.0.0.1:8000`; its health endpoint is
`/api/guide/health`.

The root `.env` file is loaded by the npm script and is ignored by Git.

## Environment

```text
OPENAI_API_KEY
OPENAI_MODEL
GUIDE_ALLOWED_ORIGINS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
LOGFIRE_TOKEN
LOGFIRE_ENVIRONMENT
```

In Vercel, create a separate project with this directory as its Root Directory. Upstash is
mandatory when `VERCEL_ENV` is `preview` or `production`.
