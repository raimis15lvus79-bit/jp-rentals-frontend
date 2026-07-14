import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './testApp.js';
import { Product, DeliveryOption, CartItem, Order } from './setup.js';

const app = buildApp();

describe('POST /api/reset', () => {
  it('should reset the database and return 204', async () => {
    // First, modify the database state
    await CartItem.destroy({ where: {} });
    await Order.destroy({ where: {} });

    // Verify it's modified
    const cartBefore = await CartItem.findAll();
    expect(cartBefore.length).toBe(0);

    // Reset
    const res = await request(app).post('/api/reset');
    expect(res.status).toBe(204);

    // Verify data is restored
    const products = await Product.findAll();
    expect(products.length).toBeGreaterThan(0);

    const deliveryOptions = await DeliveryOption.findAll();
    expect(deliveryOptions.length).toBeGreaterThan(0);

    const cartAfter = await CartItem.findAll();
    expect(cartAfter.length).toBeGreaterThan(0);

    const ordersAfter = await Order.findAll();
    expect(ordersAfter.length).toBeGreaterThan(0);
  });

  it('should restore default products after reset', async () => {
    await request(app).post('/api/reset');
    const products = await Product.findAll();
    expect(products.length).toBe(2);
    expect(products[0].name).toContain('Socks');
    expect(products[1].name).toContain('Basketball');
  });

  it('should restore default delivery options after reset', async () => {
    await request(app).post('/api/reset');
    const deliveryOptions = await DeliveryOption.findAll();
    expect(deliveryOptions.length).toBe(3);
  });

  it('should restore default cart items after reset', async () => {
    await request(app).post('/api/reset');
    const cartItems = await CartItem.findAll();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].quantity).toBe(2);
  });

  it('should restore default orders after reset', async () => {
    await request(app).post('/api/reset');
    const orders = await Order.findAll();
    expect(orders.length).toBe(1);
    expect(orders[0].totalCostCents).toBe(2398);
  });
});