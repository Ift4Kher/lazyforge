import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ShoppingBag,
  ArrowRight,
  PackageCheck,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/v1/orders/${orderNumber}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
        } else {
          throw new Error(json.error || 'Failed to load order');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-3 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-brand-graphite">Retrieving order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-brand-graphite">Order Not Located</h1>
        <p className="text-xs text-brand-muted mt-2">
          Unable to locate order "{orderNumber}". Please verify your order number or check your confirmation email.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-brand-accent text-white"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isFailed = statusParam === 'failed' || order.payment_status === 'FAILED';
  const isCancelled = statusParam === 'cancelled' || order.order_status === 'CANCELLED';
  const isPaid = statusParam === 'paid' || order.payment_status === 'PAID';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Celebration / Status Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border text-center mb-8 ${
          isFailed || isCancelled
            ? 'bg-red-50/60 border-red-200'
            : 'bg-emerald-50/60 border-emerald-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
            isFailed || isCancelled ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          {isFailed || isCancelled ? (
            <AlertTriangle className="w-8 h-8" />
          ) : (
            <CheckCircle2 className="w-8 h-8" />
          )}
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-muted">
          Order Confirmation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-graphite mt-1 tracking-tight">
          {isFailed
            ? 'Payment Failed'
            : isCancelled
            ? 'Order Cancelled'
            : isPaid
            ? 'Payment Confirmed & Processing'
            : 'Order Placed Successfully!'}
        </h1>
        <p className="text-xs text-brand-muted max-w-md mx-auto mt-2">
          {isFailed
            ? 'Your online transaction could not be verified. You may retry or contact LazyForge support.'
            : 'Thank you for choosing LazyForge Technologies. Your hardware assembly and dispatch sequence has been queued.'}
        </p>

        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500">Order Number:</span>
          <span className="font-mono text-sm font-black text-brand-accent">{order.order_number}</span>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
        {/* Key Attributes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-brand-softGray text-xs">
          <div>
            <span className="text-gray-400 block text-[11px]">Order Date</span>
            <span className="font-bold text-brand-graphite">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Payment Method</span>
            <span className="font-bold text-brand-graphite">
              {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online (SSLCommerz)'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Payment Status</span>
            <span
              className={`font-black font-mono ${
                order.payment_status === 'PAID'
                  ? 'text-emerald-600'
                  : order.payment_status === 'PENDING'
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              {order.payment_status}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Fulfillment Status</span>
            <span className="font-black font-mono text-brand-accent">{order.order_status}</span>
          </div>
        </div>

        {/* Recipient & Shipping Location */}
        <div className="p-5 rounded-2xl border border-gray-100 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-accent" />
            Delivery Credentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-brand-graphite">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-bold">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-graphite font-mono">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-graphite">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{order.delivery_city}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 pt-1 border-t border-gray-50">
            <span className="font-semibold text-gray-700">Address: </span>
            {order.delivery_address}
          </p>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-brand-accent" />
            Purchased Artifacts
          </h2>

          <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
            {order.items &&
              order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product_name}
                      className="w-12 h-12 rounded-xl object-contain bg-brand-softGray p-1 border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-brand-graphite truncate">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-[11px] text-gray-500">Edition: {item.variant_name}</p>
                      )}
                      <p className="text-[10px] font-mono text-gray-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-brand-graphite">
                      ৳{Number(item.total_price).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {item.quantity} × ৳{Number(item.unit_price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-5 rounded-2xl bg-brand-softGray border border-gray-100 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono font-bold text-brand-graphite">
              ৳{Number(order.subtotal).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping ({order.zone_name || 'Standard BD Courier'})</span>
            <span className="font-mono font-bold text-brand-graphite">
              ৳{Number(order.shipping_fee).toLocaleString()}
            </span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span className="font-mono">-৳{Number(order.discount_amount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-brand-graphite pt-2 border-t border-gray-200">
            <span>Grand Total</span>
            <span className="font-mono text-brand-accent">৳{Number(order.total_amount).toLocaleString()}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Invoice
          </button>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
