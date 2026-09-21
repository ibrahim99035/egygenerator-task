# EgyGenerator — Full-Stack Task

A full-stack authentication app: a **NestJS + MongoDB** REST API with JWT auth and Swagger docs,
and a **React + Vite + TypeScript** client with protected routes, form validation and toast notifications.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite, TypeScript, React Router, React Hook Form + Zod, Axios, Tailwind CSS, react-hot-toast |
| Backend  | NestJS 11, Mongoose, Passport JWT, bcrypt, class-validator, Swagger/OpenAPI |
| Database | MongoDB (local or MongoDB Atlas) |
| CI       | GitHub Actions (lint, typecheck, tests, build) |

## Project Structure

```
.
├── client/            # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI, layout, auth and form components
│   │   ├── context/       # AuthContext (session state)
│   │   ├── hooks/         # usePageTitle (dynamic document titles)
│   │   ├── lib/           # axios instance, validation schemas, error helpers
│   │   ├── pages/         # sign in / sign up / application pages
│   │   └── types/         # shared TypeScript types
│   └── .env.example
└── server/            # NestJS API
    ├── src/
    │   ├── auth/          # signup / signin / me, JWT strategy, DTOs
    │   ├── users/         # user schema + service
    │   └── main.ts        # CORS, validation pipe, Swagger setup
    └── .env.example
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
| POST   | `/auth/signup` | —      | Create an account, returns token + user |
| POST   | `/auth/signin` | —      | Authenticate, returns token + user      |
| GET    | `/auth/me`     | Bearer | Current user profile                    |

Errors: `400` validation, `401` invalid credentials, `409` email already registered.

## Scripts

| Location | Command             | Purpose                           |
|----------|---------------------|-----------------------------------|
| root     | `npm run setup`     | Install both apps + create .env   |
| root     | `npm run dev`       | Start API and client together     |
| root     | `npm run build`     | Build server and client           |
| root     | `npm run lint`      | Lint server and client            |
| root     | `npm run test`      | Run server unit tests             |
| server   | `npm run start:dev` | Dev server with watch mode        |
| server   | `npm test`          | Unit tests (Jest)               |
| server   | `npm run lint`      | ESLint with autofix             |
| server   | `npm run build`     | Compile to `dist/`              |
| client   | `npm run dev`       | Vite dev server with HMR        |
| client   | `npm run lint`      | ESLint                          |
| client   | `npm run build`     | Type-check and production build |

## Continuous Integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`:

- **frontend** — `npm ci`, lint, `tsc -b`, build
- **backend** — `npm ci`, lint, `tsc --noEmit`, Jest tests against a MongoDB 7 service container, build

## Environment Files

Real `.env` files are git-ignored at every level. Commit only the `.env.example` templates,
and never put production secrets (Atlas credentials, JWT secrets) in version control.
