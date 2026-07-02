<p align="center">
  <img src="https://raw.githubusercontent.com/oconnorj1/yt-to-mp3/main/frontend/public/yt2mp3logo.png" alt="yt-to-mp3" width="400" />
</p>

<p align="center">
  <a href="https://hub.docker.com/r/oconnorj00/yt-to-mp3">
    <img src="https://img.shields.io/docker/pulls/oconnorj00/yt-to-mp3?style=flat-square" alt="Docker Pulls" />
  </a>
  <a href="https://hub.docker.com/r/oconnorj00/yt-to-mp3">
    <img src="https://img.shields.io/docker/image-size/oconnorj00/yt-to-mp3/latest?style=flat-square" alt="Docker Image Size" />
  </a>
</p>

<p align="center">
  Paste a YouTube link, get an MP3. One command, zero setup.
</p>

---

## Quick Start

```bash
docker run -d -p 8080:8080 --restart unless-stopped oconnorj00/yt-to-mp3:latest
```

Or with Docker Compose:

```yaml
services:
  app:
    image: oconnorj00/yt-to-mp3:latest
    ports:
      - "8080:8080"
    restart: unless-stopped
```

Open [http://localhost:8080](http://localhost:8080), paste a YouTube URL, click **Download**.

---

## What is this?

yt-to-mp3 is a self-hosted web app that extracts high-quality MP3 audio from YouTube videos. Everything runs in a single Docker container — no `ffmpeg`, `yt-dlp`, or Node.js to install on your host.

---

## Features

- **One-click** — paste a URL, download an MP3
- **Fully containerized** — nothing to install besides Docker
- **Real-time progress** — see download progress as it happens
- **Dark mode** — easy on the eyes
- **Best-quality audio** — backed by `yt-dlp` + `ffmpeg`

---

## How it works

```
Browser ──▶ Express API ──▶ yt-dlp + ffmpeg ──▶ MP3 download
```

A Node.js/Express server serves the React frontend as static files and handles audio extraction on the backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Audio | yt-dlp, ffmpeg |
| Container | Docker |

---

## Source

- **GitHub:** [oconnorj1/yt-to-mp3](https://github.com/oconnorj1/yt-to-mp3)
- **Report issues:** [github.com/oconnorj1/yt-to-mp3/issues](https://github.com/oconnorj1/yt-to-mp3/issues)

---

## License

MIT
