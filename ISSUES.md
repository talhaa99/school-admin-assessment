# Issues Fixed

Skipped Problem 3 (blockchain) & Problem 4 (Go).

---

## #001 — Backend hangs on :5007

**Problem:** `npm start` says server is running, but browser/curl hang with no response.

**Cause:** On startup, [`department-module.js`](backend/src/modules/departments/department-module.js) called an external API and [`apiErrorHandler.js`](backend/src/utils/apiErrorHandler.js) ran that payload with `Function.constructor`. That injected code broke Express so TCP connected but nothing was returned.

**How we fixed it:**
1. Removed the remote fetch/eval — module is a safe no-op now.
2. Same for [`apiErrorHandler.js`](backend/src/utils/apiErrorHandler.js).
3. Export department helpers normally from [`department-service.js`](backend/src/modules/departments/department-service.js) (no wrapper).
4. Dropped unused remote URL constants from [`constants/index.js`](backend/src/constants/index.js).

After that, `:5007` responds again (e.g. 404 JSON on `/`).

---

## #002 — Problem 1: Notice description not saved

**Problem:** Add Notice → fill description → Save → description not stored.

**Cause:** Schema/API use `description`, but the Description input used `register('content')`, so the value never went into the submit payload under the right key.

**How we fixed it:**
1. [`notice-form.tsx`](frontend/src/domains/notice/components/notice-form.tsx) — bind with `register('description')`.
2. [`add-notice-page.tsx`](frontend/src/domains/notice/pages/add-notice-page.tsx) — default state `description: ''` (was `content`).

Same naming as the edit page, so create/update stay consistent.

---

## #003 — Problem 2: Student CRUD

**Problem:** README asked to complete student CRUD. Routes were already there, but [`students-controller.js`](backend/src/modules/students/students-controller.js) handlers were empty (`//write your code`), so nothing worked.

**How we fixed it:**
Service and repository were already done — I only filled the controller, same style as staffs:
- **List** — read filters from query (`name`, `class`, `section`, `roll`), map `class` → `className`, call `getAllStudents`, return `{ students }`
- **Add** — pass `req.body` to `addNewStudent`
- **Get one** — `id` from params → `getStudentDetail`
- **Update** — body + `userId` from params → `updateStudent`
- **Status** — body `status` + reviewer from `req.user` → `setStudentStatus`

**Also faced while testing:** add student hanging, error toast showing `null`, empty section FK errors, and roll needing to be a number — I fixed those as well so Add Student works end to end.

---

## #005 — Problem 5: Docker

**Problem:** Need frontend + backend + Postgres in Docker, with seed from `seed_db`, one command to run.

**How we fixed it:**
- [`backend/Dockerfile`](backend/Dockerfile) — Node, port 5007  
- [`frontend/Dockerfile`](frontend/Dockerfile) — Vite on `0.0.0.0:5173`  
- [`docker-compose.yml`](docker-compose.yml) — `postgres`, `backend`, `frontend`

Postgres mounts [`tables.sql`](seed_db/tables.sql) then [`seed-db.sql`](seed_db/seed-db.sql) into `/docker-entrypoint-initdb.d` so first start creates schema + seed. Backend uses `DATABASE_URL` host `postgres` (Docker DNS). Browser still hits `localhost:5007` via `VITE_API_URL`.

```bash
docker-compose up --build
```
UI `:5173` · API `:5007`
