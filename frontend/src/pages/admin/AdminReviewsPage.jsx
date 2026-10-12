import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all'
        ? '/api/v1/admin/reviews'
        : `/api/v1/admin/reviews?status=${statusFilter}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/v1/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', text: `Review status changed to ${newStatus}` });
        fetchReviews();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to update review status' });
      }
    } catch {
      setActionFeedback({ type: 'error', text: 'Network error updating review' });
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', text: 'Review deleted successfully' });
        fetchReviews();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to delete review' });
      }
    } catch {
      setActionFeedback({ type: 'error', text: 'Network error deleting review' });
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.customerName?.toLowerCase().includes(q) ||
      r.productName?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-graphite tracking-tight">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Audit and moderate customer evaluations and verified maker hardware ratings
          </p>
        </div>
      </div>

      {actionFeedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 ${
            actionFeedback.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span>{actionFeedback.text}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-brand-graphite text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer or product..."
            className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading catalog reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No reviews matching selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Field Review</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-brand-graphite max-w-xs">
                      <Link
                        to={`/products/${rev.productSlug}`}
                        target="_blank"
                        className="hover:text-[#8B5CF6] inline-flex items-center gap-1 group"
                      >
                        <span className="truncate">{rev.productName}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#8B5CF6]" />
                      </Link>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-brand-graphite">{rev.customerName}</div>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 max-w-sm line-clamp-2">
                      "{rev.comment}"
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, 'approved')}
                            title="Approve Review"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                            title="Reject Review"
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Delete Review"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
