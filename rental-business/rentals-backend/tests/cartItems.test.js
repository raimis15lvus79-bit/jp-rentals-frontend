import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';
import { CartItem, sequelize, seedDatabase } from './setup.js';

const app = buildApp();

describe('Cart Items API', () => {
  beforeEach(async () => {
    // Reset cart items to default state before each test
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

  describe('GET /api/cart-items', () => {
    it('should return all cart items', async () => {
      const res = await request(app).get('/api/cart-items');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should include product details when expand=product', async () => {
      const res = await request(app).get('/api/cart-items?expand=product');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      const item = res.body[0];
      expect(item).toHaveProperty('product');
      expect(item.product).toHaveProperty('name');
      expect(item.product).toHaveProperty('priceCents');
    });

    it('should not include product details without expand param', async () => {
      const res = await request(app).get('/api/cart-items');
      expect(res.status).toBe(200);
      expect(res.body[0]).not.toHaveProperty('product');
    });
  });

  describe('POST /api/cart-items', () => {
    it('should add a new item to the cart', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.productId).toBe('15b6fc6f-327a-4ec4-896f-486349e85a3d');
      expect(res.body.quantity).toBe(1);
    });

    it('should increment quantity if item already exists', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 3 });
      expect(res.status).toBe(201);
      expect(res.body.productId).toBe('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
      expect(res.body.quantity).toBe(5); // 2 (default) + 3
    });

    it('should return 400 for non-existent product', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: '00000000-0000-0000-0000-000000', quantity: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Product not found');
    });

    it('should return 400 for invalid quantity (too low)', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 0 });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Quantity');
    });

    it('should return 400 for invalid quantity (too high)', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 11 });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Quantity');
    });

    it('should return 400 for non-numeric quantity', async () => {
      const res = await request(app)
        .post('/api/cart-items')
        .send({ productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 'abc' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Quantity');
    });
  });

  describe('PUT /api/cart-items/:productId', () => {
    it('should update quantity of a cart item', async () => {
      const res = await request(app)
        .put('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        .send({ quantity: 5 });
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
    });

    it('should update delivery option of a cart item', async () => {
      const res = await request(app)
        .put('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        .send({ deliveryOptionId: '2' });
      expect(res.status).toBe(200);
      expect(res.body.deliveryOptionId).toBe('2');
    });

    it('should update both quantity and delivery option', async () => {
      const res = await request(app)
        .put('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        .send({ quantity: 3, deliveryOptionId: '3' });
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(3);
      expect(res.body.deliveryOptionId).toBe('3');
    });

    it('should return 404 for non-existent cart item', async () => {
      const res = await request(app)
        .put('/api/cart-items/00000000-0000-0000-0000-000000000000')
        .send({ quantity: 1 });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Cart item not found');
    });

    it('should return 400 for invalid quantity', async () => {
      const res = await request(app)
        .put('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        .send({ quantity: 0 });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Quantity');
    });

    it('should return 400 for invalid delivery option', async () => {
      const res = await request(app)
        .put('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        .send({ deliveryOptionId: 'invalid' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid delivery option');
    });
  });

  describe('DELETE /api/cart-items/:productId', () => {
    it('should delete a cart item', async () => {
      const res = await request(app)
        .delete('/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent cart item', async () => {
      const res = await request(app)
        .delete('/api/cart-items/00000000-0000-0000-0000-000000');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Cart item not found');
    });
  });
});