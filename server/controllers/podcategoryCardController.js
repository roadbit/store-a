const PodcategoryCard = require('../models/PodcategoryCard');

exports.createPodcategoryCard = async (req, res) => {
  try {
    const { title, categoryPageId } = req.body;
    const image = req.file ? req.file.path : undefined;

    const newCard = new PodcategoryCard({ title, image, categoryPageId });
    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory card', error });
  }
};

exports.getPodcategoryCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await PodcategoryCard.findById(id);
    if (!card) return res.status(404).json({ message: 'Subcategory card not found' });
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategory card', error });
  }
};

exports.getAllPodcategoryCards = async (req, res) => {
  try {
    const cards = await PodcategoryCard.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategory cards', error });
  }
};

exports.updatePodcategoryCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categoryPageId } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedCard = await PodcategoryCard.findByIdAndUpdate(
      id,
      { title, ...(image && { image }), categoryPageId },
      { new: true }
    );

    if (!updatedCard) return res.status(404).json({ message: 'Subcategory card not found' });

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subcategory card', error });
  }
};

exports.deletePodcategoryCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await PodcategoryCard.findByIdAndDelete(id);

    if (!deletedCard) return res.status(404).json({ message: 'Subcategory card not found' });

    res.status(200).json({ message: 'Subcategory card deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory card', error });
  }
};