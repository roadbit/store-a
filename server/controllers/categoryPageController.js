const CategoryPage = require('../models/CategoryPage');

exports.createCategoryPage = async (req, res) => {
  try {
    const { title } = req.body;

    const newPage = new CategoryPage({ title });
    await newPage.save();

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category page', error });
  }
};

exports.getCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await CategoryPage.findById(id);
    if (!page) return res.status(404).json({ message: 'Category page not found' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category page', error });
  }
};

exports.getAllCategoryPages = async (req, res) => {
  try {
    const pages = await CategoryPage.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category pages', error });
  }
};

exports.deleteCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPage = await CategoryPage.findByIdAndDelete(id);
    if (!deletedPage) return res.status(404).json({ message: 'Category page not found' });

    res.status(200).json({ message: 'Category page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category page', error });
  }
};