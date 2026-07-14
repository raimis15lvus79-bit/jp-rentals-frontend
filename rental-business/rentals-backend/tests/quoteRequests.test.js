import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';

const app = buildApp();

describe('POST /api/quote-requests', () => {
  it('should create a quote request with valid data', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({
        name: 'John Doe',
        event: 'Wedding',
        date: '2025-06-15',
        details: 'Need 50 chairs and 10 tables',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Request received');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({
        event: 'Wedding',
        date: '2025-06-15',
        details: 'Need 50 chairs',
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });

  it('should return 400 when event is missing', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({
        name: 'John Doe',
        date: '2025-06-15',
        details: 'Need 50 chairs',
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });

  it('should return 400 when date is missing', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({
        name: 'John Doe',
        event: 'Wedding',
        details: 'Need 50 chairs',
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });

  it('should return 400 when details is missing', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({
        name: 'John Doe',
        event: 'Wedding',
        date: '2025-06-15',
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });

  it('should return 400 when body is empty', async () => {
    const res = await request(app)
      .post('/api/quote-requests')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });

  it('should return 400 when no body is sent', async () => {
    const res = await request(app)
      .post('/api/quote-requests');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please complete every field.');
  });
});