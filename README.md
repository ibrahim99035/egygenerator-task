# EgyGenerator — Full-Stack Task

A full-stack authentication application built with a **NestJS + MongoDB** REST API and a
**React + Vite + TypeScript** client.

The app provides user signup, sign-in, JWT-based authentication, protected routes, and a
deployment-ready setup with Vercel and GitHub Actions CI.

## Live Deployments

| Layer  | URL                                           |
|--------|-----------------------------------------------|
| Client | <https://egygenerator-task.vercel.app>        |
| API    | <https://server-pied-one-57.vercel.app>       |
| API docs | <https://server-pied-one-57.vercel.app/api/docs> |

## Features

### Authentication

- **Sign Up** — create an account with name, email and password; returns a JWT access token and the user object
- **Sign In** — authenticate with email/password; returns a JWT access token and the user object
- **JWT access tokens** — signed with HS256 using a configurable secret; stored in `localStorage`
- **Protected routes** — the `/app` dashboard is only accessible when authenticated
- **Session persistence** — on page load, stored token and user are read from `localStorage` and restored automatically
- **Logout** — clears stored token and user, redirects to sign-in
- **Duplicate email handling** — returns `409 Conflict` when trying to sign up with an already-registered email
- **Password hashing** — bcrypt with salt rounds for secure password storage

### API

- **RESTful design** — clean resource-oriented endpoints under `/auth`
- **JWT authentication** — Bearer token auth on protected endpoints, validated via Passport JWT strategy
- **Swagger / OpenAPI documentation** — interactive API docs at `/api/docs` with try-it-out support; click Authorize, paste a token, and call protected endpoints directly from the UI
- **Input validation** — all request bodies validated with `class-validator` (email format, password length, required fields); clear error messages returned to the client
- **Global validation pipe** — whitelists allowed properties and transforms payloads to DTO types automatically
- **Health check endpoint** (`GET /`) — reports server uptime, database connection state, and environment variable configuration (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`); useful for deployment verification
  - Returns `200` with `status: "ok"` when the database is connected
  - Returns `503` with `status: "degraded"` when the database cannot be reached
- **CORS configured** — allows the frontend origin (and `localhost:5173` for local dev); configurable via `FRONTEND_URL`
- **Error handling** — consistent error shapes: `400` for validation, `401` for invalid credentials, `409` for duplicate email, `500` for server errors

### Frontend

- **React 19 + Vite + TypeScript** — fast dev server with HMR, production build with type-checking
- **React Router** — client-side routing with sign-in, sign-up, and protected application pages
- **Auth context** — centralized authentication state (`AuthProvider`) with `useAuth` hook giving access to `user`, `token`, `isAuthenticated`, `isLoading`, `login`, and `logout`
- **Protected route wrapper** (`ProtectedRoute`) — redirects unauthenticated users to sign-in; shows a loading spinner while auth state is being determined
- **Sign-up page** — form with name, email, password fields; client-side validation; toast notifications for success and errors
- **Sign-in page** — form with email/password; client-side validation; toast notifications
- **Application (dashboard) page** — protected page showing the authenticated user's name; logout button
- **Dynamic page titles** — `usePageTitle` hook sets the browser tab title per route (e.g. "Sign In – EgyGenerator", "Sign Up – EgyGenerator", "Welcome, Name – EgyGenerator")
- **Form validation** — React Hook Form + Zod schemas for client-side validation with inline field error messages and validation summary toasts
- **Toast notifications** — `react-hot-toast` for success and error feedback on all actions (signup, signin, logout, API errors, validation errors)
- **Loading states** — animated SVG spinner shown during form submission and while auth state loads; buttons disabled and dimmed while loading
- **Custom UI components** — reusable `Button`, `Input`, `Spinner` components with variants (primary, danger) and sizes (default, small)
- **Tailwind CSS** — utility-first styling
- **Axios API layer** — centralized `api` instance with base URL, auth token injection interceptor, and error message helper
- **Responsive design** — works on desktop and mobile

### Developer Experience

- **Single-command dev** — `npm run dev` from the project root starts both the API and the client together, with prefixed output (`[api]` / `[web]`); Ctrl+C stops both
- **Environment file templates** — `.env.example` files provided for both client and server; `npm run setup` creates `.env` files from templates without overwriting existing ones
- **TypeScript throughout** — full type safety on both frontend and backend
- **ESLint** — configured for both client and server with autofix support
- **Unit tests** — Jest test suites for the auth service, auth controller, users service, and app controller
- **End-to-end tests** — NestJS e2e test suite covering the auth flow end to end
- **Production builds** — `npm run build` at the root builds both the server (to `dist/`) and the client (to `dist/`)

### Deployment

- **Vercel** — the repo is deployed as two separate Vercel projects:
  - **Client** (`Root Directory: client`) — Vite build, SPA rewrite rules for client-side routing, `VITE_API_URL` inlined at build time
  - **API** (`Root Directory: server`) — NestJS detected automatically, no build config needed; runs as serverless functions
- **Client SPA routing** — `client/vercel.json` rewrites all paths to `index.html` so deep links (`/signin`, `/app`) work on refresh
- **MongoDB Atlas** — the API connects to Atlas; Network Access must allow Vercel's dynamic egress IPs (use `0.0.0.0/0` or Vercel Static Compute)
- **Environment variables** — set in the Vercel dashboard for both projects (Production and Preview environments)

### Continuous Integration

- **GitHub Actions** — `.github/workflows/ci.yml` runs on every push and pull request to `main`
  - **Frontend job**: installs dependencies, lints, type-checks (`tsc -b`), and builds the client
  - **Backend job**: installs dependencies, lints, type-checks (`tsc --noEmit`), runs Jest tests against a MongoDB 7 service container, and builds the server

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite, TypeScript, React Router, React Hook Form + Zod, Axios, Tailwind CSS, react-hot-toast |
| Backend  | NestJS 11, Mongoose, Passport JWT, bcrypt, class-validator, Swagger/OpenAPI |
| Database | MongoDB (local or MongoDB Atlas) |
| CI       | GitHub Actions (lint, typecheck, tests, build) |
| Deployment | Vercel (two projects: client + API) |

## Project Structure

```
.
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # LogoutButton, ProtectedRoute
│   │   │   ├── forms/           # SignInForm, SignUpForm
│   │   │   ├── layout/          # AppLayout, AuthLayout
│   │   │   └── ui/              # Button, Input, Spinner, FormError
│   │   ├── context/             # AuthContext, useAuth hook
│   │   ├── hooks/               # usePageTitle
│   │   ├── lib/                 # api (axios), validation schemas, error helpers, formErrors
│   │   ├── pages/               # signin_page, signup_page, application_page
│   │   ├── types/               # shared TypeScript types
│   │   └── vercel.json          # SPA rewrite rules for Vercel deployment
│   ├── .env.example
│   └── package.json
├── server/                      # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/             # signup.dto, signin.dto, auth-response.dto
│   │   │   ├── strategies/      # jwt.strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   └── schemas/user.schema.ts
│   │   ├── app.controller.ts        # health check endpoint
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts                  # CORS, validation pipe, Swagger, bootstrap
│   │   └── types/request.d.ts
│   ├── test/                      # e2e tests
│   ├── tsconfig.spec.json         # test-specific TypeScript config
│   ├── .env.example
│   └── package.json
├── .github/
│   ├── AI.md                      # how AI assistants were used
│   ├── workflows/
│   │   └── ci.yml                 # GitHub Actions CI
│   └── PULL_REQUEST_TEMPLATE/     # (optional)
├── scripts/
│   └── setup-env.mjs              # helper to create .env files from templates
├── client/                       # (symlink or separate — see Quick Start)
└── README.md
```

## Quick Start

Run both apps with a single command from the project root:

```bash
npm install       # root tooling (concurrently)
npm run setup     # install server + client dependencies, create .env files from templates
npm run dev       # start the API and the client together
```

| URL                             | Service    |
|---------------------------------|------------|
| <http://localhost:3000>         | NestJS API |
| <http://localhost:3000/api/docs>| Swagger UI |
| <http://localhost:5173>         | React app  |

Output is prefixed per app (`[api]` / `[web]`) and Ctrl+C stops both.
`npm run setup` never overwrites an existing `.env`, so review those files before the first run.

## Getting Started (manual)

### Prerequisites

- Node.js 20+ (developed on Node 22)
- MongoDB running locally **or** a MongoDB Atlas cluster

### 1. Backend

```bash
cd server
npm install
cp .env.example .env    # then fill in your values
npm run start:dev
```

Runs on <http://localhost:3000>. Interactive API docs: <http://localhost:3000/api/docs>.

| Variable       | Description                                           |
|----------------|-------------------------------------------------------|
| `PORT`         | HTTP port (default `3000`)                            |
| `MONGODB_URI`  | MongoDB connection string (Atlas or local)            |
| `JWT_SECRET`   | Secret used to sign access tokens                     |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:5173`) |

> Using Atlas? Add your IP under **Network Access** in the Atlas console, otherwise the driver
> fails the TLS handshake with `MongoServerSelectionError`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env    # set VITE_API_URL
npm run dev
```

Runs on <http://localhost:5173>. Sign up, then you are redirected to the protected `/app` page.

## API Endpoints

| Method | Endpoint       | Auth   | Description                             |
|--------|----------------|--------|-----------------------------------------|
| GET    | `/`            | —      | Health check: uptime, database state    |
| POST   | `/auth/signup` | —      | Create an account, returns token + user |
| POST   | `/auth/signin` | —      | Authenticate, returns token + user      |
| GET    | `/auth/me`     | Bearer | Current user profile                    |

Errors: `400` validation, `401` invalid credentials, `409` email already registered.

The root health check returns `200` with `status: "ok"` once the database is
connected (or `"starting"` while connecting) and `503` with `status: "degraded"`
if the database cannot be reached. It also reports whether `MONGODB_URI`,
`JWT_SECRET` and `FRONTEND_URL` are configured, which makes it the fastest way
to check a deployment.

## API Request/Response Examples

### Sign Up

**Request:**

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "670a1b2c3d4e5f6a7b8c9d0e",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Sign In

**Request:**

```http
POST /auth/signin
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "670a1b2c3d4e5f6a7b8c9d0e",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Get Current User

**Request:**

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**

```json
{
  "id": "670a1b2c3d4e5f6a7b8c9d0e",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Health Check

**Request:**

```http
GET /
```

**Response (200 OK, database connected):**

```json
{
  "status": "ok",
  "uptime": 12345,
  "database": "connected",
  "environment": {
    "MONGODB_URI": "set",
    "JWT_SECRET": "set",
    "FRONTEND_URL": "set"
  }
}
```

## Deployment (Vercel)

Deploy the repository twice, once per app, choosing the matching Root Directory:

| Project | Root Directory | Environment variables |
|---------|----------------|-----------------------|
| API     | `server`       | `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` |
| Web     | `client`       | `VITE_API_URL` (the API URL, inlined at build time) |

Vercel detects the NestJS entrypoint (`server/src/main.ts`) and the Vite build
automatically, so no build settings are needed. Two extra pieces make it behave:

- `client/vercel.json` rewrites every path to `index.html` so client-side routes
  such as `/signin` and `/app` survive a refresh.
- MongoDB Atlas must allow Vercel's egress IPs (they are dynamic, so use
  `0.0.0.0/0` or a Vercel static IP). Without it the API fails at startup and
  the root health check is unreachable.

`FRONTEND_URL` accepts a comma-separated list to allow several origins.

## Scripts

| Location | Command             | Purpose                           |
|----------|---------------------|-----------------------------------|
| root     | `npm install`       | Install root tooling (concurrently, etc.) |
| root     | `npm run setup`     | Install both apps + create .env from templates |
| root     | `npm run dev`       | Start API and client together (prefixed output) |
| root     | `npm run build`     | Build server and client           |
| root     | `npm run lint`      | Lint server and client            |
| root     | `npm run test`      | Run server unit tests             |
| server   | `npm run start:dev` | Dev server with watch mode        |
| server   | `npm test`          | Unit tests (Jest)               |
| server   | `npm run lint`      | ESLint with autofix             |
| server   | `npm run build`     | Compile to `dist/`              |
| server   | `npx tsc --noEmit`  | Type-check without emitting (CI) |
| client   | `npm run dev`       | Vite dev server with HMR        |
| client   | `npm run lint`      | ESLint                          |
| client   | `npm run build`     | Type-check and production build |
| client   | `npx tsc -b`        | Type-check (CI)                  |

## Environment Files

Real `.env` files are git-ignored at every level. Commit only the `.env.example` templates,
and never put production secrets (Atlas credentials, JWT secrets) in version control.

## How AI Was Used

See [`.github/AI.md`](./.github/AI.md) for a detailed account of how AI assistants
(Cline and Grok) were used during the development of this project — including
implementation, debugging, brainstorming, verification, and the lessons learned.

## License

This project is part of a learning/task exercise. No license is applied.
