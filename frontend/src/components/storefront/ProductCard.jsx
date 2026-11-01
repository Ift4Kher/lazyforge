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
  const discountPercent = product.discountPercent !== undefined 
    ? product.discountPercent 
    : (salePrice && regularPrice > salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0);

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
    <div className="group relative bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      
      <div className="flex flex-col justify-between h-full">
        {/* Product Image Area with Floating Badges */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50/70 via-slate-50/30 to-white overflow-hidden group/img border-b border-slate-100 flex items-center justify-center">
          
          {/* Floating Top-Left Discount Badge (-11% OFF) */}
          <div className="absolute top-2.5 left-2.5 z-20">
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0066FF] text-white shadow-xs tracking-wide">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Floating Top-Right Badge (● In Stock) */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-white border border-emerald-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock</span>
            </div>
          </div>

          {/* Product Image */}
          <Link 
            to={`/products/${product.slug}`}
            className="w-full h-full flex items-center justify-center p-3 relative z-10"
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain object-center group-hover/img:scale-108 transition-transform duration-500 ease-out drop-shadow-sm"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Content Area */}
        <div className="p-3.5 space-y-1.5 flex flex-col justify-between grow">
          <div className="space-y-1">
            {/* Product Title */}
            <Link to={`/products/${product.slug}`} className="block">
              <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-1 leading-snug tracking-tight">
                {product.name}
              </h3>
            </Link>

            {/* Category Subtitle */}
            <span className="text-[11px] text-slate-500 font-medium block">
              {product.category_name || 'Robotics & AI'}
            </span>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-1 text-xs text-slate-700 pt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800">{ratingVal}</span>
              <span className="text-slate-500 text-[11px]">({reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Price & Action Buttons Row */}
          <div className="pt-2.5 space-y-2">
            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-bold text-[#0066FF] font-mono">
                ৳{currentPrice.toLocaleString()}
              </span>
              {salePrice !== null && regularPrice > salePrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ৳{regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Cart + Wishlist Heart */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!inStock}
                className="grow inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-[#0066FF] hover:bg-blue-600 active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                title={inStock ? 'Add to Cart' : 'Out of Stock'}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-8 h-8 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isWishlisted 
                    ? 'border-red-300 bg-red-50 text-red-500 shadow-xs' 
                    : 'border-slate-200 text-slate-700 hover:text-red-500 hover:border-red-200 hover:bg-red-50/40 bg-white shadow-2xs'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
