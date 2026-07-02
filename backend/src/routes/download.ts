import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const downloadRouter = Router();

downloadRouter.post('/download', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-dlp-'));
  const outputTemplate = path.join(tmpDir, '%(title)s.%(ext)s');

  const ytProcess = spawn('yt-dlp', [
    '--socket-timeout', '30',
    url,
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', outputTemplate,
    '--no-playlist',
    '--no-warnings',
  ]);

  let stderrOutput = '';

  ytProcess.stderr.on('data', (data: Buffer) => {
    stderrOutput += data.toString();
  });

  ytProcess.on('close', (code) => {
    if (code !== 0) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      res.status(500).json({ error: 'Failed to process video', details: stderrOutput.trim() });
      return;
    }

    const files = fs.readdirSync(tmpDir);
    const mp3File = files.find(f => f.endsWith('.mp3'));
    if (!mp3File) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      res.status(500).json({ error: 'Output file not found', details: stderrOutput.trim() });
      return;
    }

    const filePath = path.join(tmpDir, mp3File);
    res.download(filePath, mp3File, () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  });

  ytProcess.on('error', (err) => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    res.status(500).json({ error: 'Failed to start download process', details: err.message });
  });
});
