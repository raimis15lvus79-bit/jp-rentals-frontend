import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const quoteRequest = req.body;

    console.log('New quote request:', quoteRequest);

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Quote submission failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;