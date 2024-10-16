const HeroSlide = require('../models/heroSlide');
const path = require('path');
const fs = require('fs');

exports.createSlide = async (req, res) => {
  try {
    const { categoryPageId } = req.body;
    const file = req.file;

    if (!file || !categoryPageId) {
      return res.status(400).json({ message: 'Зображення та ID сторінки підкатегорії є обов’язковими.' });
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(__dirname, '../uploads/', fileName);

    fs.renameSync(file.path, filePath);

    const newSlide = new HeroSlide({
      url: `/uploads/${fileName}`,
      categoryPageId
    });

    await newSlide.save();
    res.status(201).json(newSlide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при створенні слайду.' });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return res.status(404).json({ message: 'Слайд не знайдено.' });
    }

    const filePath = path.join(__dirname, '../uploads/', path.basename(slide.url));
    fs.unlinkSync(filePath);

    await HeroSlide.findByIdAndDelete(id);
    res.status(200).json({ message: 'Слайд успішно видалено.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при видаленні слайду.' });
  }
};

exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().populate('categoryPageId'); // populate categoryPageId
    res.status(200).json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні слайдів.' });
  }
};