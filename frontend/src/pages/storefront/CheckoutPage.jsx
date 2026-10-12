import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingZones, setShippingZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [shippingFee, setShippingFee] = useState(80);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_city: 'Dhaka',
    payment_method: 'COD',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Shipping Zones
  useEffect(() => {
    async function fetchZones() {
      try {
        const res = await fetch('/api/v1/orders/shipping-zones');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setShippingZones(json.data);
            setSelectedZoneId(json.data[0].id);
            setShippingFee(Number(json.data[0].fee));
          }
        }
      } catch (err) {
        console.error('Failed to load shipping zones:', err);
      }
    }
    fetchZones();
  }, []);

  // Handle Zone Change
  const handleZoneChange = (zoneId) => {
    setSelectedZoneId(zoneId);
    const found = shippingZones.find((z) => z.id === Number(zoneId));
    if (found) {
      setShippingFee(Number(found.fee));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // BD Phone Regex
  const isValidBdPhone = (phone) => {
    const clean = phone.replace(/\s+/g, '');
    return /^(?:\+8801|01)[3-9]\d{8}$/.test(clean);
  };

  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!isValidBdPhone(formData.customer_phone)) {
      setErrorMessage('Please provide a valid 11-digit Bangladesh phone number (e.g. 017XXXXXXXX).');
      return;
    }

    if (!formData.delivery_address.trim() || formData.delivery_address.trim().length < 5) {
      setErrorMessage('Please provide a complete delivery street address.');
      return;
    }

    setLoading(true);

    try {
      const savedReferral = localStorage.getItem('lazyforge_ref');
      const savedCoupon = sessionStorage.getItem('lazyforge_coupon');

      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || null,
        delivery_address: formData.delivery_address.trim(),
        delivery_city: formData.delivery_city.trim() || 'Dhaka',
        delivery_zone_id: selectedZoneId,
        payment_method: formData.payment_method,
        notes: formData.notes.trim() || null,
        coupon_code: savedCoupon || undefined,
        referral_code: savedReferral || undefined,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please check stock or address details.');
      }

      clearCart();

      if (formData.payment_method === 'SSLCOMMERZ' && data.data.gatewayUrl) {
        // Redirect to SSLCommerz Payment Gateway
        window.location.href = data.data.gatewayUrl;
      } else {
        // Cash on Delivery
        const orderNumber = data.data.order.orderNumber;
        navigate(`/order-confirmation/${orderNumber}?status=confirmed`);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-black text-brand-graphite">Your Cart is Empty</h1>
        <p className="text-sm text-brand-muted mt-2">Add robotics products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-brand-accent text-white"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-accent transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-black text-brand-graphite tracking-tight">Express Checkout</h1>
        <p className="text-xs text-brand-muted mt-1">
          Complete delivery credentials and select your preferred payment method across Bangladesh.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base font-black text-brand-graphite flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs font-mono">
                1
              </span>
              Recipient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Tariq Rahman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Mobile Number (BD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-brand-accent"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Used for delivery SMS and rider calls</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address (Optional)</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                placeholder="recipient@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          {/* 2. Delivery Address & Shipping Zone */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base font-black text-brand-graphite flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs font-mono">
                2
              </span>
              Delivery Destination & Shipping Zone
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">District / City</label>
                <input
                  type="text"
                  name="delivery_city"
                  required
                  value={formData.delivery_city}
                  onChange={handleInputChange}
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Shipping Method</label>
                <select
                  value={selectedZoneId || ''}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent bg-white"
                >
                  {shippingZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — ৳{Number(z.fee).toLocaleString()} ({z.estimated_days})
                    </option>
                  ))}
                  {shippingZones.length === 0 && (
                    <>
                      <option value="1">Inside Dhaka — ৳80 (1-2 days)</option>
                      <option value="2">Outside Dhaka — ৳150 (2-4 days)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="delivery_address"
                required
                rows={3}
                value={formData.delivery_address}
                onChange={handleInputChange}
                placeholder="House, Flat/Suite, Road, Sector / Area"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Instructions (Optional)</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Special notes for delivery personnel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-brand-graphite flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs font-mono">
                3
              </span>
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <label
                className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.payment_method === 'COD'
                    ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-brand-accent" />
                    <span className="text-xs font-black text-brand-graphite">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={formData.payment_method === 'COD'}
                    onChange={handleInputChange}
                    className="accent-brand-accent"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Pay with physical cash upon receiving your hardware parcel.
                </p>
              </label>

              {/* SSLCommerz Online */}
              <label
                className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.payment_method === 'SSLCOMMERZ'
                    ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-brand-accent" />
                    <span className="text-xs font-black text-brand-graphite">Online Payment (SSLCommerz)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="SSLCOMMERZ"
                    checked={formData.payment_method === 'SSLCOMMERZ'}
                    onChange={handleInputChange}
                    className="accent-brand-accent"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  bKash, Nagad, Rocket, Upay, Visa, MasterCard, and Net Banking.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-brand-accent/20 shadow-glow-sm space-y-6">
          <h2 className="text-lg font-black text-brand-graphite tracking-tight">Order Review</h2>

          {/* Line Items */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.key} className="flex items-center gap-3 text-xs py-2 border-b border-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-contain bg-brand-softGray p-1 border border-gray-100 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-graphite truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">
                    Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                  </p>
                </div>
                <div className="font-mono font-bold text-brand-graphite">
                  ৳{(item.unitPrice * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2.5 pt-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-brand-graphite">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-mono font-bold text-brand-graphite">৳{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-black text-brand-graphite pt-3 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="font-mono text-brand-accent">৳{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm bg-brand-accent text-white hover:bg-brand-accentHover disabled:opacity-50 shadow-glow-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order (৳{totalAmount.toLocaleString()})</span>
            )}
          </button>

          {/* Security badge */}
          <div className="p-3.5 rounded-xl bg-brand-softGray border border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Encrypted SSL session with concurrency-verified stock deduction.</span>
          </div>
        </div>
      </form>
    </div>
  );
}
