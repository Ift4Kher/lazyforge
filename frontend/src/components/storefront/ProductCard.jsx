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
    <div className="group relative filter drop-shadow-[0_4px_16px_rgba(0,102,255,0.08)] hover:drop-shadow-[0_12px_28px_rgba(0,102,255,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
      
      {/* Outer Border Layer with 45-degree Chamfered Corners */}
      <div 
        className="p-[1.5px] h-full w-full bg-blue-400/80 group-hover:bg-[#0066FF] transition-colors duration-300 flex flex-col justify-between"
        style={{
          clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)'
        }}
      >
        {/* Inner Card Body with matching Chamfered Silhouette */}
        <div 
          className="bg-white flex flex-col justify-between h-full w-full relative overflow-hidden"
          style={{
            clipPath: 'polygon(15px 0%, calc(100% - 15px) 0%, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px), 0% 15px)'
          }}
        >
          {/* Bottom-Left Tech Triangle Facet (matches reference image) */}
          <div 
            className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-10 bg-gradient-to-tr from-blue-100/90 via-blue-50/50 to-transparent"
            style={{
              clipPath: 'polygon(0% 100%, 18px 100%, 0% calc(100% - 18px))'
            }}
          />

          <div className="flex flex-col justify-between h-full">
            
            {/* Product Image Area with Floating Badges matching reference image */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F2F7FF]/90 via-slate-50/50 to-white overflow-hidden group/img border-b border-slate-100/90">
              
              {/* Subtle Cyber Radar Aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Floating Top-Left Badge (-13% OFF) */}
              <div className="absolute top-2.5 left-2.5 z-20">
                {discountPercent > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0066FF] text-white shadow-xs tracking-wide">
                    -{discountPercent}% OFF
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0066FF] text-white shadow-xs tracking-wide">
                    NEW
                  </span>
                )}
              </div>

              {/* Floating Top-Right Badge (● In Stock) */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-white border border-emerald-300 shadow-xs">
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
                  className="w-full h-full object-contain object-center group-hover/img:scale-108 transition-transform duration-500 ease-out drop-shadow-md"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Content Area */}
            <div className="p-3.5 space-y-1.5">
              {/* Product Title */}
              <Link to={`/products/${product.slug}`} className="block">
                <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-1 leading-snug tracking-tight">
                  {product.name}
                </h3>
              </Link>

              {/* Category Subtitle */}
              <span className="text-xs text-slate-500 font-medium block">
                {product.category_name || 'Robotics & AI'}
              </span>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-3 text-xs text-slate-700 pt-0.5">
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{ratingVal}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span className="font-bold text-slate-800">{reviewsCount}</span>
                </div>
              </div>

              {/* Price & Action Buttons Row */}
              <div className="pt-2 flex items-center justify-between gap-1.5 mt-1">
                {/* Price */}
                <div className="flex items-baseline space-x-1 shrink-0">
                  <span className="text-base font-bold text-[#0066FF] font-mono">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {salePrice !== null && regularPrice > salePrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      ৳{regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons: Stylized Add to Cart + Wishlist Heart */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={!inStock}
                    className="relative inline-flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-[#0066FF] via-[#0060F0] to-[#0048D0] hover:from-[#0052CC] hover:to-[#0038B0] text-white text-[11px] font-bold transition-all shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:shadow-[0_4px_14px_rgba(0,102,255,0.45)] active:scale-95 cursor-pointer disabled:opacity-50 rounded-l-full rounded-r-md"
                    style={{
                      clipPath: 'polygon(0% 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0% 100%)'
                    }}
                    title={inStock ? 'Add to Cart' : 'Out of Stock'}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className={`w-8 h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isWishlisted 
                        ? 'border-red-300 bg-red-50 text-red-500 shadow-xs' 
                        : 'border-blue-200/90 text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50/50 bg-white shadow-2xs'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-800'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
