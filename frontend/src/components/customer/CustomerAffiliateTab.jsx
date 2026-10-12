import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export function CustomerAffiliateTab() {
  const [loading, setLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState(null);
  const [customCode, setCustomCode] = useState('');
  const [registering, setRegistering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Payout state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('bKash');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [requestingPayout, setRequestingPayout] = useState(false);

  const fetchAffiliateProfile = async () => {
    try {
      const res = await fetch('/api/v1/affiliates/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAffiliateData(data);
        }
      }
    } catch (err) {
      console.error('Error fetching affiliate profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateProfile();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/v1/affiliates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customCode: customCode ? customCode.trim() : undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: 'Welcome to the LazyForge Partner Alliance!' });
        fetchAffiliateProfile();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to enroll in affiliate program' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error connecting to partner gateway' });
    } finally {
      setRegistering(false);
    }
  };

  const handleCopyLink = () => {
    if (!affiliateData?.affiliate?.referralCode) return;
    const link = `${window.location.origin}/?ref=${affiliateData.affiliate.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!payoutDetails.trim()) {
      setFeedback({ type: 'error', message: 'Please provide your mobile wallet number or banking info' });
      return;
    }

    setRequestingPayout(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/v1/affiliates/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          payoutMethod,
          payoutDetails: payoutDetails.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setShowPayoutModal(false);
        fetchAffiliateProfile();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit payout request' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error processing payout' });
    } finally {
      setRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-brand-muted animate-pulse">
        Connecting to LazyForge Partner Ledger...
      </div>
    );
  }

  // Not yet registered
  if (!affiliateData || !affiliateData.isAffiliate) {
    return (
      <div className="space-y-6">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-graphite via-[#1E1B4B] to-brand-graphite text-white border border-purple-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Maker & Creator Alliance</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Earn 5% Commission on Hardware Referrals
            </h2>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Share your custom LazyForge link with researchers, students, and robotics makers. Every time someone completes an order using your link or code, 5% of the hardware order value is credited directly to your partner wallet.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#00F0FF] block">5.0% Baseline</span>
                <span className="text-gray-400 text-[11px]">On all robotics & kits</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-purple-300 block">৳500 Threshold</span>
                <span className="text-gray-400 text-[11px]">Direct bKash / Nagad</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-400 block">Real-Time Ledger</span>
                <span className="text-gray-400 text-[11px]">Instant audit attribution</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="pt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Custom Referral Code (Optional, e.g. ROBO-MAKER)"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] flex-1 font-mono uppercase"
              />
              <button
                type="submit"
                disabled={registering}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#00D4E0] text-brand-graphite font-black text-xs shadow-lg hover:shadow-[#00F0FF]/30 transition-all flex items-center justify-center gap-2"
              >
                {registering ? (
                  <div className="w-4 h-4 border-2 border-brand-graphite border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                <span>Enroll in Alliance</span>
              </button>
            </form>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'error'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {feedback.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const aff = affiliateData.affiliate;
  const referrals = affiliateData.referrals || [];
  const referralLink = `${window.location.origin}/?ref=${aff.referralCode}`;

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Referral Link Showcase Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-graphite to-[#1E1B4B] text-white border border-purple-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00F0FF]">
              Your Active Partner Link
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Share & Earn 5% On Every Order
            </h3>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={aff.balance < 500}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00D4E0] text-brand-graphite text-xs font-extrabold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            <Wallet className="w-4 h-4" />
            <span>Request Payout</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 p-2 rounded-2xl border border-white/20">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="bg-transparent px-3 py-2 text-xs font-mono text-purple-200 focus:outline-none flex-1 truncate"
          />
          <button
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-[#00F0FF]">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 font-mono">
          Referral Code: <span className="font-bold text-white">{aff.referralCode}</span> (Direct URL or entered at checkout)
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Available Balance</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            ৳{aff.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">Min. Payout ৳500</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Total Lifetime Earned</span>
          <span className="text-2xl font-black text-brand-graphite font-mono">
            ৳{aff.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">Accumulated rewards</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Commission Rate</span>
          <span className="text-2xl font-black text-[#8B5CF6] font-mono">
            {aff.commissionRate}%
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">On hardware subtotal</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 block mb-1">Referred Orders</span>
          <span className="text-2xl font-black text-brand-graphite">
            {referrals.length}
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">Attributed purchases</span>
        </div>
      </div>

      {/* Referred Orders Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-brand-graphite">Referred Orders Ledger</h3>
          <p className="text-xs text-brand-muted">Real-time commission breakdown for verified customer referrals</p>
        </div>

        {referrals.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-400 space-y-2">
            <Share2 className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="font-bold">No Referred Orders Yet</p>
            <p className="max-w-xs mx-auto text-gray-400">
              Share your link on robotics forums, YouTube tutorials, and maker groups to start collecting commissions!
            </p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden text-xs">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-4 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-brand-graphite">
                      Order #{ref.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {ref.orderStatus}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted">
                    {new Date(ref.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-gray-400 text-[11px] block">Order Subtotal</span>
                    <span className="font-mono font-bold text-brand-graphite">৳{ref.orderTotal.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Your Commission</span>
                    <span className="font-mono font-black text-emerald-600">৳{ref.commissionAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRequestPayout}
            className="w-full max-w-md p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-base font-black text-brand-graphite">Request Commission Payout</h4>
                <p className="text-xs text-brand-muted">Available balance: ৳{aff.balance.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Disbursement Gateway
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="bKash">bKash (Personal/Merchant)</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank Transfer">Direct Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Wallet Number / Account Info
              </label>
              <input
                type="text"
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder="e.g. 017XXXXXXXX (bKash Personal)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-purple-800">
              Payouts are audited and disbursed within 24–48 hours by LazyForge Finance.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestingPayout}
                className="px-5 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold hover:bg-[#7C3AED] transition-all disabled:opacity-50"
              >
                {requestingPayout ? 'Submitting...' : 'Confirm Payout Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
