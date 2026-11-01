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
    <div className="group relative p-[1.5px] bg-slate-200/90 hover:bg-[#0066FF] clip-chamfer-tl-bl-18 rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,102,255,0.2)]">
      <div className="w-full h-full bg-white clip-chamfer-tl-bl-18-inner rounded-tr-[15px] rounded-br-[15px] p-4 flex flex-col justify-between relative overflow-hidden">
        
        {/* Bottom Left Corner Tech Notch Accent (matching reference) */}
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400/60 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="flex items-center justify-between z-10 mb-2">
          {discountPercent > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0066FF] text-white shadow-xs">
              -{discountPercent}% OFF
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              NEW
            </span>
          )}

          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-600 bg-white border border-emerald-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>In Stock</span>
          </div>
        </div>

        {/* Product Image Area */}
        <Link 
          to={`/products/${product.slug}`}
          className="relative aspect-[4/3] w-full flex items-center justify-center p-2 overflow-hidden my-1 block"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Content Area */}
        <div className="space-y-1.5 pt-1">
          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Category Subtitle */}
          <p className="text-xs text-slate-400 font-medium">
            {product.category_name || 'Robotics & AI'}
          </p>

          {/* Rating & Reviews */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 pt-0.5">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{ratingVal}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="font-bold text-slate-600">{reviewsCount}</span>
            </div>
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-2.5 flex items-center justify-between gap-2">
            {/* Price (Electric Blue matching reference image) */}
            <div className="flex items-baseline space-x-1.5 shrink-0">
              <span className="text-base font-black text-[#0066FF]">
                ৳{currentPrice.toLocaleString()}
              </span>
              {salePrice !== null && regularPrice > salePrice && (
                <span className="text-xs text-slate-400 line-through">
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
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF] text-white hover:bg-blue-600 text-xs font-bold shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title={inStock ? 'Add to Cart' : 'Out of Stock'}
              >
                <ShoppingCart className="w-3 h-3" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-7 h-7 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isWishlisted 
                    ? 'border-red-300 bg-red-50 text-red-500' 
                    : 'border-slate-200 text-slate-500 hover:text-[#0066FF] hover:border-[#0066FF] bg-white'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
