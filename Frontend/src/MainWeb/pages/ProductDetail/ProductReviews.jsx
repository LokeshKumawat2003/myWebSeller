import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getProductReviews, createReview, getAuthToken } from '../../../services/api';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId]);
console.log('Product ID for reviews:', productId);
  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const data = await getProductReviews(productId);
      console.log('Fetched reviews:', data);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
    // fetchReviews();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      const token = getAuthToken();
      await createReview({ product: productId, rating, comment }, token);
      setSuccess('Review submitted!');
      setRating(0);
      setComment('');
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = !!getAuthToken();

  if (!productId) return null;

  return (
    <div className="mt-12 border-t border-[#e6ddd2] pt-12">
      <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] mb-8 tracking-[1px]">Customer Reviews</h2>

      {isLoggedIn && (
        <div className="mb-8">
          {!showForm ? (
            <button
              className="bg-[#9c7c3a] text-white px-6 py-2 rounded font-serif font-medium hover:bg-[#8a6a2f] transition-colors"
              onClick={() => setShowForm(true)}
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#fbf7f2] p-6 rounded-lg shadow max-w-xl mx-auto flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[#3b3b3b]">Your Rating:</span>
                {[1,2,3,4,5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#e6ddd2]'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="border border-[#e6ddd2] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] font-sans text-[#3b3b3b]"
                placeholder="Write your review..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#9c7c3a] text-white px-6 py-2 rounded font-serif font-medium hover:bg-[#8a6a2f] transition-colors"
                  disabled={submitting || rating === 0}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-[#e6ddd2] text-[#3b3b3b] font-sans hover:bg-[#e6ddd2]"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
              {success && <div className="text-green-600 font-sans">{success}</div>}
              {error && <div className="text-red-600 font-sans">{error}</div>}
            </form>
          )}
        </div>
      )}

      {loading ? null : error ? (
        <div className="text-red-600 font-sans">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-[#3b3b3b] font-sans">No reviews yet. Be the first to review!</div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-[#e6ddd2] pb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-[#e6ddd2] rounded-full flex items-center justify-center">
                  <span className="text-sm font-sans font-medium text-[#3b3b3b]">
                    {review.user?.name ? review.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-serif font-medium text-[#9c7c3a]">{review.user?.name || 'User'}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#e6ddd2]'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-[#3b3b3b] font-sans">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-[#3b3b3b] font-sans">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;