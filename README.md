# 🛡️ Safe-Stay — AI Accommodation Safety Platform for Students in India

[![CI](https://github.com/codewithshubham2706/safe_stay/actions/workflows/ci.yml/badge.svg)](https://github.com/codewithshubham2706/safe_stay/actions/workflows/ci.yml)

Safe-Stay helps students across India find verified, structurally-safe PGs & hostels.
Search **any city or locality in India** (Pune, Hyderabad, your own hometown…), see
Structural Vulnerability Index (SVI) safety grades on a live map, read student
audits, verify landlords, and trigger an emergency SOS network.

![stack](https://img.shields.io/badge/React-18-blue) ![stack](https://img.shields.io/badge/Vite-5-purple) ![stack](https://img.shields.io/badge/Express-4-green) ![stack](https://img.shields.io/badge/MongoDB-8-brightgreen)

## ✨ Features

- 🗺️ **India-wide spatial search** — autocomplete any place via OpenStreetMap, map flies there, listings load instantly (deterministic demo listings generated around any searched point so the map is never empty)
- 🛡️ **Structural Vulnerability Index (SVI)** — Grade A/B/C-D building safety scores with maintenance-deay tracking from 60–90 day student audits
- 🤖 **AI Concierge** — budget + gender + proximity preference matching with safety-aware scoring
- 🚨 **Emergency SOS** — 1 km burst broadcast to verified students, caretakers & police beat
- ✅ **Landlord AI verification** — government ID + tax document audit flow
- 👥 **Paid WhatsApp community gateway** — anti-spam single-use invites per locality
- 🌙 **Full dark/light theme** across every screen
- 🔒 **Privacy-first sessions** — sessionStorage-only on web, opt-in persistent "mobile" mode

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, Leaflet (Google tile layers), lucide-react |
| Backend | Node.js, Express 4, JWT auth, bcryptjs |
| Database | MongoDB (Mongoose 8) — works offline with seed/demo fallback engine |
| Geocoding | OpenStreetMap Nominatim (proxied + cached server-side) |

## 🤖 CI / CD

Every push to `main` (and every PR) runs the [GitHub Actions workflow](.github/workflows/ci.yml):

1. `npm ci` (with npm cache)
2. `npm run test:svi` — SVI/MDI calculator unit tests
3. `npm run build` — full production build
4. Uploads the built `dist/` as a workflow artifact (7 days)

A red ❌ badge means **don't deploy that commit**. To make deploys wait for CI:
- **Render**: *Settings → Build & Deploy → Pre-Deploy Command* (paid) or use a
  [Deploy Hook](https://render.com/docs/deploy-hooks) triggered from the Actions
  workflow after all steps pass.
- **Railway**: *Settings → Deploy conditions / Waits for CI* (Hobby plan) or
  trigger deploys with `railway up` from a CI job instead of auto-deploy.

## 🚀 Run locally

```bash
npm install
cp .env.example .env        # fill in values (works with defaults for dev)
PORT=5000 node server/index.js   # backend API on :5000
npm run dev                      # frontend on :3000 (proxies /api)
```

Open http://localhost:3000 and use any quick-demo login button.
No MongoDB? No problem — the API serves built-in seed data and generated demo
listings instantly (it auto-reconnects to the DB when one becomes available).

## 🧪 Tests

```bash
npm run test:svi
```

## 🐳 Docker (app + MongoDB in one command)

```bash
docker compose up -d --build   # serves on port 80
```

## ☁️ Deploy online (free tiers)

Full step-by-step guides for **Render** and **Railway** with **MongoDB Atlas**:
see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📁 Project structure

```
server/          Express API: routes, models, geo + demo-listing services
src/             React app: map discovery, navbar, modals, auth context
src/services/    API client with offline fallback engine
```
