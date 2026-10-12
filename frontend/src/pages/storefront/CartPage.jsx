import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/v1/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponData(data.data);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid promotional code');
        setCouponData(null);
      }
    } catch {
      setCouponError('Network error checking coupon');
      setCouponData(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const discountAmount = couponData ? couponData.discountAmount : 0;
  const estimatedShipping = subtotal >= freeShippingThreshold ? 0 : 80;
  const finalTotal = Math.max(0, subtotal - discountAmount + estimatedShipping);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 sm:p-12 border border-brand-accent/20 shadow-glow-sm">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-softGray border border-brand-accent/30 flex items-center justify-center text-brand-accent mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-black text-brand-graphite tracking-tight">Your Cart is Empty</h1>
          <p className="text-sm text-brand-muted mt-2">
            No robotic artifacts or smart controllers found in your current assembly sequence.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-100">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full">
            Commerce Terminal
          </span>
          <h1 className="text-3xl font-black text-brand-graphite mt-2 tracking-tight">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-brand-accent/5 via-brand-softGray to-brand-accent/10 border border-brand-accent/20">
        <div className="flex items-center justify-between text-xs font-bold text-brand-graphite mb-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-accent" />
            {amountToFreeShipping === 0 ? (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You unlocked Free Shipping across Bangladesh!
              </span>
            ) : (
              <span>
                Add <span className="text-brand-accent">৳{amountToFreeShipping.toLocaleString()}</span> more to qualify for Free Shipping
              </span>
            )}
          </span>
          <span className="font-mono text-brand-accent font-black">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-accent to-brand-accentHover transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items + Summary */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 hover:border-brand-accent/30 shadow-sm transition-all"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 rounded-xl bg-brand-softGray border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    to={`/products`}
                    className="text-sm font-bold text-brand-graphite hover:text-brand-accent transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-brand-muted mt-0.5">
                      Edition: <span className="font-semibold text-brand-graphite">{item.variantName}</span>
                    </p>
                  )}
                  <p className="text-xs font-mono text-gray-500 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-sm font-black text-brand-accent mt-1">
                    ৳{item.unitPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quantity Controls + Item Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-brand-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-mono font-bold text-brand-graphite">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-brand-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-brand-graphite">
                    ৳{(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-0.5 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-softGray/50 border border-gray-100 text-xs text-brand-graphite font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>Official Hardware Warranty</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-softGray/50 border border-gray-100 text-xs text-brand-graphite font-semibold">
              <Truck className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>Fast Courier Delivery in BD</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-softGray/50 border border-gray-100 text-xs text-brand-graphite font-semibold">
              <RotateCcw className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>7-Day Replacement Policy</span>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-brand-accent/20 shadow-glow-sm space-y-6">
          <h2 className="text-lg font-black text-brand-graphite tracking-tight">Order Summary</h2>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              Promo Code / Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. LAZYFORGE10"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              />
              <button
                type="submit"
                disabled={isValidatingCoupon}
                className="px-4 py-2.5 rounded-xl bg-brand-graphite hover:bg-brand-accent text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isValidatingCoupon ? '...' : 'Apply'}
              </button>
            </div>
            {couponData && (
              <p className="text-xs text-emerald-600 font-semibold">
                ✓ Coupon "{couponData.code}" applied (-৳{couponData.discountAmount.toLocaleString()})
              </p>
            )}
            {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
          </form>

          {/* Cost Breakdown */}
          <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-mono font-bold text-brand-graphite">৳{subtotal.toLocaleString()}</span>
            </div>
            {couponData && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount ({couponData.code})</span>
                <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-mono font-bold text-brand-graphite">
                {estimatedShipping === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  `৳${estimatedShipping.toLocaleString()}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-brand-graphite pt-3 border-t border-gray-100">
              <span>Estimated Total</span>
              <span className="font-mono text-brand-accent">৳{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-gray-400">
            Taxes included. Concurrency-verified inventory will be locked at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
