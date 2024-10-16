const PodcategoryPage = require('../models/PodcategoryPage');
const PodcategoryCard = require('../models/PodcategoryCard');

exports.createPodcategoryPage = async (req, res) => {
  try {
    const { podcategoryCardId } = req.body;
    const podcategoryCard = await PodcategoryCard.findById(podcategoryCardId);

    if (!podcategoryCard) {
      return res.status(404).json({ message: 'Podcategory card not found' });
    }

    const newPage = new PodcategoryPage({
      title: podcategoryCard.title,
      name: podcategoryCard.title,
      podcategoryCardId
    });

    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating podcategory page:', error);
    res.status(500).json({ message: 'Error creating podcategory page', error });
  }
};

exports.deletePodcategoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPage = await PodcategoryPage.findByIdAndDelete(id);
    if (!deletedPage) return res.status(404).json({ message: 'Podcategory page not found' });
    res.status(200).json({ message: 'Podcategory page deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting podcategory page', error });
  }
};

exports.getPodcategoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await PodcategoryPage.findById(id);
    if (!page) return res.status(404).json({ message: 'Podcategory page not found' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching podcategory page', error });
  }
};

exports.getAllPodcategoryPages = async (req, res) => {
  try {
    const pages = await PodcategoryPage.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching podcategory pages', error });
  }
};