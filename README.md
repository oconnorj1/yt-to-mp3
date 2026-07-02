# yt-to-mp3

Paste a YouTube link, get an MP3. Containerized, one command to run.

## Quick Start

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080), paste a YouTube URL, click Download.

## Features

- One-click YouTube audio extraction
- Runs entirely in Docker — no local dependencies needed
- React frontend with loading and error states
- yt-dlp + ffmpeg under the hood for best-quality MP3s

## Architecture

```
┌──────────┐     ┌──────────┐     ┌─────────────────────┐
│ Browser  │────▶│  Nginx   │────▶│  Express (backend)  │
│ :8080    │     │  :8080   │     │  :3001              │
└──────────┘     └──────────┘     └─────────────────────┘
                                          │
                                    ┌─────┴─────┐
                                    │  yt-dlp    │
                                    │  + ffmpeg  │
                                    └───────────┘
```

The frontend (React) calls `POST /api/download` through Nginx, which proxies to the backend. The backend spawns yt-dlp to download and convert the audio to MP3, then streams the file back to the browser.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Audio | yt-dlp, ffmpeg |
| Container | Docker, Docker Compose |
| E2E | Playwright |

## Project Structure

```
├── backend/             Express API (port 3001)
│   └── src/
│       ├── index.ts           Server entry
│       └── routes/download.ts POST /api/download
├── frontend/            React + Vite app (port 8080)
│   ├── src/
│   │   ├── App.tsx            Main component
│   │   ├── components/
│   │   │   └── UrlInput.tsx   URL input + download button
│   │   └── main.tsx           App entry
│   └── nginx/default.conf     Nginx proxy config
├── e2e/                 Playwright tests
│   └── tests/download.spec.ts
├── docker-compose.yml
├── Dockerfile.backend
└── Dockerfile.frontend
```

## Development

Run each service locally for hot reloading:

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend (proxies /api to localhost:3001)
cd frontend && npm install && npm run dev
```

## E2E Tests

```bash
# Ensure containers are running, then:
cd e2e && npx playwright test
```

## License

MIT
