# SCU LENS Deployment Topology

Verified on 2026-09-26 against the live configuration of `Left-Jun/Left-Jun.github.io` and the SCU LENS deployment projects.

## Publishing topology

A push to GitHub `main` fans out into three independent static-site deployments:

1. **EdgeOne Makers / Pages** -> `sculens.leftjun.com`
2. **Vercel** -> `scu-lens.vercel.app`
3. **GitHub Actions / Pages** -> `left-jun.github.io/SCU-LENS/`

The custom domain currently resolves directly to the EdgeOne Pages/Makers domain. Any separate H1 / acceleration layer is treated only as an acceleration layer, not as the source publishing platform.

## EdgeOne parity with the personal site

- Git provider: GitHub
- Production branch: `main`
- Framework preset: Astro
- Root directory: `./`
- Output directory: `apps/site/dist`
- Build command: `npm run build:site`
- Install command: `npm ci`
- Node.js setting: `22.11.0`
- Availability area: `overseas` / global excluding mainland China
- Production auto deployment: enabled
- Preview environment: all unassigned Git branches; auto deployment disabled
- Environment variables: none
- Deployment hooks: none
- EdgeOne zone: same live zone as the personal project
- Adaptive rate limiting: enabled; 2000 requests / 5 seconds per visitor; loose adaptive mode; JavaScript challenge action
- Custom security rules: none
- Precise rate-limit rules: none
- Human verification: disabled
- AI crawler treatment: disabled/default
- DDoS protection: default enabled

Expected project-specific differences are limited to repository identity, project identity, custom domain, and deployment history.

## Vercel parity with the personal site

Repository `vercel.json` is intentionally aligned with the personal site:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "installCommand": "npm ci",
  "buildCommand": "npm run build:site",
  "outputDirectory": "apps/site/dist"
}
```

The Vercel dashboard currently shows the same `Hugo` framework-preset UI value on both projects; this is deliberately left unchanged because the repository config is the effective build configuration and parity with the personal site is the target.

## GitHub Pages parity with the personal site

`.github/workflows/astro-pages.yml` follows the personal site's workflow pattern:

- trigger on push to `main` and manual dispatch
- Node 22
- `npm ci`
- validation / checks
- `npm run build:site`
- upload `apps/site/dist`
- deploy with GitHub Pages

## Verification rule

A deployment change is not considered complete merely because `git push` succeeds. After each deployment-related change, verify the real production deployment and the public endpoint for all three paths.
