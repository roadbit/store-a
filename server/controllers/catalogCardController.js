const CatalogCard = require('../models/CatalogCard');

exports.createCard = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file.path;

    const newCard = new CatalogCard({ title, image });
    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating card', error });
  }
};

exports.getCards = async (req, res) => {
  try {
    const cards = await CatalogCard.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error });
  }
};

exports.updateCardCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryPageId } = req.body;

    const updatedCard = await CatalogCard.findByIdAndUpdate(id, { categoryPageId }, { new: true });
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating card', error });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedCard = await CatalogCard.findByIdAndUpdate(id, { title, ...(image && { image }) }, { new: true });

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating card', error });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await CatalogCard.findByIdAndDelete(id);
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error });
  }
};