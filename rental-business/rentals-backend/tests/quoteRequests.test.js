import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';
import { sequelize, seedDatabase } from './setup.js';

const app = buildApp();

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('POST /api/quotes', () => {
  it('should create a quote request with valid data', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          eventType: 'Wedding',
          guestCount: '100',
          notes: 'Need setup the night before',
        },
        quote: {
          rentalDates: {
            start: '2026-08-10',
            end: '2026-08-11',
          },
          fulfillmentType: 'pickup',
          items: [
            { name: 'White Folding Chair', quantity: 50 },
            { name: '6 Foot Table', quantity: 10 },
          ],
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Quote request received.');
  });

  it('should return 400 when customer is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        quote: {
          fulfillmentType: 'pickup',
          items: [{ name: 'Chair', quantity: 25 }],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when fullName is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          email: 'john@example.com',
        },
        quote: {
          fulfillmentType: 'pickup',
          items: [{ name: 'Chair', quantity: 25 }],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
        },
        quote: {
          fulfillmentType: 'pickup',
          items: [{ name: 'Chair', quantity: 25 }],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when quote is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when items are missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
        quote: {
          fulfillmentType: 'pickup',
          items: [],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when delivery address is missing for delivery quotes', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
        quote: {
          fulfillmentType: 'delivery',
          items: [{ name: 'Chair', quantity: 25 }],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Delivery address is required for delivery quotes.');
  });

  it('should accept delivery quotes when address is provided', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
        quote: {
          fulfillmentType: 'delivery',
          deliveryAddress: '123 Main St, Kaukauna, WI',
          items: [{ name: 'Chair', quantity: 25 }],
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Quote request received.');
  });

  it('should return 400 when body is empty', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });

  it('should return 400 when no body is sent', async () => {
    const res = await request(app).post('/api/quotes');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please complete the required quote request details.');
  });
});