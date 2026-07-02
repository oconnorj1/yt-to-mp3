FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache yt-dlp ffmpeg

WORKDIR /app
COPY backend/package.json backend/tsconfig.json ./
COPY backend/src ./src
RUN npm install && npm run build && npm prune --production
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 8080
CMD ["node", "dist/index.js"]
