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
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';

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
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'photos'

  useEffect(() => {
    setLoading(true);
    setError(null);
    setAddedSuccess(false);

    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const firstImg = typeof data.images[0] === 'string' ? data.images[0] : (data.images[0].image_url || data.images[0].url);
          setSelectedImage(firstImg);
        } else if (data.primary_image || data.image_url) {
          setSelectedImage(data.primary_image || data.image_url);
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
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold font-orbitron shadow-md hover:bg-[#0052CC] transition-all"
        >
          <span>RETURN TO CATALOG</span>
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

  // Collect 2 normal product images for the Photos view
  const getNormalImages = () => {
    const list = [];
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const u = typeof img === 'string' ? img : (img.image_url || img.url);
        if (u && !list.includes(u)) list.push(u);
      });
    }
    if (product.primary_image && !list.includes(product.primary_image)) {
      list.unshift(product.primary_image);
    }
    if (product.image_url && !list.includes(product.image_url)) {
      list.unshift(product.image_url);
    }

    if (list.length === 1) {
      const p1 = list[0];
      if (p1.includes('prod-1-smart-humanoid')) {
        list.push(p1.includes('bot') ? '/images/prod-1-smart-humanoid.png' : '/images/prod-1-smart-humanoid-bot.png');
      } else if (p1.includes('prod-2-robotic-car')) {
        list.push('/images/prod-robotic-car-pro.png');
      } else if (p1.includes('prod-3-robotics')) {
        list.push('/images/prod-3-robotics-kit.png');
      } else if (p1.includes('prod-4')) {
        list.push('/images/prod-4-controller-board.png');
      } else {
        list.push(p1);
      }
    }
    return list.length >= 2 ? list.slice(0, 2) : (list.length > 0 ? list : ['/images/prod-1-smart-humanoid-bot.png', '/images/prod-1-smart-humanoid.png']);
  };

  const normalImages = getNormalImages();

  return (
    <div className="bg-[#0f1118] text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-[#FF7A00] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#FF7A00] transition-colors">Catalog</Link>
          {product.category_name && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/products?category=${product.category_slug}`} className="hover:text-[#FF7A00] transition-colors">
                {product.category_name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Gallery Column matching Reference Mockup */}
          <div className="space-y-3">
            {/* Top View Mode Tabs: [3D view] and [Photos] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-3.5 py-1 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'border border-[#FF7A00] text-[#FF7A00] bg-transparent'
                    : 'border border-slate-700 text-slate-300 bg-transparent hover:text-white hover:border-slate-500'
                }`}
              >
                3D view
              </button>
              <button
                type="button"
                onClick={() => setViewMode('photos')}
                className={`px-3.5 py-1 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  viewMode === 'photos'
                    ? 'border border-[#FF7A00] text-[#FF7A00] bg-transparent'
                    : 'border border-slate-700 text-slate-300 bg-transparent hover:text-white hover:border-slate-500'
                }`}
              >
                Photos
              </button>
            </div>

            {/* Main Viewport Container */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#232530] border border-slate-700/80 overflow-hidden shadow-2xl flex items-center justify-center">
              {viewMode === '3d' ? (
                <div className="w-full h-full relative">
                  <RobotViewer3D
                    key={product.model_3d_url || 'voxel_robot'}
                    height="100%"
                    modelType={product.model_3d_url || 'voxel_robot'}
                    modelUrl={product.model_3d_format === 'preset' ? null : product.model_3d_url}
                    productName={product.name}
                    showControls={false}
                    showTelemetry={false}
                    showBottomBar={true}
                  />
                </div>
              ) : (
                /* Photos Mode with 2 Normal Product Images */
                <div className="w-full h-full flex flex-col justify-between p-5 relative bg-[#232530]">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={selectedImage || normalImages[0]}
                      alt={product.name}
                      className="max-h-[360px] max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-300"
                    />
                  </div>

                  {/* 2 Normal Product Image Selectors at the bottom */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/80 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">Photos (2 Views):</span>
                      {normalImages.slice(0, 2).map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            (selectedImage || normalImages[0]) === imgUrl
                              ? 'border border-[#FF7A00] text-[#FF7A00] bg-[#FF7A00]/10'
                              : 'border border-slate-700 text-slate-300 bg-[#1E2028] hover:border-slate-500 hover:text-white'
                          }`}
                        >
                          View {idx + 1}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">2 Normal Product Images</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2 Normal Product Images Thumbnail Row */}
            <div className="flex items-center gap-3 pt-1">
              {normalImages.slice(0, 2).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(imgUrl);
                    setViewMode('photos');
                  }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#232530] p-1.5 flex items-center justify-center cursor-pointer ${
                    viewMode === 'photos' && (selectedImage || normalImages[0]) === imgUrl
                      ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/40'
                      : 'border-slate-700/80 opacity-70 hover:opacity-100 hover:border-slate-500'
                  }`}
                  title={`Switch to Photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Product Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Purchase Column */}
          <div className="space-y-6">
            <div>
              {product.category_name && (
                <Link
                  to={`/products?category=${product.category_slug}`}
                  className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-wider block mb-2"
                >
                  {product.category_name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-black font-orbitron text-white leading-tight tracking-wide">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2.5 text-xs text-slate-400 font-mono">
                <span>SKU: <span className="font-bold text-slate-200">{selectedVariant?.sku || product.sku}</span></span>
                <span>•</span>
                {isOutOfStock ? (
                  <span className="text-red-400 font-bold">Out of Stock</span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>In Stock ({currentStock} units verified)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 rounded-2xl bg-[#181a24] border border-slate-800 shadow-lg flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono font-semibold mb-1">UNIT PRICE:</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black font-orbitron text-[#FF7A00]">
                    ৳{unitPrice.toLocaleString()}
                  </span>
                  {product.sale_price !== null && Number(product.regular_price) > Number(product.sale_price) && (
                    <span className="text-sm font-orbitron text-slate-500 line-through">
                      ৳{Number(product.regular_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full font-mono">
                COD Available
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.short_description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block font-mono">
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
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF7A00] text-white border-[#FFA028] shadow-md shadow-[#FF7A00]/20'
                            : isVariantOutOfStock
                            ? 'bg-[#181a24] border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                            : 'bg-[#181a24] border-slate-700 text-slate-200 hover:border-[#FF7A00]'
                        }`}
                      >
                        <span>{v.variant_name}</span>
                        {v.price_adjustment !== '0.00' && Number(v.price_adjustment) !== 0 && (
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
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
                <span className="text-xs font-bold text-slate-200 uppercase font-mono">QUANTITY:</span>
                <div className="flex items-center rounded-xl border border-slate-700 bg-[#181a24] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-200 hover:bg-[#202330] disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold font-mono text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= currentStock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    className="p-2 text-slate-200 hover:bg-[#202330] disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  SUBTOTAL: <span className="font-bold text-[#FF7A00] font-orbitron">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold font-orbitron tracking-wider bg-[#FF7A00] text-white hover:bg-[#E65100] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedSuccess ? 'ADDED TO CART!' : 'ADD TO CART'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold font-orbitron tracking-wider bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>BUY NOW (COD)</span>
                </button>
              </div>

              {addedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-semibold text-emerald-300 text-center animate-fade-in font-mono">
                  ✓ Successfully added to cart! <Link to="/cart" className="underline font-bold ml-1 text-emerald-200">View Cart &amp; Checkout</Link>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#181a24] border border-slate-800 shadow-sm">
                <Truck className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <span>64 Districts Delivery</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#181a24] border border-slate-800 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <span>100% Genuine Hardware</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#181a24] border border-slate-800 shadow-sm">
                <RotateCcw className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <span>7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Specifications */}
        <div className="pt-8 border-t border-slate-800 space-y-8">
          <div>
            <h2 className="text-xl font-black font-orbitron text-white mb-4 tracking-wide">
              ENGINEERING DETAILS &amp; OVERVIEW
            </h2>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {Object.keys(specifications).length > 0 && (
            <div>
              <h2 className="text-xl font-black font-orbitron text-white mb-4 flex items-center gap-2 tracking-wide">
                <Sparkles className="w-5 h-5 text-[#FF7A00]" />
                <span>TECHNICAL SPECIFICATIONS</span>
              </h2>
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#181a24] shadow-sm">
                <div className="divide-y divide-slate-800">
                  {Object.entries(specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-[#181a24]' : 'bg-[#1e202c]'
                      }`}
                    >
                      <span className="font-bold font-mono text-slate-200">{key}</span>
                      <span className="sm:col-span-2 text-slate-400 font-mono">{String(value)}</span>
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
          <div className="pt-10 border-t border-brand-border/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#0066FF] uppercase">Related Hardware</span>
                <h2 className="text-2xl font-black font-orbitron text-brand-graphite mt-0.5 tracking-wide">
                  FREQUENTLY ENGINEERED TOGETHER
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category_slug}`}
                className="text-xs font-bold font-orbitron text-[#0066FF] hover:underline flex items-center gap-1"
              >
                <span>MORE IN {product.category_name}</span>
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
