import express from 'express';
import cors from 'cors';
import { downloadRouter } from './routes/download.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((_req, res, next) => {
  res.setTimeout(10 * 60 * 1000, () => {
    res.status(503).json({ error: 'Request timed out' });
  });
  next();
});

app.use('/api', downloadRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
