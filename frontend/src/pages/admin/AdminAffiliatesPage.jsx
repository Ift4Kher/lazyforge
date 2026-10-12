import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  Edit2,
  Check,
  Search,
  AlertCircle,
  Share2,
  Download,
} from 'lucide-react';

export function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingRate, setEditingRate] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/v1/admin/affiliates/export', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to export affiliates report');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lazyforge-affiliates-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setFeedback({ type: 'error', text: 'Error downloading affiliates report' });
    } finally {
      setIsExporting(false);
    }
  };

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/affiliates', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAffiliates(data.affiliates || []);
        }
      }
    } catch (err) {
      console.error('Failed to load affiliates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/v1/admin/affiliates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', text: `Partner status updated successfully` });
        fetchAffiliates();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to update partner status' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error updating partner status' });
    }
  };

  const handleSaveRate = async (id) => {
    const rate = parseFloat(editingRate);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      setFeedback({ type: 'error', text: 'Commission rate must be between 0% and 50%' });
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/affiliates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ commissionRate: rate }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', text: `Commission rate updated to ${rate}%` });
        setEditingId(null);
        fetchAffiliates();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to update commission rate' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error updating commission rate' });
    }
  };

  const filteredAffiliates = affiliates.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.partnerName?.toLowerCase().includes(q) ||
      a.partnerEmail?.toLowerCase().includes(q) ||
      a.referralCode?.toLowerCase().includes(q)
    );
  });

  const totalPartners = affiliates.length;
  const totalPaidOut = affiliates.reduce((sum, a) => sum + (a.totalEarned - a.balance), 0);
  const totalPendingBalance = affiliates.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-graphite tracking-tight">
            Affiliate & Creator Partners
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Manage partner referral codes, commission disbursements, and marketing attribution
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-accent text-white shadow-glow-sm hover:bg-brand-accentHover transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Exporting...' : 'Export Directory CSV'}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Enrolled Partners</span>
          <span className="text-2xl font-black text-brand-graphite">{totalPartners}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Pending Partner Balance</span>
          <span className="text-2xl font-black text-amber-600 font-mono">
            ৳{totalPendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Total Commissions Distributed</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            ৳{totalPaidOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, email, or referral code..."
            className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6] w-full"
          />
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading partner directory...</div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No affiliate partners registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Partner Profile</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Commission Rate</th>
                  <th className="p-4">Referred Sales</th>
                  <th className="p-4">Wallet Balance</th>
                  <th className="p-4">Total Earned</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAffiliates.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-brand-graphite">{a.partnerName}</div>
                      <div className="text-[11px] text-gray-400">{a.partnerEmail}</div>
                      {a.partnerPhone && (
                        <div className="text-[10px] text-gray-400 font-mono">{a.partnerPhone}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-[#8B5CF6] border border-purple-200">
                        {a.referralCode}
                      </span>
                    </td>

                    <td className="p-4">
                      {editingId === a.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={editingRate}
                            onChange={(e) => setEditingRate(e.target.value)}
                            className="w-16 px-2 py-1 rounded border border-purple-400 text-xs font-mono font-bold"
                          />
                          <button
                            onClick={() => handleSaveRate(a.id)}
                            className="p-1 rounded bg-emerald-500 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-gray-200 text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-graphite">
                          <span>{a.commissionRate}%</span>
                          <button
                            onClick={() => {
                              setEditingId(a.id);
                              setEditingRate(String(a.commissionRate));
                            }}
                            className="text-gray-400 hover:text-[#8B5CF6]"
                            title="Edit commission rate"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-mono font-bold text-brand-graphite">
                      {a.totalReferrals}
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-600">
                      ৳{a.balance.toFixed(2)}
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-600">
                      ৳{a.totalEarned.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          a.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {a.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(a.id, a.isActive)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          a.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {a.isActive ? 'Suspend' : 'Activate'}
                      </button>
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
