import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Minus,
  Plus,
} from 'lucide-react';
import { fetchProductBySlug } from '../../services/catalogService';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { ProductReviewsSection } from '../../components/storefront/ProductReviewsSection';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setAddedSuccess(false);

    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        }
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch((err) => {
        setError(err.message || 'Product not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-brand-softGray rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-6 bg-brand-softGray rounded w-1/3"></div>
            <div className="h-10 bg-brand-softGray rounded w-3/4"></div>
            <div className="h-8 bg-brand-softGray rounded w-1/4"></div>
            <div className="h-24 bg-brand-softGray rounded"></div>
            <div className="h-12 bg-brand-softGray rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-softGray border border-brand-border flex items-center justify-center mx-auto text-brand-muted">
          <Package className="w-8 h-8 text-brand-muted" />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-graphite">Product Not Found</h2>
        <p className="text-xs text-brand-muted">
          The requested hardware item may have been relocated or is temporarily archived.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-md hover:bg-[#7C3AED] transition-all"
        >
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Calculate pricing with active variant
  const basePrice = product.sale_price !== null && product.sale_price !== undefined 
    ? Number(product.sale_price) 
    : Number(product.regular_price);
  
  const priceAdjustment = selectedVariant ? Number(selectedVariant.price_adjustment || 0) : 0;
  const unitPrice = basePrice + priceAdjustment;
  const totalPrice = unitPrice * quantity;

  const currentStock = selectedVariant ? selectedVariant.stock_quantity : (product.total_stock || 0);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        ...product,
        selected_variant: selectedVariant,
        price: unitPrice,
      },
      quantity
    );
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const specifications = product.specifications || {};

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-brand-muted">
          <Link to="/" className="hover:text-[#8B5CF6]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#8B5CF6]">Catalog</Link>
          {product.category_name && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/products?category=${product.category_slug}`} className="hover:text-[#8B5CF6]">
                {product.category_name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-graphite font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-brand-softGray border border-brand-border overflow-hidden shadow-sm flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              ) : (
                <Zap className="w-16 h-16 opacity-30 text-[#8B5CF6]" />
              )}

              {/* 3D Model Showcase Badge */}
              {product.model_3d_url && (
                <div className="absolute top-4 right-4 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#8B5CF6]/30 text-xs font-bold text-[#8B5CF6] shadow-sm">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Interactive 3D Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img.image_url
                        ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20'
                        : 'border-brand-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt={img.alt_text || 'Thumbnail'} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchase Column */}
          <div className="space-y-6">
            <div>
              {product.category_name && (
                <Link
                  to={`/products?category=${product.category_slug}`}
                  className="text-xs font-mono font-bold text-[#8B5CF6] uppercase tracking-wider block mb-2"
                >
                  {product.category_name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-graphite leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-xs text-brand-muted">
                <span>SKU: <span className="font-mono font-bold text-brand-graphite">{selectedVariant?.sku || product.sku}</span></span>
                <span>•</span>
                {isOutOfStock ? (
                  <span className="text-red-600 font-bold">Out of Stock</span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({currentStock} available)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 rounded-2xl bg-brand-softGray border border-brand-border flex items-baseline justify-between">
              <div>
                <span className="text-xs text-brand-muted block font-semibold mb-1">Unit Price:</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-brand-graphite">
                    ৳{unitPrice.toLocaleString()}
                  </span>
                  {product.sale_price !== null && Number(product.regular_price) > Number(product.sale_price) && (
                    <span className="text-sm text-brand-muted line-through">
                      ৳{Number(product.regular_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                COD Available
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-brand-muted leading-relaxed">
              {product.short_description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-brand-graphite uppercase tracking-wider block font-mono">
                  Select Configuration / Edition:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isVariantOutOfStock = v.stock_quantity <= 0;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={isVariantOutOfStock}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm'
                            : isVariantOutOfStock
                            ? 'bg-brand-softGray border-brand-border text-brand-muted opacity-50 cursor-not-allowed'
                            : 'bg-white border-brand-border text-brand-graphite hover:border-[#8B5CF6]'
                        }`}
                      >
                        <span>{v.variant_name}</span>
                        {v.price_adjustment !== '0.00' && Number(v.price_adjustment) !== 0 && (
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-purple-100' : 'text-brand-muted'}`}>
                            {Number(v.price_adjustment) > 0 ? `+৳${v.price_adjustment}` : `-৳${Math.abs(v.price_adjustment)}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-brand-graphite uppercase font-mono">Quantity:</span>
                <div className="flex items-center rounded-xl border border-brand-border bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-brand-graphite hover:bg-brand-softGray disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-brand-graphite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= currentStock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    className="p-2 text-brand-graphite hover:bg-brand-softGray disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-brand-muted">
                  Subtotal: <span className="font-bold text-brand-graphite">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedSuccess ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold bg-brand-graphite text-white hover:bg-black shadow-md hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>

              {addedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 text-center animate-fade-in">
                  ✓ Successfully added to cart! <Link to="/cart" className="underline font-bold ml-1">View Cart & Checkout</Link>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-brand-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-muted">
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-brand-softGray">
                <Truck className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>64 Districts Delivery</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-brand-softGray">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>100% Genuine Hardware</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-brand-softGray">
                <RotateCcw className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Specifications */}
        <div className="pt-8 border-t border-brand-border space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-brand-graphite mb-4">
              Engineering Details & Overview
            </h2>
            <div className="prose prose-sm max-w-none text-brand-muted leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {Object.keys(specifications).length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-brand-graphite mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                <span>Technical Specifications</span>
              </h2>
              <div className="rounded-2xl border border-brand-border overflow-hidden">
                <div className="divide-y divide-brand-border">
                  {Object.entries(specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-brand-softGray/50'
                      }`}
                    >
                      <span className="font-bold text-brand-graphite">{key}</span>
                      <span className="sm:col-span-2 text-brand-muted font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* JSON-LD Product Structured Data for Technical SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: selectedImage || (product.images?.[0]?.image_url),
              description: product.short_description || product.description,
              sku: selectedVariant ? selectedVariant.sku : product.sku,
              brand: {
                '@type': 'Brand',
                name: 'LazyForge Technologies',
              },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'BDT',
                price: unitPrice,
                availability:
                  currentStock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
              },
            }),
          }}
        />

        {/* Customer Reviews & Telemetry */}
        <ProductReviewsSection productId={product.id} productName={product.name} />

        {/* Related Products Shelf */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#8B5CF6] uppercase">Related Hardware</span>
                <h2 className="text-2xl font-extrabold text-brand-graphite mt-0.5">
                  Frequently Engineered Together
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category_slug}`}
                className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1"
              >
                <span>More in {product.category_name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
