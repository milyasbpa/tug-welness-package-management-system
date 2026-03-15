# TUG Wellness Package Management System

Full-stack submission for the **TUG Full Stack Developer (Dart & TypeScript) Technical Assessment**.

The system is structured as a **monorepo** containing three independent sub-projects:

| Directory | Role | Stack |
|---|---|---|
| [`/backend`](./backend/README.md) | REST API | NestJS · TypeScript · PostgreSQL · Prisma |
| [`/admin-portal`](./admin-portal/README.md) | Admin web interface | Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui |
| [`/mobile-app`](./mobile-app/README.md) | User mobile app | Flutter · Dart |

---

## Architecture Overview

```
┌─────────────────────────┐     ┌────────────────────────┐
│     Admin Portal        │     │      Mobile App         │
│  Next.js · :3000        │     │      Flutter            │
│  /admin/packages (CRUD) │     │  /mobile/packages (read)│
└───────────┬─────────────┘     └──────────┬─────────────┘
            │  JWT (httpOnly cookie)        │  JWT (Bearer)
            │                              │
            ▼                              ▼
     ┌──────────────────────────────────────────┐
     │           Backend API · :4000            │
     │   NestJS · /api/v1                       │
     │   POST /auth/login · /auth/refresh       │
     │   GET|POST|PUT|DELETE /admin/packages    │
     │   GET /mobile/packages                   │
     └──────────────────────┬───────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   PostgreSQL    │
                   │    :5432        │
                   └─────────────────┘
```

---

## Monorepo Structure

```
tug-welness-package-management-system/
├── .gitignore               # Root gitignore — covers all 3 sub-projects
├── .nvmrc                   # Node 22.22.0
├── commitlint.config.ts     # Conventional commit rules (applied at root)
├── lefthook.yml             # Git hooks config — pre-commit + commit-msg
├── package.json             # Root devDeps: lefthook + @commitlint
│
├── backend/                 # NestJS API → see backend/README.md
├── admin-portal/            # Next.js Admin Portal → see admin-portal/README.md
└── mobile-app/              # Flutter Mobile App → see mobile-app/README.md
```

Each sub-project has its own `package.json` (or `pubspec.yaml` for Flutter), its own dependencies, and its own run scripts — they are **independent** and do not share node_modules.

---

## Prerequisites

| Tool | Version | Used by |
|---|---|---|
| Node.js | `22.22.0` (see `.nvmrc`) | backend, admin-portal |
| npm | `>=10` | backend, admin-portal |
| Flutter | `>=3.x stable` | mobile-app |
| Dart | `>=3.2.5` | mobile-app |
| Docker & Docker Compose | any recent | backend (local DB) |

---

## Quick Start

### 1. Clone & install root dev tools

```bash
git clone <repo-url>
cd tug-welness-package-management-system

nvm use          # switch to Node 22.22.0
npm install      # installs lefthook + commitlint, then runs "lefthook install"
```

`npm install` at root automatically runs `lefthook install`, which registers the `pre-commit` and `commit-msg` hooks into `.git/hooks/`.

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env.development   # fill in DB credentials
docker compose up -d               # spin up PostgreSQL
npm run migration:dev              # run Prisma migrations
npm run seed                       # seed initial data
npm run start:dev                  # starts on http://localhost:4000
```

→ Full details: [backend/README.md](./backend/README.md)

### 3. Start the Admin Portal

```bash
cd admin-portal
npm install
cp .env.example .env               # set NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                        # starts on http://localhost:3000
```

→ Full details: [admin-portal/README.md](./admin-portal/README.md)

### 4. Run the Mobile App

```bash
cd mobile-app
flutter pub get
cp .env.example .env.dev           # set API base URL
flutter run --flavor dev --dart-define-from-file=.env.dev
```

→ Full details: [mobile-app/README.md](./mobile-app/README.md)

---

## Git Hooks

Hooks are managed by **[Lefthook](https://github.com/evilmartians/lefthook)** from the monorepo root. They are automatically installed when you run `npm install` at root.

### `pre-commit`

Runs in parallel, triggered only on staged files matching the relevant glob:

| Command | Glob | What it does |
|---|---|---|
| `backend-lint` | `backend/**/*.{ts,js}` | runs `lint-staged` in `backend/` |
| `admin-lint` | `admin-portal/**/*.{ts,tsx,...}` | runs `lint-staged` in `admin-portal/` |
| `mobile-format` | `mobile-app/lib/**/*.dart` | `dart format --set-exit-if-changed` |
| `mobile-analyze` | `mobile-app/**/*.dart` | `flutter analyze --fatal-infos` |

### `commit-msg`

Validates commit messages against [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint`.

**Allowed types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `chore` · `revert` · `ci` · `build`

**Example valid messages:**
```
feat: add delete confirmation dialog to packages page
fix(backend): return 404 when package not found
docs: update setup instructions in README
```

To skip hooks temporarily:
```bash
LEFTHOOK=0 git commit -m "..."
```

---

## Sub-project READMEs

- [backend/README.md](./backend/README.md) — API design, endpoints, project structure, architectural decisions
- [admin-portal/README.md](./admin-portal/README.md) — component structure, environment setup, testing
- [mobile-app/README.md](./mobile-app/README.md) — Flutter setup, flavors, environment config
