import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Zap, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const regularPrice = Number(product.regular_price) || 0;
  const salePrice = product.sale_price ? Number(product.sale_price) : null;
  const currentPrice = salePrice !== null ? salePrice : regularPrice;
  const discountPercent = salePrice && regularPrice > salePrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : 0;

  const inStock = product.total_stock > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-white border border-brand-border hover:border-[#8B5CF6]/50 p-4 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between">
      {/* Thumbnail Area */}
      <div>
        <div className="relative aspect-square w-full rounded-xl bg-brand-softGray border border-brand-border/60 overflow-hidden mb-4">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted">
              <Zap className="w-10 h-10 opacity-30 text-[#8B5CF6]" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#8B5CF6] text-white shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            {product.is_featured ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                Featured
              </span>
            ) : null}
          </div>

          {/* Stock Tag on Thumbnail */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            {inStock ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur-md text-emerald-700 shadow-sm border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>In Stock</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur-md text-red-600 shadow-sm border border-red-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Hover Overlay Link */}
          <Link
            to={`/products/${product.slug}`}
            className="absolute inset-0 bg-[#8B5CF6]/0 group-hover:bg-[#8B5CF6]/10 transition-colors z-0"
            aria-label={`View details for ${product.name}`}
          />
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5">
          {product.category_name && (
            <Link
              to={`/products?category=${product.category_slug}`}
              className="text-[11px] font-semibold text-[#8B5CF6] hover:underline uppercase tracking-wider font-mono block"
            >
              {product.category_name}
            </Link>
          )}

          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-brand-graphite group-hover:text-[#8B5CF6] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.short_description && (
            <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-4 mt-3 border-t border-brand-border/60 flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-base sm:text-lg font-extrabold text-brand-graphite">
              ৳{currentPrice.toLocaleString()}
            </span>
            {salePrice !== null && regularPrice > salePrice && (
              <span className="text-xs text-brand-muted line-through">
                ৳{regularPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-brand-muted block font-medium">Verified COD Ready</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <Link
            to={`/products/${product.slug}`}
            className="p-2 rounded-xl border border-brand-border hover:border-[#8B5CF6] text-brand-graphite hover:text-[#8B5CF6] hover:bg-brand-softGray transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="p-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all"
            title={inStock ? 'Quick Add to Cart' : 'Out of Stock'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
