# Tasks — yt-to-mp3

## How to Use

- Each session starts by reading this file
- Mark tasks with `[x]` when complete
- Add new tasks under the relevant phase as you discover them
- Each phase should be worked on in a dedicated branch

---

## Phase 0 — Scaffolding

- [x] Initialize project structure
- [x] Create .gitignore
- [x] Create AGENTS.md
- [x] Create code-tools/ (research.md, tasks.md)
- [x] Create backend service (Express + TypeScript)
- [x] Create frontend app (React + Vite + TypeScript)
- [x] Create Docker setup (docker-compose, Dockerfiles)
- [x] Configure E2E testing (Playwright)
- [x] Verify full build and run

## Phase 1 — Backend: Audio Extraction API

- [x] Set up Express server with TypeScript
- [x] Create `/api/download` endpoint
- [x] Integrate yt-dlp for audio extraction
- [x] Integrate ffmpeg for MP3 conversion
- [x] Stream/download MP3 file to client
- [x] Test API endpoint directly with a real URL

## Phase 2 — Frontend: URL Input & Download

- [x] Scaffold Vite + React + TypeScript
- [x] Build URL input form with validation
- [x] Add download button & progress indicator
- [x] Style UI (basic clean look)
- [x] Connect to backend API

## Phase 3 — Containerization

- [x] Write backend Dockerfile
- [x] Write frontend Dockerfile (multi-stage, Nginx)
- [x] Write docker-compose.yml
- [x] Test full stack with `docker compose up`

## Phase 4 — E2E Testing

- [x] Install & configure Playwright in e2e/
- [x] Write test: page loads with title and form
- [x] Write test: error state (invalid URL)
- [x] Write test: button disabled when input empty
- [x] Write test: submit URL and verify download starts
- [x] Run tests against Docker containers

## Phase 5 — Dark Mode + Modern Styling

- [x] Create `frontend/src/index.css` with CSS custom properties (colors, spacing, typography)
- [x] Add `[data-theme="dark"]` overrides for all custom properties
- [x] Implement theme toggle: respect `prefers-color-scheme` + manual toggle + localStorage
- [x] Rewrite `App.tsx` inline styles to use CSS class names
- [x] Rewrite `UrlInput.tsx` inline styles to use CSS class names
- [x] Style: centered card layout, pill input, gradient accent button with hover animation
- [x] Add dark mode toggle icon button (top-right corner)
- [x] Test light/dark mode persistence across page reload

## Phase 6 — Real-Time Progress Bar (SSE)

- [x] Create `backend/src/services/downloadManager.ts` — job tracking, yt-dlp process management
- [x] Refactor download flow: `POST /api/jobs` (starts job, returns ID)
- [x] Add SSE endpoint: `GET /api/jobs/:id/progress` (streams yt-dlp stderr progress)
- [x] Add file endpoint: `GET /api/jobs/:id/file` (serves completed MP3)
- [x] Parse yt-dlp stderr for `[download] X.X%` progress lines
- [x] Create `frontend/src/components/ProgressBar.tsx` — animated fill bar
- [x] Update `App.tsx` — connect to SSE stream, update progress bar in real-time
- [x] Handle edge cases: job not found, yt-dlp failure, connection drop

## Phase 7 — Logo & Favicon Integration

- [x] Move `frontend/images/yt2mp3logo.png` to `frontend/public/` and remove the `images/` directory
- [x] Add favicon `<link>` tag in `index.html`
- [x] Replace `<h1>` title with logo `<img>` in `App.tsx`
- [x] Style logo in `index.css` (max-height, alignment)
- [x] Add centered, large logo image to top of `README.md` using relative repo path
- [x] Rebuild Docker images and verify favicon + logo render correctly

## Phase 8 — Final Polish

- [x] Error handling polish (network timeouts, retry hints)
- [x] Loading skeleton states
- [x] Final end-to-end verification with Docker Compose
- [x] Run full E2E test suite against running containers

## Phase 9 — Single-Container Merge: Pipeline & README (Phase A)

Branch: `jc/09a-single-container-pipeline`

- [x] Create new Docker Hub repo `oconnorj00/yt-to-mp3`
- [x] Update `.github/workflows/docker-publish.yml` for single-image build
- [x] Update `README.md` — new architecture diagram, single-image badges, updated project structure and quick-start
- [x] Update `local-tests/docker-compose.yml` for single service using new image

## Phase 10 — Single-Container Merge: Code Changes (Phase B)

Branch: `jc/10b-single-container-code`

- [ ] Write new single `Dockerfile` (multi-stage, no Nginx)
- [ ] Update `backend/src/index.ts` to serve static frontend files + SPA catch-all
- [ ] Delete `frontend/nginx/default.conf`
- [ ] Update `docker-compose.yml` to single `app` service on port 8080
- [ ] Update `vite.config.ts` proxy target (if needed)
- [ ] Rebuild Docker images and verify with `docker compose up`
- [ ] Run full E2E test suite against single container
- [ ] Deprecate old Docker Hub images (`oconnorj00/yt-to-mp3-backend`, `oconnorj00/yt-to-mp3-frontend`)

---

## Notes

- Backend runs on port 3001 (Phase B moves to port 8080)
- Frontend served on port 8080
- E2E tests run against the running Docker stack
- Research spike: `code-tools/research/single-container-merge.md`
