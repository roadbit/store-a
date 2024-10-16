const ProductPage = require('../models/ProductPage');
const ProductCard = require('../models/productCard');
const Characteristic = require('../models/characteristic');

exports.createProductPage = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const { title, code, price, descrTitle, descrText, promo, characteristics, warranty, podcategoryPageId } = req.body;
    const images = req.files.map(file => file.path);

    const newProductPage = new ProductPage({ 
      title, code, price, images, descrTitle, descrText, promo, 
      warranty: JSON.parse(warranty), 
      characteristics: JSON.parse(characteristics) 
    });

    await newProductPage.save();
    console.log('Product page saved:', newProductPage);

    const newProductCard = new ProductCard({
      title, price, image: images[0], podcategoryPageId, promoLabel: promo, productPageId: newProductPage._id
    });

    await newProductCard.save();
    console.log('Product card saved:', newProductCard);

    res.status(201).json({ productPage: newProductPage, productCard: newProductCard });
  } catch (error) {
    console.error('Error while creating product page:', error);
    res.status(500).json({ message: 'Помилка створення сторінки продукту', error });
  }
};

exports.getProductPageById = async (req, res) => {
  try {
    const productPage = await ProductPage.findById(req.params.id);
    if (!productPage) {
      return res.status(404).json({ message: 'Сторінка не знайдена' });
    }
    res.json(productPage);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання сторінки', error });
  }
};

exports.updateProductPage = async (req, res) => {
  try {
    const { title, price, descrTitle, descrText, promo, characteristics, warranty } = req.body;
    let images = req.files ? req.files.map(file => file.path) : [];

    const existingProduct = await ProductPage.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Сторінка не знайдена' });
    }

    let updatedOldPrice = existingProduct.oldPrice;
    let updatedPromo = promo || existingProduct.promo;

    if (parseFloat(price) < parseFloat(existingProduct.price)) {
      updatedOldPrice = existingProduct.price;
      updatedPromo = 'АКЦІЯ';
    }

    if (images.length > 0) {
      existingProduct.images = images;
    }

    existingProduct.title = title || existingProduct.title;
    existingProduct.price = price || existingProduct.price;
    existingProduct.oldPrice = updatedOldPrice;
    existingProduct.descrTitle = descrTitle || existingProduct.descrTitle;
    existingProduct.descrText = descrText || existingProduct.descrText;
    existingProduct.promo = updatedPromo;

    if (warranty) {
      let warrantyObj;
      try {
        warrantyObj = JSON.parse(warranty);
      } catch (error) {
        warrantyObj = warranty;
      }
      existingProduct.warranty = warrantyObj;
    }

    if (characteristics) {
      existingProduct.characteristics = JSON.parse(characteristics);
    }

    await existingProduct.save();

    await ProductCard.updateMany(
      { productPageId: existingProduct._id },
      { 
        title, 
        price, 
        oldPrice: updatedOldPrice,
        promoLabel: updatedPromo 
      }
    );

    res.json(existingProduct);
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення сторінки', error });
  }
};


exports.getAllProductPages = async (req, res) => {
  try {
    const productPages = await ProductPage.find();
    res.json(productPages);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання всіх сторінок', error });
  }
};

exports.deleteProductPage = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductCard.deleteMany({ productPageId: id });

    const deletedPage = await ProductPage.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).json({ message: 'Сторінка не знайдена' });
    }

    res.status(200).json({ message: 'Сторінка продукту успішно видалена' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні сторінки продукту', error });
  }
};