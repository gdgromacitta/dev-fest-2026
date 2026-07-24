# DevFest Roma 2026

Static Next.js website for DevFest Roma 2026, published to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

The optional DevFest guide uses an isolated FastAPI/Pydantic AI backend:

```bash
npm run dev:all
```

The root `.env` file is ignored by Git and can provide the backend's local `OPENAI_API_KEY`,
Logfire, and Upstash configuration. The static client calls `http://127.0.0.1:8000/api/guide`
in development.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run test:guide
npm run build
```

The implementation and deployment plan for the guide is documented in
[`docs/plans/2026-07-24-devfest-guide-mascot-implementation.md`](docs/plans/2026-07-24-devfest-guide-mascot-implementation.md).
