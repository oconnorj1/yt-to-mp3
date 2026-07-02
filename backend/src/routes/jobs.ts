import { Router } from 'express';
import fs from 'fs';
import { createJob, getJob, subscribe } from '../services/downloadManager.js';

export const jobsRouter = Router();

jobsRouter.post('/jobs', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  const job = createJob(url);
  res.status(201).json({ id: job.id, status: job.status });
});

jobsRouter.get('/jobs/:id/progress', (req, res) => {
  const { id } = req.params;

  const job = getJob(id);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const unsubscribe = subscribe(id, (data) => {
    res.write(`data: ${data}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

jobsRouter.get('/jobs/:id/file', (req, res) => {
  const { id } = req.params;

  const job = getJob(id);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  if (job.status !== 'completed' || !job.filePath) {
    res.status(400).json({ error: 'File not ready', status: job.status });
    return;
  }

  res.download(job.filePath, job.filename!, (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    setTimeout(() => {
      try {
        fs.rmSync(job.tmpDir, { recursive: true, force: true });
      } catch {}
    }, 5000);
  });
});
