import { Op } from 'sequelize';
import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const search = req.query.search;

  let products;
  if (search) {
    // Filter at the database level using LIKE
    const searchPattern = `%${search}%`;
    products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { keywords: { [Op.like]: searchPattern } }
        ]
      }
    });
  } else {
    products = await Product.findAll();
  }

  res.json(products);
});

export default router;