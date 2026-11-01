import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  Download,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Key,
  Check,
} from 'lucide-react';
import { formatBDT } from '../../utils/currency';

export function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [activeOrder, setActiveOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // BDCourier Integration State
  const [bdCourierData, setBdCourierData] = useState({});
  const [isCheckingBDCourier, setIsCheckingBDCourier] = useState(false);
  const [showBDCourierModal, setShowBDCourierModal] = useState(false);
  const [bdCourierSettings, setBdCourierSettings] = useState({
    apiKey: '',
    maskedKey: '',
    hasKey: false,
    isEnabled: true,
    autoCheckCOD: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [testPhone, setTestPhone] = useState('01712345678');
  const [testResult, setTestResult] = useState(null);
  const [isTestingPhone, setIsTestingPhone] = useState(false);

  const fetchBDCourierSettings = async () => {
    try {
      const res = await fetch('/api/v1/admin/courier/bdcourier/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setBdCourierSettings((prev) => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      console.error('Failed to load BDCourier settings:', err);
    }
  };

  useEffect(() => {
    fetchBDCourierSettings();
  }, []);

  const handleSaveBDCourierSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/v1/admin/courier/bdcourier/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: bdCourierSettings.apiKey,
          isEnabled: bdCourierSettings.isEnabled,
          autoCheckCOD: bdCourierSettings.autoCheckCOD,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('BDCourier settings updated successfully!');
        fetchBDCourierSettings();
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      alert('Error communicating with server');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const checkCustomerWithBDCourier = async (phone, orderId = null) => {
    if (!phone) return null;
    setIsCheckingBDCourier(true);
    try {
      const res = await fetch('/api/v1/admin/courier/bdcourier/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setBdCourierData((prev) => ({
          ...prev,
          [phone]: data,
          ...(orderId ? { [orderId]: data } : {}),
        }));
        return data;
      }
    } catch (err) {
      console.error('BDCourier lookup failed:', err);
    } finally {
      setIsCheckingBDCourier(false);
    }
    return null;
  };

  const handleTestPhoneCheck = async (e) => {
    e.preventDefault();
    if (!testPhone.trim()) return;
    setIsTestingPhone(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/v1/admin/courier/bdcourier/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: 'Connection failure.' });
    } finally {
      setIsTestingPhone(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/v1/admin/orders/export?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to export orders CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lazyforge-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error exporting orders report');
    } finally {
      setIsExporting(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', pagination.page.toString());

      const res = await fetch(`/api/v1/admin/orders?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Network communication failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, pagination.page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    setIsUpdating(true);
    try {
      const payload = {};
      if (newOrderStatus) payload.order_status = newOrderStatus;
      if (newPaymentStatus) payload.payment_status = newPaymentStatus;

      const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh local orders
        fetchOrders();
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder((prev) => ({
            ...prev,
            ...payload,
          }));
        }
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}`);
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.data);
        if (data.data.customer_phone) {
          checkCustomerWithBDCourier(data.data.customer_phone, data.data.id);
        }
      }
    } catch {
      alert('Failed to fetch full order details');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold">
            Fulfillment & Commerce
          </span>
          <h1 className="text-2xl font-extrabold text-brand-graphite mt-1">Orders Pipeline</h1>
          <p className="text-xs text-brand-muted mt-1">
            Track customer orders, manage Cash on Delivery verifications, and advance shipments.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowBDCourierModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-200 text-[#0066FF] hover:bg-blue-100 transition-all shadow-2xs cursor-pointer"
            title="Configure BDCourier API & Check COD fraud detection"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>BDCourier</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-accent text-white shadow-glow-sm hover:bg-brand-accentHover transition-all disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-softGray border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-accent' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-4">
          {[
            { label: 'All Orders', value: '' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Processing', value: 'PROCESSING' },
            { label: 'Shipped', value: 'SHIPPED' },
            { label: 'Delivered', value: 'DELIVERED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedStatus(tab.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === tab.value
                  ? 'bg-brand-accent text-white shadow-glow-sm'
                  : 'bg-brand-softGray text-brand-graphite hover:bg-brand-border/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by order number (e.g. LF-...), customer name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-graphite text-white hover:bg-brand-accent transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        {error && (
          <div className="p-4 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-softGray border-b border-brand-border text-brand-muted font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-muted">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-softGray/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-graphite">
                      {order.order_number}
                      <div className="text-[10px] text-brand-muted font-sans font-normal">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-brand-graphite">{order.customer_name}</div>
                      <div className="text-[10px] text-brand-muted flex items-center gap-1.5 mt-0.5">
                        <span>{order.customer_phone}</span>
                        {bdCourierData[order.customer_phone] ? (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-0.5 ${
                              bdCourierData[order.customer_phone].risk_level === 'safe'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : bdCourierData[order.customer_phone].risk_level === 'medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                            title={`BDCourier Success Ratio: ${bdCourierData[order.customer_phone].success_ratio}%`}
                          >
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {bdCourierData[order.customer_phone].success_ratio}%
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              checkCustomerWithBDCourier(order.customer_phone, order.id);
                            }}
                            className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-blue-50 text-[#0066FF] hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                            title="Check buyer history with BDCourier"
                          >
                            Check COD
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-brand-graphite">{order.delivery_city}</div>
                      <div className="text-[10px] text-brand-muted line-clamp-1 max-w-[180px]">
                        {order.delivery_address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono uppercase font-bold">{order.payment_method}</span>
                      <div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            order.payment_status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-accent">
                      {formatBDT(order.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.order_status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : order.order_status === 'SHIPPED'
                            ? 'bg-blue-500/10 text-blue-600'
                            : order.order_status === 'CANCELLED'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderDetails(order.id)}
                        className="p-1.5 rounded-lg border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-graphite/60 backdrop-blur-xs">
          <div className="bg-white border border-brand-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-wider">
                  Order Inspection
                </span>
                <h3 className="text-xl font-extrabold text-brand-graphite font-mono">
                  {activeOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-2 rounded-xl text-brand-muted hover:text-brand-graphite hover:bg-brand-softGray transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="p-4 rounded-xl bg-brand-softGray border border-brand-border space-y-3">
              <span className="text-xs font-bold text-brand-graphite">Update Fulfillment Status:</span>
              <div className="flex flex-wrap gap-2">
                {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    disabled={isUpdating || activeOrder.order_status === st}
                    onClick={() => handleUpdateStatus(activeOrder.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-40 ${
                      activeOrder.order_status === st
                        ? 'bg-brand-accent text-white'
                        : 'bg-white border border-brand-border text-brand-graphite hover:border-brand-accent'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-brand-border text-xs">
                <span className="font-bold text-brand-graphite">Payment:</span>
                <button
                  disabled={isUpdating || activeOrder.payment_status === 'PAID'}
                  onClick={() => handleUpdateStatus(activeOrder.id, null, 'PAID')}
                  className="px-2.5 py-1 rounded bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 disabled:opacity-40"
                >
                  Mark as PAID
                </button>
                <button
                  disabled={isUpdating || activeOrder.payment_status === 'FAILED'}
                  onClick={() => handleUpdateStatus(activeOrder.id, null, 'FAILED')}
                  className="px-2.5 py-1 rounded bg-rose-500 text-white font-bold text-[11px] hover:bg-rose-600 disabled:opacity-40"
                >
                  Mark as FAILED
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[10px] font-mono text-brand-muted uppercase font-bold">
                  Customer Information
                </span>
                <div className="font-bold text-brand-graphite">{activeOrder.customer_name}</div>
                <div className="text-brand-muted">{activeOrder.customer_phone}</div>
                {activeOrder.customer_email && (
                  <div className="text-brand-muted">{activeOrder.customer_email}</div>
                )}
              </div>
              <div className="p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[10px] font-mono text-brand-muted uppercase font-bold">
                  Shipping Address
                </span>
                <div className="font-bold text-brand-graphite">{activeOrder.delivery_city}</div>
                <div className="text-brand-muted">{activeOrder.delivery_address}</div>
                <div className="text-[10px] text-brand-accent font-semibold">
                  Zone: {activeOrder.zone_name || 'Standard Bangladesh Delivery'}
                </div>
              </div>
            </div>

            {/* BDCourier Customer Delivery Intelligence & COD Fraud Verification */}
            {(() => {
              const bdCheck = bdCourierData[activeOrder.customer_phone] || bdCourierData[activeOrder.id];
              return (
                <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/50 space-y-3 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-[#0066FF] flex items-center justify-center text-white shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">BDCourier Risk & Delivery Intelligence</span>
                        <span className="text-[10px] text-slate-500 font-mono">SteadFast • Pathao • RedX National Verification</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => checkCustomerWithBDCourier(activeOrder.customer_phone, activeOrder.id)}
                      disabled={isCheckingBDCourier}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-blue-200 text-[#0066FF] hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCheckingBDCourier ? 'animate-spin' : ''}`} />
                      <span>{isCheckingBDCourier ? 'Analyzing...' : 'Re-check'}</span>
                    </button>
                  </div>

                  {bdCheck ? (
                    <div className="space-y-3 pt-1">
                      {/* Overall Ratio Bar & Risk Badge */}
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200/80">
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Overall Delivery Ratio</div>
                          <div className="text-xl font-black font-mono text-[#0066FF] leading-tight">
                            {bdCheck.data?.summary?.success_ratio ?? bdCheck.success_ratio}%
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {bdCheck.data?.summary?.total_parcel ?? bdCheck.total_parcel ?? 0} total parcels analyzed
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide inline-flex items-center gap-1 ${
                              bdCheck.risk_level === 'safe'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : bdCheck.risk_level === 'medium'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {bdCheck.risk_level === 'safe' && <ShieldCheck className="w-3 h-3" />}
                            {bdCheck.risk_level === 'medium' && <AlertCircle className="w-3 h-3" />}
                            {bdCheck.risk_level === 'danger' && <ShieldAlert className="w-3 h-3" />}
                            {bdCheck.risk_verdict?.action || (bdCheck.risk_level === 'safe' ? 'OK to ship' : bdCheck.risk_level === 'medium' ? 'Phone confirmation advised' : 'Advance payment required')}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Verdict: {bdCheck.risk_verdict?.label || bdCheck.risk_level?.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Parcel Stats Summary Pill Bar */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Total Parcels</div>
                          <div className="text-sm font-extrabold font-mono text-slate-800">
                            {bdCheck.data?.summary?.total_parcel ?? bdCheck.total_parcel ?? 0}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-emerald-600 font-bold uppercase">Delivered</div>
                          <div className="text-sm font-extrabold font-mono text-emerald-600">
                            {bdCheck.data?.summary?.success_parcel ?? bdCheck.success_parcel ?? 0}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-rose-600 font-bold uppercase">Cancelled</div>
                          <div className="text-sm font-extrabold font-mono text-rose-600">
                            {bdCheck.data?.summary?.cancelled_parcel ?? bdCheck.cancelled_parcel ?? 0}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            (bdCheck.data?.summary?.success_ratio ?? bdCheck.success_ratio) >= 80
                              ? 'bg-emerald-500'
                              : (bdCheck.data?.summary?.success_ratio ?? bdCheck.success_ratio) >= 60
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, bdCheck.data?.summary?.success_ratio ?? bdCheck.success_ratio))}%` }}
                        />
                      </div>

                      {/* Verdict Message & Reasons */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-slate-700 text-[11px] leading-relaxed space-y-1">
                        <div>
                          <span className="font-semibold text-slate-900 mr-1">Telemetry Analysis:</span>
                          {bdCheck.risk_verdict?.message || 'Customer delivery telemetry analyzed across verified courier logs.'}
                        </div>
                        {Array.isArray(bdCheck.risk_verdict?.reasons) && bdCheck.risk_verdict.reasons.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1">
                            {bdCheck.risk_verdict.reasons.map((reason, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 text-[10px] font-medium">
                                • {reason}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Courier Breakdown Grid (Excluding summary) */}
                      {bdCheck.data && Object.keys(bdCheck.data).filter((k) => k !== 'summary').length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            Verified Couriers Breakdown
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            {Object.entries(bdCheck.data)
                              .filter(([key]) => key !== 'summary')
                              .map(([key, c]) => (
                                <div key={key} className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                                  <div>
                                    {c.logo ? (
                                      <img
                                        src={c.logo}
                                        alt={c.name || key}
                                        className="h-4 max-w-[70px] object-contain mx-auto mb-1"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                      />
                                    ) : null}
                                    <div className="font-bold text-slate-800 text-[11px] truncate">{c.name || key}</div>
                                  </div>
                                  <div className="mt-1">
                                    <div className="text-[11px] font-mono font-black text-[#0066FF]">{c.success_ratio}%</div>
                                    <div className="text-[9px] text-slate-500 mt-0.5">
                                      <span className="text-emerald-600 font-bold">{c.success_parcel || 0}</span> / <span className="text-rose-600">{c.cancelled_parcel || 0}</span>
                                      <span className="text-slate-400 text-[8px] block">({c.total_parcel || 0} total)</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {bdCheck.notice && (
                        <div className="text-[9px] text-slate-400 italic">
                          ℹ️ {bdCheck.notice}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 text-center bg-white rounded-lg border border-dashed border-blue-200 text-slate-500">
                      <p className="text-[11px]">No BDCourier check recorded yet for {activeOrder.customer_phone}.</p>
                      <button
                        type="button"
                        onClick={() => checkCustomerWithBDCourier(activeOrder.customer_phone, activeOrder.id)}
                        disabled={isCheckingBDCourier}
                        className="mt-2 px-3 py-1 rounded bg-[#0066FF] text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        {isCheckingBDCourier ? 'Checking with BDCourier...' : 'Run Fraud & Delivery Check'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-brand-graphite uppercase font-mono tracking-wider">
                Line Items ({activeOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-brand-border border border-brand-border rounded-xl overflow-hidden">
                {activeOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover bg-brand-softGray border border-brand-border"
                        />
                      )}
                      <div>
                        <div className="font-bold text-brand-graphite">{item.product_name}</div>
                        <div className="text-[10px] text-brand-muted font-mono">
                          {item.sku} {item.variant_name ? `• ${item.variant_name}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-brand-graphite">
                        {item.quantity} &times; {formatBDT(item.unit_price)}
                      </div>
                      <div className="text-[10px] font-mono text-brand-accent font-bold">
                        {formatBDT(item.total_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-xl bg-brand-softGray border border-brand-border space-y-1.5 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal:</span>
                <span className="font-mono">{formatBDT(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Shipping Fee:</span>
                <span className="font-mono">{formatBDT(activeOrder.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-brand-graphite pt-2 border-t border-brand-border">
                <span>Total Amount:</span>
                <span className="font-mono text-brand-accent">{formatBDT(activeOrder.total_amount)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-graphite text-white hover:bg-brand-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BDCourier Settings & Phone Testing Modal */}
      {showBDCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-graphite/60 backdrop-blur-xs">
          <div className="bg-white border border-brand-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">BDCourier Integration</h3>
                  <p className="text-[11px] text-slate-500">National Fraud Detection & Courier Analytics</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBDCourierModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveBDCourierSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  BDCourier API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={bdCourierSettings.apiKey}
                    onChange={(e) => setBdCourierSettings({ ...bdCourierSettings, apiKey: e.target.value })}
                    placeholder={bdCourierSettings.maskedKey || 'Paste BDCourier API Key from bdcourier.com'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0066FF] focus:bg-white transition-all"
                  />
                  <div className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                    {bdCourierSettings.hasKey ? '✓ Active' : 'No Key'}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Get your secret key from your{' '}
                  <a
                    href="https://bdcourier.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0066FF] underline font-semibold"
                  >
                    BDCourier.com
                  </a>{' '}
                  developer dashboard.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bdCourierSettings.isEnabled}
                    onChange={(e) => setBdCourierSettings({ ...bdCourierSettings, isEnabled: e.target.checked })}
                    className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="font-semibold text-slate-800 text-xs">Enable BDCourier Telemetry</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bdCourierSettings.autoCheckCOD}
                    onChange={(e) => setBdCourierSettings({ ...bdCourierSettings, autoCheckCOD: e.target.checked })}
                    className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="font-semibold text-slate-800 text-xs">Auto-verify customer on order inspect</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0066FF] text-white hover:bg-blue-600 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>

            {/* Test Phone Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                Live Customer Verification Test
              </span>
              <form onSubmit={handleTestPhoneCheck} className="flex gap-2">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="grow px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0066FF]"
                />
                <button
                  type="submit"
                  disabled={isTestingPhone}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-[#0066FF] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isTestingPhone ? 'Testing...' : 'Check'}
                </button>
              </form>

              {testResult && (
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{testResult.phone}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        testResult.risk_level === 'safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : testResult.risk_level === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {testResult.risk_level?.toUpperCase()} • {testResult.success_ratio}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {testResult.risk_verdict?.message}
                  </p>
                  {testResult.notice && (
                    <p className="text-[10px] text-slate-400 italic">
                      ℹ️ {testResult.notice}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
