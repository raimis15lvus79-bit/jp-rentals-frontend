import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';

const app = buildApp();

describe('GET /api/delivery-options', () => {
  it('should return all delivery options', async () => {
    const res = await request(app).get('/api/delivery-options');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return delivery options with correct fields', async () => {
    const res = await request(app).get('/api/delivery-options');
    expect(res.status).toBe(200);
    const option = res.body[0];
    expect(option).toHaveProperty('id');
    expect(option).toHaveProperty('deliveryDays');
    expect(option).toHaveProperty('priceCents');
  });

  it('should include estimatedDeliveryTimeMs when expand=estimatedDeliveryTime', async () => {
    const res = await request(app).get('/api/delivery-options?expand=estimatedDeliveryTime');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const option = res.body[0];
    expect(option).toHaveProperty('estimatedDeliveryTimeMs');
    expect(typeof option.estimatedDeliveryTimeMs).toBe('number');
    expect(option.estimatedDeliveryTimeMs).toBeGreaterThan(Date.now());
  });

  it('should not include estimatedDeliveryTimeMs without expand param', async () => {
    const res = await request(app).get('/api/delivery-options');
    expect(res.status).toBe(200);
    expect(res.body[0]).not.toHaveProperty('estimatedDeliveryTimeMs');
  });

  it('should return delivery options with free shipping option', async () => {
    const res = await request(app).get('/api/delivery-options');
    expect(res.status).toBe(200);
    const freeOption = res.body.find(o => o.priceCents === 0);
    expect(freeOption).toBeDefined();
    expect(freeOption.deliveryDays).toBe(7);
  });
});