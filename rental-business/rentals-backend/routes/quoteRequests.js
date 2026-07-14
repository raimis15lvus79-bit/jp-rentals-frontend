import express from 'express';
import { QuoteRequest } from '../models/QuoteRequest.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, event, date, details } = req.body || {};

  if (!name || !event || !date || !details) {
    return res.status(400).json({ error: 'Please complete every field.' });
  }

  try {
    await QuoteRequest.create({ name, event, date, details });
    console.log('Quote request saved:', { name, event, date, details });
    return res.status(200).json({ message: 'Request received' });
  } catch (error) {
    console.error('Failed to save quote request:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
