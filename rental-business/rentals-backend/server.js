import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import quotesRouter from './routes/quotes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/quotes', quotesRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});