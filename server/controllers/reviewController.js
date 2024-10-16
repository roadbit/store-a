const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (error) {
    res.status(500).send('Помилка сервера');
  }
};

exports.createReview = async (req, res) => {
  const { name, pros, cons, reviewText, date, rating, productId } = req.body;

  const newReview = new Review({
    name,
    pros,
    cons,
    reviewText,
    date: date || new Date(),
    rating,
    likes: 0,
    dislikes: 0,
    replies: [],
    productId,
  });

  try {
    await newReview.save();
    res.status(201).send('Відгук збережено');
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(500).send('Помилка сервера: ' + error.message);
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { likes, dislikes, replies } = req.body;

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).send('Відгук не знайдено');
    }

    if (likes !== undefined) {
      review.likes = likes;
    }
    if (dislikes !== undefined) {
      review.dislikes = dislikes;
    }

    if (replies) {
      review.replies = replies;
    }

    await review.save();
    res.status(200).send('Відгук оновлено');
  } catch (error) {
    res.status(500).send('Помилка сервера');
  }
};

exports.getReviewCountByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const count = await Review.countDocuments({ productId });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання кількості відгуків' });
  }
};

exports.getAllReviewsFromAllProducts = async (req, res) => {
  try {
    const reviews = await Review.find().populate('productId', 'title');
    res.json(reviews);
  } catch (error) {
    console.error('Помилка отримання всіх відгуків:', error);
    res.status(500).send('Помилка сервера');
  }
};

exports.deleteReviews = async (req, res) => {
  const { ids } = req.body;

  try {
    await Review.deleteMany({ _id: { $in: ids } });
    res.status(200).send('Відгуки видалено');
  } catch (error) {
    console.error('Помилка видалення відгуків:', error);
    res.status(500).send('Помилка сервера');
  }
};