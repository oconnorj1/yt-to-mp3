import express from 'express';
import cors from 'cors';
import { jobsRouter } from './routes/jobs.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', jobsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
