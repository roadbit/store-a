const BlogCard = require('../models/BlogCard');

exports.getBlogCards = async (req, res) => {
  try {
    const blogCards = await BlogCard.find();
    res.json(blogCards);
  } catch (error) {
    res.status(500).json({ error: 'Помилка при отриманні карток блогу' });
  }
};

exports.createBlogCard = async (req, res) => {
  const { text, pageId } = req.body;

  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  try {
    const newBlogCard = new BlogCard({
      text,
      pageId,
      image: images.length > 0 ? images[0] : '',
    });
    await newBlogCard.save();
    res.json(newBlogCard);
  } catch (error) {
    res.status(500).json({ error: 'Помилка при створенні картки блогу' });
  }
};

exports.updateBlogCard = async (req, res) => {
  const { text, pageId } = req.body;

  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
  const image = images.length > 0 ? images[0] : req.body.existingImage;

  try {
    const updatedBlogCard = await BlogCard.findByIdAndUpdate(req.params.id, {
      text,
      pageId,
      image,
    }, { new: true });
    res.json(updatedBlogCard);
  } catch (error) {
    res.status(500).json({ error: 'Помилка при оновленні картки блогу' });
  }
};

exports.deleteBlogCard = async (req, res) => {
  try {
    await BlogCard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Картка блогу успішно видалена' });
  } catch (error) {
    res.status(500).json({ error: 'Помилка при видаленні картки блогу' });
  }
};