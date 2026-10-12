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
                      <div className="text-[10px] text-brand-muted">{order.customer_phone}</div>
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
    </div>
  );
}
