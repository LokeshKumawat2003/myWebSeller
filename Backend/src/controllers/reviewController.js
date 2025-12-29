const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment, order } = req.body;
    const review = new Review({ product, user: req.user._id, rating, comment, order });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
};

exports.listProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
