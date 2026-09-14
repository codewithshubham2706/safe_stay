# ☁️ Deploying Safe-Stay — Render & Railway with MongoDB Atlas

This app is **one Node process** in production: Express serves both the API
(`/api/*`) and the built React frontend from `dist/`. You deploy a single
web service and point it at a MongoDB Atlas cluster.

Architecture:

```
Browser ──> Render/Railway web service (Express, port from $PORT)
                  │
                  ├──> MongoDB Atlas (users, hostels, audits)
                  └──> OpenStreetMap Nominatim (place search, no key needed)
```

---

## Part 0 — Create the MongoDB Atlas cluster (do this first, ~5 min)

You need the connection string before touching Render/Railway.

1. Go to **https://www.mongodb.com/cloud/atlas/register** and sign up (free).
2. Create a **free M0 cluster** (512 MB — plenty for 1000+ users' accounts).
   - Choose the **closest region** to your expected users (e.g. Mumbai `ap-south-1`).
   - Leave all other defaults and click **Create Deployment**.
3. **Database user**: Atlas prompts you to create one. Set a username and a
   strong password — **save the password**, you'll paste it into the URI later.
4. **Network access**: go to *Network Access → Add IP Address → Allow access
   from anywhere* (`0.0.0.0/0`). Render/Railway run on shared infrastructure
   without static IPs, so this is required (your JWT + rate limiting protect
   the app itself).
5. **Get the connection string**: *Database → Connect → Drivers → Node.js*.
   It looks like:
   ```
   mongodb+srv://myuser:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<db_password>` with your real password and add the database name
   before the `?`:
   ```
   mongodb+srv://myuser:MyStr0ngPass@cluster0.xxxxx.mongodb.net/safestay?retryWrites=true&w=majority
   ```
   This full string is your **`MONGO_URI`** — keep it handy for both platforms.

> Optional: seed the flagship demo listings (Kota/Delhi/Bengaluru) by running
> `MONGO_URI=<the same string> npm run seed` once from your laptop.

---

## Part A — Deploy on Render (free tier)

### A1. Push the repo (already done)
Code is at `https://github.com/codewithshubham2706/safe_stay` (branch `main`).

### A2. Create the Web Service
1. Go to **https://dashboard.render.com** → sign in with GitHub → **Authorize Render**.
2. Click **New + → Web Service**.
3. Pick the `codewithshubham2706/safe_stay` repository from the list → **Connect**.
4. Fill in the form:
   | Field | Value |
   |---|---|
   | **Name** | `safe-stay` (this becomes `safe-stay.onrender.com`) |
   | **Region** | Singapore (closest free region to India) |
   | **Branch** | `main` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `node server/index.js` |
   | **Instance Type** | Free (spin down after inactivity; cold start ~30 s) |
5. Open **Environment** and add these variables:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your Atlas string from Part 0 |
   | `JWT_SECRET` | any long random string (e.g. generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`) |
   | `RATE_LIMIT_MAX` | `100` (free tier IPs are shared per region, be generous) |
   | `RATE_LIMIT_WINDOW_MS` | `600000` |
6. Click **Create Web Service**. First deploy takes ~3–5 minutes (installs,
   builds the frontend, starts Express).
7. Watch the logs — you should see:
   ```
   🚀 Safe-Stay Server active on http://localhost:10000
   ✅ Connected to MongoDB Database with pool size 50
   ```
8. Open `https://safe-stay.onrender.com` → you should see the login screen.
   Use a quick-demo button, then search "Pune" on the map. 🎉

### A3. Render specifics worth knowing
- **`PORT` is injected automatically** by Render — the app already uses
  `process.env.PORT`, don't set it manually.
- **Custom domain** (optional): *Settings → Custom Domains* — add your domain,
  Render issues free TLS.
- **Free tier sleeps** after 15 min idle; the first visitor after that waits
  ~30 s. Upgrade to a paid instance (or ping it with a cron monitor like
  UptimeRobot) to avoid this for real users.
- **Auto-deploy**: every `git push` to `main` redeploys automatically.

---

## Part B — Deploy on Railway

### B1. Create the project
1. Go to **https://railway.app** → **Login with GitHub**.
2. Click **New Project → Deploy from GitHub repo**.
3. Select `codewithshubham2706/safe_stay`. Railway auto-detects Node and runs
   `npm install && npm run build` — but set it explicitly anyway:
4. Open the service → **Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - Enable **Check Health Path** = `/health`
5. **Settings → Networking → Generate Domain** → accept the suggested name
   (e.g. `safe-stay-production.up.railway.app`). Railway injects `PORT` too.

### B2. Variables
Open the service → **Variables** and add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas string from Part 0 |
| `JWT_SECRET` | long random string |
| `RATE_LIMIT_MAX` | `100` |
| `RATE_LIMIT_WINDOW_MS` | `600000` |

The service redeploys automatically when variables change.

### B3. Verify
Open the generated domain → login screen → demo login → search any Indian city.
Check **Deployments → View Logs** for the `✅ Connected to MongoDB` line.

### B4. Railway specifics worth knowing
- **Hobby plan** includes $5/month of usage — this app idles at ~0.2 vCPU so
  it comfortably runs 24/7 within that for a small user base.
- **Scaling**: *Settings → Replicas* to run multiple instances. Rate limiting
  is per-instance (in-memory), so with 2+ replicas behind Railway's load
  balancer the effective limit multiplies — fine for abuse protection.
- **Custom domain**: *Settings → Networking → Custom Domain*, free TLS included.

---

## Part C — Post-deploy checklist (both platforms)

1. **Health check**: `curl https://YOUR-APP-URL/health` → `{"status":"HEALTHY",...}`
2. **DB connected**: register a test account via the app (or
   `curl -X POST https://YOUR-APP-URL/api/auth/register -H "Content-Type: application/json"
   -d '{"fullName":"Test","email":"t1@x.com","password":"secret123","role":"student","gender":"Male"}'`)
   — then see the user in **Atlas → Browse Collections → userprofiles**.
3. **Search works**: search "Pune" / "Hyderabad" on the map — listings appear.
4. **Place search rate**: Nominatim (free OSM service) allows ~1 req/s. The
   backend caches results for 24 h, so normal usage is fine. If your user base
   grows large, register a free MapTiler/Geocode key and swap it into
   `server/services/geoService.js`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Logs show `MongoServerError: bad auth` | Wrong Atlas password in `MONGO_URI` — URL-encode special chars (`@`→`%40`) |
| `connection timed out` to Atlas | Network Access list missing `0.0.0.0/0` (Part 0 step 4) |
| Map tiles load but no listings | Check `/api/hostels/search?lat=18.5&lng=73.8` directly — should return JSON with `dataSource` |
| 429 errors on login | Raise `RATE_LIMIT_MAX` (shared free-tier IPs hit the bucket fast) |
| First request after idle is slow | Free-tier cold start; upgrade instance or use an uptime pinger |
