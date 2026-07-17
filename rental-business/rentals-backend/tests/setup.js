import { Sequelize, DataTypes } from 'sequelize';
import sqlJsAsSqlite3 from 'sql.js-as-sqlite3';

// Create an in-memory SQLite database for testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlJsAsSqlite3,
  storage: ':memory:',
  logging: false,
});

// Define models inline to avoid importing from the main app
// (which would trigger hooks and file-based SQLite persistence)
export const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('keywords').split(',');
      },
      set(val) {
        this.setDataValue('keywords', val.join(','));
      },
    },
    createdAt: {
      type: DataTypes.DATE(3),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
    },
  },
  {
    defaultScope: {
      order: [['createdAt', 'ASC']],
    },
  }
);

export const DeliveryOption = sequelize.define(
  'DeliveryOption',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    deliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(3),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
    },
  },
  {
    defaultScope: {
      order: [['createdAt', 'ASC']],
    },
  }
);

export const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryOptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(3),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
    },
  },
  {
    defaultScope: {
      order: [['createdAt', 'ASC']],
    },
  }
);

export const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderTimeMs: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    totalCostCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(3),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
    },
  },
  {
    defaultScope: {
      order: [['createdAt', 'ASC']],
    },
  }
);

export const QuoteRequest = sequelize.define(
  'QuoteRequest',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerFullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEventType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerGuestCount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rentalStart: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rentalEnd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fulfillmentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(3),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
    },
  },
  {
    defaultScope: {
      order: [['createdAt', 'ASC']],
    },
  }
);

// Default data for seeding
export const defaultProducts = [
  {
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    image: 'images/athletic-cotton-socks-6-pairs.jpg',
    name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    rating: { stars: 4.5, count: 87 },
    priceCents: 1090,
    keywords: ['socks', 'sports', 'athletic'],
  },
  {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    image: 'images/intermediate-composite-basketball.jpg',
    name: 'Intermediate Size Basketball',
    rating: { stars: 4, count: 127 },
    priceCents: 2095,
    keywords: ['sports', 'basketballs'],
  },
];

export const defaultDeliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999,
  },
];

export const defaultCart = [
  {
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1',
  },
];

export const defaultOrders = [
  {
    id: 'order1',
    orderTimeMs: Date.now() - 86400000,
    totalCostCents: 2398,
    products: [
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        estimatedDeliveryTimeMs: Date.now() + 604800000,
      },
    ],
  },
];

// Seed the database with default data
export async function seedDatabase() {
  const timestamp = Date.now();

  const productsWithTimestamps = defaultProducts.map((product, index) => ({
    ...product,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
    ...option,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  const ordersWithTimestamps = defaultOrders.map((order, index) => ({
    ...order,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  await Product.bulkCreate(productsWithTimestamps);
  await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
  await CartItem.bulkCreate(cartItemsWithTimestamps);
  await Order.bulkCreate(ordersWithTimestamps);
}

export { sequelize };