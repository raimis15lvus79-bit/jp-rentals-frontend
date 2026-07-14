import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';

const app = buildApp();

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return products matching search query by name', async () => {
    const res = await request(app).get('/api/products?search=Basketball');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toContain('Basketball');
  });

  it('should return products matching search query by keywords', async () => {
    const res = await request(app).get('/api/products?search=socks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return empty array for non-matching search', async () => {
    const res = await request(app).get('/api/products?search=xyznonexistent');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should return products sorted by createdAt ascending', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    const products = res.body;
    for (let i = 1; i < products.length; i++) {
      expect(new Date(products[i].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(products[i - 1].createdAt).getTime());
    }
  });

  it('should include all expected product fields', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    const product = res.body[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('image');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('rating');
    expect(product).toHaveProperty('priceCents');
    expect(product).toHaveProperty('keywords');
    expect(product).toHaveProperty('createdAt');
    expect(product).toHaveProperty('updatedAt');
  });
});