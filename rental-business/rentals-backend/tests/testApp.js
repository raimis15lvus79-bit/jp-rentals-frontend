import express from 'express';
import { Product, DeliveryOption, CartItem, Order, QuoteRequest } from './setup.js';

/**
 * Builds an Express app with all routes for testing.
 * This mirrors the main server.js but uses the in-memory models.
 */
export function buildApp() {
  const app = express();
  app.use(express.json());

  // Products routes
  const productRouter = express.Router();
  productRouter.get('/', async (req, res) => {
    const { Op } = await import('sequelize');
    const search = req.query.search;
    let products;
    if (search) {
      const searchPattern = `%${search}%`;
      products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { keywords: { [Op.like]: searchPattern } },
          ],
        },
      });
    } else {
      products = await Product.findAll();
    }
    res.json(products);
  });
  app.use('/api/products', productRouter);

  // DeliveryOptions routes
  const deliveryOptionRouter = express.Router();
  deliveryOptionRouter.get('/', async (req, res) => {
    const expand = req.query.expand;
    const deliveryOptions = await DeliveryOption.findAll();
    let response = deliveryOptions;
    if (expand === 'estimatedDeliveryTime') {
      response = deliveryOptions.map(option => ({
        ...option.toJSON(),
        estimatedDeliveryTimeMs: Date.now() + option.deliveryDays * 24 * 60 * 60 * 1000,
      }));
    }
    res.json(response);
  });
  app.use('/api/delivery-options', deliveryOptionRouter);

  // CartItems routes
  const cartItemRouter = express.Router();
  cartItemRouter.get('/', async (req, res) => {
    const expand = req.query.expand;
    let cartItems = await CartItem.findAll();
    if (expand === 'product') {
      cartItems = await Promise.all(cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return { ...item.toJSON(), product };
      }));
    }
    res.json(cartItems);
  });

  cartItemRouter.post('/', async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }
    if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
    }
    let cartItem = await CartItem.findOne({ where: { productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ productId, quantity, deliveryOptionId: '1' });
    }
    res.status(201).json(cartItem);
  });

  cartItemRouter.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;
    const cartItem = await CartItem.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
      }
      cartItem.quantity = quantity;
    }
    if (deliveryOptionId !== undefined) {
      const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
      if (!deliveryOption) {
        return res.status(400).json({ error: 'Invalid delivery option' });
      }
      cartItem.deliveryOptionId = deliveryOptionId;
    }
    await cartItem.save();
    res.json(cartItem);
  });

  cartItemRouter.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    const cartItem = await CartItem.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await cartItem.destroy();
    res.status(204).send();
  });
  app.use('/api/cart-items', cartItemRouter);

  // Orders routes
  const orderRouter = express.Router();
  orderRouter.get('/', async (req, res) => {
    const expand = req.query.expand;
    let orders = await Order.unscoped().findAll({ order: [['orderTimeMs', 'DESC']] });
    if (expand === 'products') {
      orders = await Promise.all(orders.map(async (order) => {
        const products = await Promise.all(order.products.map(async (product) => {
          const productDetails = await Product.findByPk(product.productId);
          return { ...product, product: productDetails };
        }));
        return { ...order.toJSON(), products };
      }));
    }
    res.json(orders);
  });

  orderRouter.post('/', async (req, res) => {
    const cartItems = await CartItem.findAll();
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    let totalCostCents = 0;
    const products = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
      if (!deliveryOption) throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
      const productCost = product.priceCents * item.quantity;
      const shippingCost = deliveryOption.priceCents;
      totalCostCents += productCost + shippingCost;
      const estimatedDeliveryTimeMs = Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;
      return { productId: item.productId, quantity: item.quantity, estimatedDeliveryTimeMs };
    }));
    totalCostCents = Math.round(totalCostCents * 1.1);
    const order = await Order.create({ orderTimeMs: Date.now(), totalCostCents, products });
    await CartItem.destroy({ where: {} });
    res.status(201).json(order);
  });

  orderRouter.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const expand = req.query.expand;
    let order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (expand === 'products') {
      const products = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findByPk(product.productId);
        return { ...product, product: productDetails };
      }));
      order = { ...order.toJSON(), products };
    }
    res.json(order);
  });
  app.use('/api/orders', orderRouter);

  // PaymentSummary routes
  const paymentSummaryRouter = express.Router();
  paymentSummaryRouter.get('/', async (req, res) => {
    const cartItems = await CartItem.findAll();
    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
      totalItems += item.quantity;
      productCostCents += product.priceCents * item.quantity;
      shippingCostCents += deliveryOption.priceCents;
    }
    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;
    res.json({ totalItems, productCostCents, shippingCostCents, totalCostBeforeTaxCents, taxCents, totalCostCents });
  });
  app.use('/api/payment-summary', paymentSummaryRouter);

  // QuoteRequests routes
  const quoteRequestRouter = express.Router();
  quoteRequestRouter.post('/', async (req, res) => {
    const { name, event, date, details } = req.body || {};
    if (!name || !event || !date || !details) {
      return res.status(400).json({ error: 'Please complete every field.' });
    }
    try {
      await QuoteRequest.create({ name, event, date, details });
      return res.status(200).json({ message: 'Request received' });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });
  app.use('/api/quote-requests', quoteRequestRouter);

  // Reset routes
  const resetRouter = express.Router();
  resetRouter.post('/', async (req, res) => {
    const { sequelize } = await import('./setup.js');
    await sequelize.sync({ force: true });
    const { seedDatabase } = await import('./setup.js');
    await seedDatabase();
    res.status(204).send();
  });
  app.use('/api/reset', resetRouter);

  return app;
}