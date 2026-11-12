# Secure Notes Web

Plain React (Vite) client for the Secure Notes API. No UI kits or CSS frameworks.

- **Live URL:** `https://secure-notes-web-seven.vercel.app`
- **Backend:** `https://secure-notes-api-s8yy.onrender.com` (repo: https://github.com/monirul-islam7774/secure-notes-api). The free Render instance sleeps when idle, so the first request can take 30–50 s.

## Setup

```bash
npm i
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
npm run build            # output in dist/
```

The backend must allow this origin via its `CORS_ORIGIN` env var.

## Demo credentials

| Role  | Email          | Password  |
|-------|----------------|-----------|
| admin | admin@demo.com | Admin@123 |
| user  | alice@demo.com | User@123  |
| user  | bob@demo.com   | User@123  |

## Pages

| Route | Description |
|---|---|
| `/login`, `/register` | Authentication |
| `/notes` | My notes: paginated, create, inline edit, delete (confirm) |
| `/notes/:id` | Single note view |
| `/profile` | Edit name and interests (comma separated) |
| `/posts` | All posts (paginated) + create post |
| `/users/:id/posts` | A user's posts (backend `$lookup` aggregation) |
| `/interests` | Users grouped by interest (backend aggregation), optional filter |
| `/admin/users` | Admin: list, create, edit name/role, delete users |
| `/admin/notes` | Admin: everyone's notes with owner |

Route guards (`ProtectedRoute`, `AdminRoute`) are UI-level only; the API enforces roles. A 401 from the API clears the session and redirects to `/login`.

## CI/CD

`.github/workflows/ci-cd.yml` builds on every PR/push. Pushes to `main` that pass are deployed to Vercel with the Vercel CLI and smoke-tested (root and the `/notes` deep link). Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`; `VITE_API_URL` is set in the Vercel project's Production environment. Without the secrets the deploy job is skipped.

## Deploy

Vercel: framework Vite, build `npm run build`, output `dist`, env `VITE_API_URL=https://<render-app>.onrender.com/api` (redeploy after setting it). `vercel.json` and `public/_redirects` provide the SPA fallback for Vercel or Netlify.
