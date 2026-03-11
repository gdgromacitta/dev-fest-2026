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
