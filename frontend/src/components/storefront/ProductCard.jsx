import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const regularPrice = Number(product.regular_price) || 0;
  const salePrice = product.sale_price ? Number(product.sale_price) : null;
  const currentPrice = salePrice !== null ? salePrice : regularPrice;
  const discountPercent = salePrice && regularPrice > salePrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : (product.discountPercent || 0);

  const inStock = (product.total_stock !== undefined ? product.total_stock : (product.stock !== undefined ? product.stock : 10)) > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addToCart(product, 1);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const fallbackImage = '/images/cat-2-ai-robots.png';
  const productReferenceImageMap = {
    'smart-humanoid-robot': '/images/prod-1-smart-humanoid-bot.png',
    'robotic-car-pro': '/images/prod-2-robotic-car-pro.png',
    'robotics-development-kit': '/images/prod-3-robotics-dev-kit.png',
    'smart-controller-board': '/images/prod-4-smart-controller-board.png',
  };
  const imageUrl = productReferenceImageMap[product.slug] || product.primary_image || product.image_url || product.images?.[0]?.url || fallbackImage;

  const ratingVal = product.rating || (4.5 + ((product.id || 1) % 5) * 0.1).toFixed(1);
  const reviewsCount = product.reviews_count || (8 + ((product.id || 1) * 3) % 15);

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#0066FF] shadow-[0_4px_20px_rgba(0,102,255,0.06)] hover:shadow-[0_16px_40px_rgba(0,102,255,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Cyber Accent Hairline */}
      <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] transition-all duration-500" />

      {/* Corner CAD Tech Markings */}
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-blue-400/40 pointer-events-none group-hover:border-[#0066FF] transition-colors" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-blue-400/40 pointer-events-none group-hover:border-[#0066FF] transition-colors" />

      <div className="p-4 flex flex-col justify-between h-full space-y-3">
        
        {/* Top Badges Row */}
        <div className="flex items-center justify-between z-10">
          {discountPercent > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-[#0066FF] to-blue-600 text-white shadow-xs tracking-wider">
              -{discountPercent}% OFF
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
              NEW UNIT
            </span>
          )}

          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-600 bg-white/95 border border-emerald-300/80 shadow-2xs backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>In Stock</span>
          </div>
        </div>

        {/* Product Image Area with Radial Glow Pedestal */}
        <Link 
          to={`/products/${product.slug}`}
          className="relative aspect-[4/3] w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-b from-[#F0F5FF]/80 via-slate-50/50 to-white overflow-hidden group/img my-1 block border border-slate-100/80"
        >
          {/* Subtle Cyber Radar Aura */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />

          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover/img:scale-108 transition-transform duration-500 ease-out drop-shadow-md relative z-10"
            loading="lazy"
          />
        </Link>

        {/* Content Area */}
        <div className="space-y-1.5 pt-1">
          {/* Category Tag */}
          <span className="text-[10px] font-mono font-bold text-[#0066FF] uppercase tracking-wider block">
            {product.category_name || 'Robotics & AI'}
          </span>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0066FF] font-['Orbitron',sans-serif] transition-colors line-clamp-1 leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 pt-0.5">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700 font-mono">{ratingVal}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="font-bold text-slate-600 font-mono">{reviewsCount}</span>
            </div>
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100/90 mt-2">
            {/* Price (Electric Blue matching luxury theme) */}
            <div className="flex items-baseline space-x-1.5 shrink-0">
              <span className="text-base sm:text-lg font-black text-[#0066FF] font-mono">
                ৳{currentPrice.toLocaleString()}
              </span>
              {salePrice !== null && regularPrice > salePrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ৳{regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Cart + Wishlist Heart */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!inStock}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0066FF] text-white hover:bg-blue-600 text-xs font-bold shadow-[0_2px_10px_rgba(0,102,255,0.3)] hover:shadow-[0_4px_16px_rgba(0,102,255,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title={inStock ? 'Add to Cart' : 'Out of Stock'}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-8 h-8 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isWishlisted 
                    ? 'border-red-300 bg-red-50 text-red-500 shadow-xs' 
                    : 'border-slate-200 text-slate-400 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50/50 bg-white'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
