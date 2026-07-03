# yt-to-mp3

<p align="center">
  <img src="frontend/public/yt2mp3logo.png" alt="yt-to-mp3" width="400" />
</p>

[![Docker Pulls](https://img.shields.io/docker/pulls/oconnorj00/yt-to-mp3?label=Docker%20Pulls&logo=docker)](https://hub.docker.com/r/oconnorj00/yt-to-mp3 "Docker Pulls")
[![Docker Image Size](https://img.shields.io/docker/image-size/oconnorj00/yt-to-mp3/latest)](https://hub.docker.com/r/oconnorj00/yt-to-mp3 "Docker Image Size")

Paste a YouTube link, get an MP3. Containerized, one command to run.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [E2E Tests](#e2e-tests)
- [License](#license)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose

## Quick Start

### Build from source

```bash
docker compose up --build
```

### Use pre-built image

```yaml
services:
  app:
    image: oconnorj00/yt-to-mp3:latest
    ports:
      - "8080:8080"
    restart: unless-stopped
```

```bash
docker compose up
```

Open [http://localhost:8080](http://localhost:8080), paste a YouTube URL, click Download.

## Features

- One-click YouTube audio extraction
- Runs entirely in Docker — no local dependencies needed
- React frontend with loading and error states
- yt-dlp + ffmpeg under the hood for best-quality MP3s
- Real-time download progress bar
- Dark mode support

## Architecture

```
┌──────────┐     ┌──────────────────────────────────────┐
│ Browser  │────▶│  Node + Express                       │
│ :8080    │     │  - API routes (/api/*)                │
│          │     │  - Static frontend (React SPA)        │
│          │     │  - yt-dlp + ffmpeg                    │
└──────────┘     └──────────────────────────────────────┘
```

A single container runs both the React frontend (served as static files) and the Node.js/Express backend. No Nginx or separate frontend container needed.

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
├── backend/             Express API
│   └── src/
│       ├── index.ts           Server entry
│       └── routes/download.ts POST /api/download
├── frontend/            React + Vite app
│   ├── src/
│   │   ├── App.tsx            Main component
│   │   ├── components/
│   │   │   └── UrlInput.tsx   URL input + download button
│   │   └── main.tsx           App entry
│   └── nginx/default.conf     Nginx proxy config (deprecated)
├── e2e/                 Playwright tests
│   └── tests/download.spec.ts
├── docker-compose.yml
└── Dockerfile
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
