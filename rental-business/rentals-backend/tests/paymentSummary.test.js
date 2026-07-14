import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';
import { CartItem } from './setup.js';

const app = buildApp();

describe('GET /api/payment-summary', () => {
  beforeEach(async () => {
    // Reset cart to default state
    await CartItem.destroy({ where: {} });
    const timestamp = Date.now();
    await CartItem.create({
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1',
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
    });
  });

  it('should return payment summary with all fields', async () => {
    const res = await request(app).get('/api/payment-summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('productCostCents');
    expect(res.body).toHaveProperty('shippingCostCents');
    expect(res.body).toHaveProperty('totalCostBeforeTaxCents');
    expect(res.body).toHaveProperty('taxCents');
    expect(res.body).toHaveProperty('totalCostCents');
  });

  it('should calculate correct values for default cart', async () => {
    const res = await request(app).get('/api/payment-summary');
    expect(res.status).toBe(200);
    // 2 items of product priced at 1090 each
    expect(res.body.totalItems).toBe(2);
    expect(res.body.productCostCents).toBe(2180);
    // Free shipping (deliveryOptionId '1' has priceCents 0)
    expect(res.body.shippingCostCents).toBe(0);
    expect(res.body.totalCostBeforeTaxCents).toBe(2180);
    // 10% tax
    expect(res.body.taxCents).toBe(218);
    expect(res.body.totalCostCents).toBe(2398);
  });

  it('should reflect updated cart items', async () => {
    // Add another item
    await CartItem.create({
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2',
    });

    const res = await request(app).get('/api/payment-summary');
    expect(res.status).toBe(200);
    expect(res.body.totalItems).toBe(3);
    // Product 1: 1090 * 2 = 2180, Product 2: 2095 * 1 = 2095, total: 4275
    expect(res.body.productCostCents).toBe(4275);
    // Shipping: 0 + 499 = 499
    expect(res.body.shippingCostCents).toBe(499);
    expect(res.body.totalCostBeforeTaxCents).toBe(4774);
    expect(res.body.taxCents).toBe(477);
    expect(res.body.totalCostCents).toBe(5251);
  });

  it('should return zero values when cart is empty', async () => {
    await CartItem.destroy({ where: {} });
    const res = await request(app).get('/api/payment-summary');
    expect(res.status).toBe(200);
    expect(res.body.totalItems).toBe(0);
    expect(res.body.productCostCents).toBe(0);
    expect(res.body.shippingCostCents).toBe(0);
    expect(res.body.totalCostBeforeTaxCents).toBe(0);
    expect(res.body.taxCents).toBe(0);
    expect(res.body.totalCostCents).toBe(0);
  });
});