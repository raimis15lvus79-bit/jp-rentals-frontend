import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';
import { CartItem, Order, sequelize, seedDatabase } from './setup.js';

const app = buildApp();

describe('Orders API', () => {
  beforeEach(async () => {
    // Reset to default state before each test
    await Order.destroy({ where: {} });
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

  describe('GET /api/orders', () => {
      await Order.destroy({ where: {} });

    it('should return orders sorted by orderTimeMs descending', async () => {
      // Create two orders with different times
      await Order.create({
        orderTimeMs: Date.now() - 100000,
        totalCostCents: 1000,
        products: [],
      });
      await Order.create({
        orderTimeMs: Date.now(),
        totalCostCents: 2000,
        products: [],
      });
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].totalCostCents).toBe(2000);
      expect(res.body[1].totalCostCents).toBe(1000);
    });

    it('should include product details when expand=products', async () => {
      const order = await Order.create({
        orderTimeMs: Date.now(),
        totalCostCents: 2398,
        products: [
          {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            estimatedDeliveryTimeMs: Date.now() + 604800000,
          },
        ],
      });
      const res = await request(app).get('/api/orders?expand=products');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].products[0]).toHaveProperty('product');
      expect(res.body[0].products[0].product).toHaveProperty('name');
    });
    it('should not crash when expand has an invalid value', async () => {
      await Order.create({
        orderTimeMs: Date.now(),
        totalCostCents: 1000,
        products: [],
      });
      const res = await request(app).get('/api/orders?expand=invalid');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });
  describe('POST /api/orders', () => {
    it('should create an order from cart items', async () => {
      const res = await request(app).post('/api/orders');
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('orderTimeMs');
      expect(res.body).toHaveProperty('totalCostCents');
      expect(res.body).toHaveProperty('products');
      expect(res.body.products.length).toBe(1);
      expect(res.body.products[0].productId).toBe('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
      expect(res.body.products[0].quantity).toBe(2);
    });

    it('should calculate total cost correctly (product cost + shipping + 10% tax)', async () => {
      const res = await request(app).post('/api/orders');
      expect(res.status).toBe(201);
      // product: 1090 * 2 = 2180, shipping: 0, subtotal: 2180, total: 2180 * 1.1 = 2398
      expect(res.body.totalCostCents).toBe(2398);
    });

    it('should clear the cart after creating an order', async () => {
      await request(app).post('/api/orders');
      const cartRes = await request(app).get('/api/cart-items');
      expect(cartRes.body.length).toBe(0);
    });


    it('should handle a cart item with quantity 0', async () => {
      await CartItem.destroy({ where: {} });
      const timestamp = Date.now();
      await CartItem.create({
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 0,
        deliveryOptionId: '1',
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      });
      const res = await request(app).post('/api/orders');
      // The API should either skip the zero-quantity item or reject the request
      expect([400, 201]).toContain(res.status);
      if (res.status === 400) {
        expect(res.body).toHaveProperty('error');
      }
    });
  });

  describe('GET /api/orders/:orderId', () => {
    it('should return a specific order by ID', async () => {
      const createRes = await request(app).post('/api/orders');
      const orderId = createRes.body.id;
      const res = await request(app).get(`/api/orders/${orderId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app).get('/api/orders/00000000-0000-0000-0000-000000');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });

    it('should include product details when expand=products', async () => {
      const createRes = await request(app).post('/api/orders');
      const orderId = createRes.body.id;
      const res = await request(app).get(`/api/orders/${orderId}?expand=products`);
      expect(res.status).toBe(200);
      expect(res.body.products[0]).toHaveProperty('product');
      expect(res.body.products[0].product).toHaveProperty('name');
    });
  });
});