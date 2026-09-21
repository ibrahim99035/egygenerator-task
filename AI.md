# AI Usage

This document describes how AI assistants were used to build this project.

## Overview

Two AI tools were used in different roles during development:

- **Cline (Claude-based coding agent)** — the primary development assistant, used for implementation, debugging, verification, and code review.
- **Grok** — used for brainstorming and high-level planning before implementation.

## How Cline Was Used

Cline was used through an interactive coding workflow to handle the full development lifecycle:

### Implementation

- Scaffolded the NestJS backend with JWT authentication, Mongoose models, Passport strategy, DTOs with validation, and Swagger/OpenAPI documentation
- Built the React + Vite client with authentication context, protected routes, form validation (React Hook Form + Zod), toast notifications, dynamic page titles, and loading states
- Configured Vercel deployment with client SPA rewrite rules (`.vercel.json`) and serverless-friendly NestJS setup
- Set up GitHub Actions CI workflow covering lint, typecheck, tests, and build for both frontend and backend jobs

### Debugging

- Diagnosed and resolved a stale Vite dev server from a different project occupying port 3000, which was causing `404 Not Found` errors on the signup endpoint
- Fixed an invalid TypeScript compiler option (`ignoreDeprecations: "6.0"`) that was incompatible with TypeScript 5.9.3 and causing the NestJS watcher to crash on every build
- Resolved MongoDB startup failures caused by a stale socket file in `/tmp` from a previous unclean shutdown, by running MongoDB in user-space with a custom data directory
- Fixed a ESM/CJS compatibility issue where `@nestjs/jwt@12` (ESM-only) could not be loaded by Jest's CommonJS-based test runner, by configuring `transformIgnorePatterns` and a dedicated `tsconfig.spec.json`
- Fixed a lint rule violation (`react-refresh/only-export-components`) by splitting the `useAuth` hook into its own file

### Verification

- Ran end-to-end tests against both local and deployed endpoints to confirm signup, signin, and protected route behavior
- Verified database writes on MongoDB Atlas after signup/signin flows
- Checked that environment variables were correctly configured on Vercel for both client and server projects
- Validated that the CI workflow passes all jobs (lint, typecheck, tests, build)

### Code Review

- Reviewed generated code for correctness, type safety, and adherence to NestJS and React best practices
- Suggested improvements to error handling, validation messages, and user feedback (toasts)
- Identified missing pieces like the health-check endpoint and CORS configuration for production

## How Grok Was Used

Grok was used during the early brainstorming phase to shape the overall approach:

- Discussed project scope and feature priorities before any code was written
- Explored different architectural options for the full-stack authentication app
- Brainstormed the tech stack choices and confirmed NestJS + React + Vite as the direction
- Worked through deployment strategy questions (single vs dual Vercel projects, CORS handling, environment variable management)
- Generated ideas for project structure, component organization, and API design

Grok was not used to write implementation code — its role was to help clarify the plan and explore alternatives before handing off to Cline for the actual build.

## Typical Workflow

1. **Brainstorming with Grok** — rough out the feature set, architecture, and deployment plan
2. **Implementation with Cline** — Cline writes the code, sets up configurations, and runs verifications
3. **Debugging with Cline** — when something breaks, Cline diagnoses and fixes it with live testing
4. **Review and ship** — confirm everything works, push to GitHub, verify CI and Vercel deployments

## Lessons Learned

- When running multiple Node.js projects locally, stale processes from other projects can occupy ports and cause confusing errors (e.g., a Vite server from a different project on port 3000)
- Environment variables set in Vercel's dashboard only apply to new deployments — old deployments keep their original env values
- MongoDB Atlas requires `0.0.0.0/0` (or specific IP ranges) in Network Access for Vercel serverless functions, because Vercel's egress IPs are not static
- Vite inlines `VITE_*` environment variables at build time into the client bundle, so changing them requires a new build/deployment — they are not runtime configuration
- Splitting React hooks into their own files avoids the `react-refresh/only-export-components` lint rule when a file exports both a component and a hook
- Jest cannot `require()` ESM-only packages by default; NestJS 11 projects using `@nestjs/jwt@12` need `transformIgnorePatterns` to transform those dependencies
