# Mobile Sync Setup

This repo can receive data from `ecodiab-mobile` through `POST /api/mobile-sync`.

## Required Vercel environment variables

- `GITHUB_TOKEN`: Personal access token with `repo` scope
- `GITHUB_SYNC_REPO`: `sobri3195/EcoDiab-`
- `GITHUB_SYNC_BRANCH`: `main`
- `GITHUB_SYNC_DATA_PATH`: `data/mobile-inputs.json`
- `ENABLE_GITHUB_ISSUES`: `true`

## Mobile app environment variable

Set in `ecodiab-mobile`:

- `VITE_ECODIAB_SYNC_URL=https://your-ecodiab-domain.vercel.app/api/mobile-sync`

## Behavior

Each successful mobile save will:

1. append a sanitized record into `data/mobile-inputs.json`
2. create a GitHub Issue log in this repo

Image blobs are intentionally excluded so the repository stays lightweight.
