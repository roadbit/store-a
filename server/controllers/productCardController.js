const ProductCard = require('../models/productCard');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.createProductCard = async (req, res) => {
  try {
    const { title, price, podcategoryPageId, promoLabel, characteristics } = req.body;
    const image = req.file ? req.file.filename : '';

    const parsedCharacteristics = characteristics ? JSON.parse(characteristics) : [];

    const newProductCard = new ProductCard({
      title,
      price,
      image,
      podcategoryPageId,
      promoLabel,
      characteristics: parsedCharacteristics
    });

    await newProductCard.save();
    res.status(201).json(newProductCard);
  } catch (error) {
    res.status(500).json({ message: 'Помилка створення картки', error });
  }
};

exports.getProductCardsByPodcategoryPage = async (req, res) => {
  try {
    const { podcategoryPageId } = req.query;
    const productCards = await ProductCard.find({ podcategoryPageId }).populate('characteristics');
    res.json(productCards);
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження карток', error });
  }
};

exports.getAllProductCards = async (req, res) => {
  try {
    const productCards = await ProductCard.find();
    res.json(productCards);
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження карток', error });
  }
};

exports.searchProductCards = async (req, res) => {
  try {
    const { query } = req.query;

    const products = await ProductCard.find({
      title: { $regex: query, $options: 'i' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Помилка пошуку продуктів', error });
  }
};