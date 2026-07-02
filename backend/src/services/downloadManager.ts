import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

export interface Job {
  id: string;
  url: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  filePath?: string;
  filename?: string;
  tmpDir: string;
  createdAt: number;
}

const jobs = new Map<string, Job>();
const processes = new Map<string, ReturnType<typeof spawn>>();
const sseClients = new Map<string, Set<(data: string) => void>>();

const CLEANUP_INTERVAL = 30 * 60 * 1000;
const JOB_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_TTL) {
      cleanupJob(id);
    }
  }
}, CLEANUP_INTERVAL);

function cleanupJob(id: string) {
  const job = jobs.get(id);
  if (job) {
    const proc = processes.get(id);
    if (proc) {
      proc.kill();
      processes.delete(id);
    }
    try {
      if (job.tmpDir) fs.rmSync(job.tmpDir, { recursive: true, force: true });
    } catch {}
    jobs.delete(id);
  }
  sseClients.delete(id);
}

export function createJob(url: string): Job {
  const id = crypto.randomUUID();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-dlp-'));
  const job: Job = { id, url, status: 'pending', progress: 0, tmpDir, createdAt: Date.now() };
  jobs.set(id, job);
  startDownload(job);
  return { ...job };
}

function startDownload(job: Job) {
  job.status = 'downloading';
  const outputTemplate = path.join(job.tmpDir, '%(title)s.%(ext)s');

  const ytProcess = spawn('yt-dlp', [
    '--socket-timeout', '30',
    job.url,
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', outputTemplate,
    '--no-playlist',
    '--no-warnings',
  ]);

  processes.set(job.id, ytProcess);

  let stderrOutput = '';

  ytProcess.stderr.on('data', (data: Buffer) => {
    const text = data.toString();
    stderrOutput += text;
    const match = text.match(/\[download\]\s+(\d+\.?\d*)%/);
    if (match) {
      job.progress = parseFloat(match[1]);
      emitEvent(job.id, { type: 'progress', progress: job.progress });
    }
  });

  ytProcess.on('close', (code) => {
    processes.delete(job.id);
    if (code !== 0) {
      job.status = 'failed';
      job.error = stderrOutput.trim() || `Process exited with code ${code}`;
      emitEvent(job.id, { type: 'failed', error: job.error });
      return;
    }

    const files = fs.readdirSync(job.tmpDir);
    const mp3File = files.find(f => f.endsWith('.mp3'));
    if (!mp3File) {
      job.status = 'failed';
      job.error = 'Output file not found';
      emitEvent(job.id, { type: 'failed', error: job.error });
      return;
    }

    const filePath = path.join(job.tmpDir, mp3File);
    job.status = 'completed';
    job.progress = 100;
    job.filePath = filePath;
    job.filename = mp3File;
    emitEvent(job.id, { type: 'completed', progress: 100, filename: mp3File });
  });

  ytProcess.on('error', (err) => {
    processes.delete(job.id);
    job.status = 'failed';
    job.error = err.message;
    emitEvent(job.id, { type: 'failed', error: err.message });
  });
}

export function getJob(id: string): Job | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  return { ...job };
}

export function subscribe(jobId: string, onEvent: (data: string) => void): () => void {
  if (!sseClients.has(jobId)) {
    sseClients.set(jobId, new Set());
  }
  sseClients.get(jobId)!.add(onEvent);

  const job = jobs.get(jobId);
  if (job) {
    if (job.status === 'completed') {
      onEvent(JSON.stringify({ type: 'completed', progress: 100, filename: job.filename }));
    } else if (job.status === 'failed') {
      onEvent(JSON.stringify({ type: 'failed', error: job.error }));
    } else if (job.status === 'downloading' && job.progress > 0) {
      onEvent(JSON.stringify({ type: 'progress', progress: job.progress }));
    }
  }

  return () => {
    const clients = sseClients.get(jobId);
    if (clients) {
      clients.delete(onEvent);
      if (clients.size === 0) {
        sseClients.delete(jobId);
      }
    }
  };
}

function emitEvent(jobId: string, data: Record<string, unknown>) {
  const clients = sseClients.get(jobId);
  if (clients) {
    const message = JSON.stringify(data);
    for (const cb of clients) {
      cb(message);
    }
  }
}
