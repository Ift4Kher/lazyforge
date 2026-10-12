import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const regularPrice = Number(product.regular_price) || 0;
  const salePrice = product.sale_price ? Number(product.sale_price) : null;
  const currentPrice = salePrice !== null ? salePrice : regularPrice;
  const discountPercent = salePrice && regularPrice > salePrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : 0;

  const inStock = (product.total_stock !== undefined ? product.total_stock : (product.stock !== undefined ? product.stock : 10)) > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addToCart(product, 1);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
  const imageUrl = product.primary_image || product.image_url || product.images?.[0]?.url || fallbackImage;

  return (
    <div className="group relative rounded-[28px] bg-white border-[6px] border-white ring-1 ring-slate-900/5 shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(139,92,246,0.18)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden">
      {/* Product Image Area (Clean solid image, no glass or blur) */}
      <div className="relative aspect-[4/3.2] w-full bg-[#F5F6F8] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Clickable Overlay Link */}
        <Link
          to={`/products/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View details for ${product.name}`}
        />

        {/* Top Badges (Solid crisp badges, no glass blur) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#8B5CF6] text-white shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            {product.is_featured ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                Featured
              </span>
            ) : null}
          </div>

          <div className="pointer-events-auto">
            {inStock ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 shadow-sm border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>In Stock</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-red-600 shadow-sm border border-red-100">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Solid White Content Area (Zero glass blur) */}
      <div className="p-4 space-y-2 bg-white z-20 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {product.category_name && (
            <Link
              to={`/products?category=${product.category_slug}`}
              className="text-[10px] font-bold text-[#8B5CF6] hover:underline uppercase tracking-wider font-mono block mb-1"
            >
              {product.category_name}
            </Link>
          )}

          {/* Product Name + Green Verified Scalloped Badge */}
          <div className="flex items-start justify-between gap-1.5">
            <Link to={`/products/${product.slug}`} className="block flex-1">
              <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#8B5CF6] transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            <span
              className="w-4 h-4 rounded-full bg-[#15803D] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs ring-1 ring-white/60"
              title="Verified Genuine Hardware"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>

          {product.short_description && (
            <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-1 leading-relaxed font-normal">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Price & Floating Add+ Pill Button */}
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#111827]">
              ৳{currentPrice.toLocaleString()}
            </span>
            {salePrice !== null && regularPrice > salePrice && (
              <span className="text-[11px] text-slate-400 line-through">
                ৳{regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Glassmorphic Pill Button (Add +) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md text-[#17191F] hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] text-xs font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.03)] border border-white/80 hover:shadow-[0_6px_20px_rgba(139,92,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center space-x-1.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 hover:scale-105 cursor-pointer"
            title={inStock ? 'Quick Add to Cart' : 'Out of Stock'}
          >
            <span>Add</span>
            <span className="font-bold text-sm leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
