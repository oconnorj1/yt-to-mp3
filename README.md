# yt-to-mp3

<p align="center">
  <img src="frontend/public/yt2mp3logo.png" alt="yt-to-mp3" width="400" />
</p>

[![Docker Pulls - Backend](https://img.shields.io/docker/pulls/oconnorj00/yt-to-mp3-backend)](https://hub.docker.com/r/oconnorj00/yt-to-mp3-backend "Docker Pulls - Backend")
[![Docker Image Size - Backend](https://img.shields.io/docker/image-size/oconnorj00/yt-to-mp3-backend)](https://hub.docker.com/r/oconnorj00/yt-to-mp3-backend "Docker Image Size - Backend")
[![Docker Pulls - Frontend](https://img.shields.io/docker/pulls/oconnorj00/yt-to-mp3-frontend)](https://hub.docker.com/r/oconnorj00/yt-to-mp3-frontend "Docker Pulls - Frontend")
[![Docker Image Size - Frontend](https://img.shields.io/docker/image-size/oconnorj00/yt-to-mp3-frontend)](https://hub.docker.com/r/oconnorj00/yt-to-mp3-frontend "Docker Image Size - Frontend")

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

### Use pre-built images with Docker Compose

```yaml
services:
  backend:
    image: oconnorj00/yt-to-mp3-backend:latest
    ports:
      - "3001:3001"
    restart: unless-stopped

  frontend:
    image: oconnorj00/yt-to-mp3-frontend:latest
    ports:
      - "8080:8080"
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
docker compose up
```

Open [http://localhost:8080](http://localhost:8080), paste a YouTube URL, click Download.
- Frontend: port **8080**
- Backend API: port **3001**

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
