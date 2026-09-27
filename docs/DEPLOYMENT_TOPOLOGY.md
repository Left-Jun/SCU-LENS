# SCU LENS Deployment Topology

Updated on 2026-09-28 for the current SCU LENS deployment projects.

## Publishing topology

A push to GitHub `main` fans out into two independent static-site deployments:

1. **EdgeOne Makers / Pages** -> `sculens.leftjun.com`
2. **Vercel** -> `scu-lens.vercel.app`

The custom domain currently resolves directly to the EdgeOne Pages/Makers domain. Any separate H1 / acceleration layer is treated only as an acceleration layer, not as the source publishing platform.
GitHub remains the source repository and automatic deployment trigger source. GitHub Pages is intentionally not part of the active publishing topology.

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
- GitHub App used for automatic push delivery: `EO Makers`
- GitHub App repository access is **Only select repositories**; `Left-Jun/SCU-LENS` must be explicitly selected alongside the personal-site repository. If SCU-LENS is omitted, manual EdgeOne builds can still clone the repository while Git push will not trigger automatic deployment.
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

## Verification rule

A deployment change is not considered complete merely because `git push` succeeds. After each deployment-related change, verify the EdgeOne production deployment and the Vercel mirror.

The repository keeps local/manual deployment checks:

- `npm run check:deploy-config` validates the shared Astro/Vercel build contract.
- `npm run check:live` checks EdgeOne and Vercel with retries. It verifies the homepage identity, the gallery route, the generated stylesheet, and a real image asset.
- Node is pinned to `22.21.1` for deployment consistency. This satisfies the current Astro/Vite/Undici engine floor while staying on Node 22 LTS, and matches the available EdgeOne runtime.
