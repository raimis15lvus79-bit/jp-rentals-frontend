import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('Missing EMAIL_USER or EMAIL_PASS environment variables.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer, quote } = req.body;

    const fullName = customer?.fullName?.trim() || '';
    const email = customer?.email?.trim() || '';
    const eventType = customer?.eventType?.trim() || '';
    const guestCount = customer?.guestCount?.toString().trim() || '';
    const notes = customer?.notes?.trim() || '';

    const fulfillmentType = quote?.fulfillmentType?.trim() || '';
    const deliveryAddress = quote?.deliveryAddress?.trim() || '';
    const rentalStart = quote?.rentalDates?.start?.trim() || '';
    const rentalEnd = quote?.rentalDates?.end?.trim() || '';
    const items = Array.isArray(quote?.items) ? quote.items : [];

    if (!fullName || !email || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the required quote request details.'
      });
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for delivery quotes.'
      });
    }

    const invalidItem = items.find(
      (item) =>
        !item ||
        !item.name ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: 'One or more rental items are invalid.'
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured.'
      });
    }

    const itemsList = items
      .map((item) => `- ${item.name} x ${item.quantity}`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.QUOTE_TO_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Quote Request from ${fullName}`,
      text: `
New quote request received

Customer Information
Name: ${fullName}
Email: ${email}
Event Type: ${eventType || 'Not provided'}
Guest Count: ${guestCount || 'Not provided'}

Quote Details
Rental Start: ${rentalStart || 'Not provided'}
Rental End: ${rentalEnd || 'Not provided'}
Fulfillment Type: ${fulfillmentType || 'Not provided'}
Delivery Address: ${deliveryAddress || 'Not provided'}

Requested Items
${itemsList}

Notes
${notes || 'No notes provided'}
      `.trim()
    };

    await transporter.sendMail(mailOptions);

    console.log('New quote request emailed successfully.');

    return res.status(201).json({
      success: true,
      message: 'Quote request received.'
    });
  } catch (error) {
    console.error('Quote submission failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

export default router;