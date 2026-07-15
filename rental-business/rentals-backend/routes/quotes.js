import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

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

    if (
      !customer ||
      !customer.fullName?.trim() ||
      !customer.email?.trim() ||
      !quote ||
      !Array.isArray(quote.items) ||
      quote.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the required quote request details.'
      });
    }

    if (
      quote.fulfillmentType === 'delivery' &&
      (!quote.deliveryAddress || !quote.deliveryAddress.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for delivery quotes.'
      });
    }

    const itemsList = quote.items
      .map((item) => `- ${item.name} x ${item.quantity}`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.QUOTE_TO_EMAIL || process.env.EMAIL_USER,
      replyTo: customer.email,
      subject: `New Quote Request from ${customer.fullName}`,
      text: `
New quote request received

Customer Information
Name: ${customer.fullName}
Email: ${customer.email}
Event Type: ${customer.eventType || 'Not provided'}
Guest Count: ${customer.guestCount || 'Not provided'}

Quote Details
Rental Start: ${quote.rentalDates?.start || 'Not provided'}
Rental End: ${quote.rentalDates?.end || 'Not provided'}
Fulfillment Type: ${quote.fulfillmentType || 'Not provided'}
Delivery Address: ${quote.deliveryAddress || 'Not provided'}

Requested Items
${itemsList}

Notes
${customer.notes || 'No notes provided'}
      `.trim()
    };

    await transporter.sendMail(mailOptions);

    console.log('New quote request emailed:', req.body);

    return res.status(201).json({
      success: true,
      message: 'Quote request received.'
    });
  } catch (error) {
    console.error('Quote submission failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;