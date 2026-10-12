import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, ThumbsUp, Send, AlertCircle, Sparkles } from 'lucide-react';

export function ProductReviewsSection({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 5.0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchReviews = () => {
    if (!productId) return;
    fetch(`/api/v1/products/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews || []);
          if (data.summary) {
            setSummary(data.summary);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load reviews:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 5) {
      setStatusMessage({ type: 'error', text: 'Please write a review of at least 5 characters.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/v1/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Review published successfully! Thank you for supporting LazyForge.' });
        setComment('');
        setShowForm(false);
        fetchReviews();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit review' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network connection error while submitting review' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-10 border-t border-brand-border space-y-8" id="product-reviews">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8B5CF6] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Hardware Verification & Telemetry</span>
          </div>
          <h2 className="text-2xl font-extrabold text-brand-graphite mt-1">
            Customer Reviews & Field Reports
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showForm ? 'Close Review Form' : 'Write a Field Review'}</span>
        </button>
      </div>

      {/* Review Submission Form Modal / Card */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-gradient-to-br from-brand-graphite to-[#1E1B4B] text-white border border-purple-500/30 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-[#00F0FF]">
              Submit Hardware Evaluation
            </h3>
            <span className="text-[11px] text-brand-silver">LazyForge Verified Telemetry</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-200">
              Star Rating Score
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-gray-500'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-purple-300 ml-2">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">
                Your Name / Call-Sign
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tanvir (BUET Robotics)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1">
              Field Review & Engineering Remarks
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detail build quality, firmware assembly ease, actuator response, and overall verdict..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
              required
            ></textarea>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'error'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00D4E0] text-brand-graphite text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-brand-graphite border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Publish Review</span>
            </button>
          </div>
        </form>
      )}

      {/* Aggregate Rating & Star Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-brand-softGray/50 border border-brand-border">
        {/* Big Score Box */}
        <div className="flex flex-col items-center justify-center p-4 text-center border-b md:border-b-0 md:border-r border-brand-border">
          <div className="text-5xl font-black text-brand-graphite tracking-tight font-mono">
            {summary.averageRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-muted font-medium">
            Based on {summary.totalReviews} verified maker reviews
          </span>
        </div>

        {/* Star Distribution Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2 px-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = summary.breakdown ? summary.breakdown[stars] || 0 : 0;
            const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-brand-muted font-medium font-mono text-right">
                  {stars} Star
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#00F0FF] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-brand-muted text-right font-mono font-bold">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-brand-muted animate-pulse">
            Loading field reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-brand-border p-6 space-y-3">
            <MessageSquare className="w-8 h-8 text-brand-muted mx-auto" />
            <h4 className="text-sm font-bold text-brand-graphite">No reviews yet</h4>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Be the first engineer to deploy this kit and leave a performance verdict!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow hover:bg-[#7C3AED]"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-brand-border hover:border-purple-300 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-graphite">
                        {rev.customerName}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Verified Forge Buyer</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-brand-muted">
                      {new Date(rev.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-brand-muted leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
