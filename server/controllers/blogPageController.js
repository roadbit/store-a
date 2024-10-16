const BlogPage = require('../models/BlogPage');

exports.createBlogPage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files.map(file => file.path);

    const newBlogPage = new BlogPage({ title, description, images });
    await newBlogPage.save();

    res.status(201).json(newBlogPage);
  } catch (error) {
    console.error('Error creating blog page:', error);
    res.status(500).json({ message: 'Error creating blog page', error });
  }
};

exports.getAllBlogPages = async (req, res) => {
  try {
    const pages = await BlogPage.find();
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching blog pages:', error);
    res.status(500).json({ message: 'Error fetching blog pages', error });
  }
};

exports.getBlogPageById = async (req, res) => {
  try {
    const page = await BlogPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Blog page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching blog page:', error);
    res.status(500).json({ message: 'Error fetching blog page', error });
  }
};

exports.updateBlogPage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    const page = await BlogPage.findById(id);
    if (!page) {
      return res.status(404).json({ message: 'Blog page not found' });
    }

    page.title = title || page.title;
    page.description = description || page.description;
    if (req.files.length > 0) {
      page.images = req.files.map(file => file.path);
    }

    await page.save();
    res.status(200).json(page);
  } catch (error) {
    console.error('Error updating blog page:', error);
    res.status(500).json({ message: 'Error updating blog page', error });
  }
};

exports.deleteBlogPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await BlogPage.findByIdAndDelete(id);
    if (!page) {
      return res.status(404).json({ message: 'Blog page not found' });
    }
    res.status(200).json({ message: 'Blog page deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog page:', error);
    res.status(500).json({ message: 'Error deleting blog page', error });
  }
};