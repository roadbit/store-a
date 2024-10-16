const SliderCardRec = require('../models/SliderCardRec');
const ProductPage = require('../models/ProductPage');

exports.createSliderCardRec = async (req, res) => {
  try {
    const { productPage, productName, price, image, promo } = req.body;

    const product = await ProductPage.findById(productPage);

    if (!product) {
      return res.status(404).json({ message: 'Сторінку продукту не знайдено' });
    }

    const newCard = new SliderCardRec({
      productPage: product._id,
      productName: productName || product.title,
      price: price || product.price,
      image: image || product.images[0],
      promo: promo || product.promo,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося створити картку', error });
  }
};

exports.getSliderCardRec = async (req, res) => {
  try {
    const cards = await SliderCardRec.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося отримати картки', error });
  }
};

exports.deleteSliderCardRec = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await SliderCardRec.findById(id);

    if (!card) {
      return res.status(404).json({ message: 'Картка не знайдена' });
    }

    await SliderCardRec.findByIdAndDelete(id);
    res.status(200).json({ message: 'Картку видалено' });
  } catch (error) {
    console.error('Error deleting slider card:', error);
    res.status(500).json({ message: 'Не вдалося видалити картку', error });
  }
};