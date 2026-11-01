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
        if (data.slug === 'smart-humanoid-robot') {
          setSelectedImage('/images/prod-1-smart-humanoid-front.jpg');
        } else if (data.images && data.images.length > 0) {
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
    if (product.slug === 'smart-humanoid-robot') {
      return ['/images/prod-1-smart-humanoid-front.jpg', '/images/prod-1-smart-humanoid-side.jpg'];
    }

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
      if (p1.includes('robotic-car')) {
        list.push('/images/robotic-cars.jpg');
      } else if (p1.includes('robotics')) {
        list.push('/images/prod-3-robotics-kit.png');
      } else if (p1.includes('controller')) {
        list.push('/images/prod-4-controller-board.png');
      } else {
        list.push(p1);
      }
    }
    return list.length >= 2 ? list.slice(0, 2) : (list.length > 0 ? list : ['/images/prod-1-smart-humanoid-front.jpg', '/images/prod-1-smart-humanoid-side.jpg']);
  };

  const normalImages = getNormalImages();

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-brand-muted">
          <Link to="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#0066FF] transition-colors">Catalog</Link>
          {product.category_name && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/products?category=${product.category_slug}`} className="hover:text-[#0066FF] transition-colors">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery Column */}
          <div className="space-y-4">
            {/* Viewport Mode Toggle */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                Viewport Mode
              </span>
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-brand-border text-xs font-orbitron font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'text-gray-500 hover:text-[#0066FF]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D VIEW</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'photos'
                      ? 'bg-white text-brand-graphite shadow-xs'
                      : 'text-gray-500 hover:text-brand-graphite'
                  }`}
                >
                  PHOTOS (2 VIEWS)
                </button>
              </div>
            </div>

            {/* Viewport Container with Sci-Fi Corner Brackets */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-brand-border/80 overflow-hidden shadow-xs flex items-center justify-center p-4">
              {/* Sci-fi corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#0066FF]/60 pointer-events-none z-10" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#0066FF]/60 pointer-events-none z-10" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#0066FF]/60 pointer-events-none z-10" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#0066FF]/60 pointer-events-none z-10" />

              {viewMode === '3d' ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-[#0A0D14]">
                  <RobotViewer3D
                    key={product.model_3d_url || 'voxel_robot'}
                    height="100%"
                    modelType={product.model_3d_url || 'voxel_robot'}
                    modelUrl={product.model_3d_format === 'preset' ? null : product.model_3d_url}
                    productName={product.name}
                    showControls={true}
                    showTelemetry={true}
                    showBottomBar={true}
                  />
                </div>
              ) : (
                <img
                  src={selectedImage || normalImages[0]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-300"
                />
              )}

              {/* Quick 3D View badge when in photos mode */}
              {viewMode === 'photos' && (
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className="absolute top-4 right-4 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#0066FF]/30 text-xs font-bold font-orbitron text-[#0066FF] hover:bg-[#0066FF] hover:text-white transition-all shadow-xs cursor-pointer z-10"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D VIEW</span>
                </button>
              )}
            </div>

            {/* 2 Normal Product Images Thumbnail Row */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
              {normalImages.slice(0, 2).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(imgUrl);
                    setViewMode('photos');
                  }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1 cursor-pointer ${
                    viewMode === 'photos' && (selectedImage || normalImages[0]) === imgUrl
                      ? 'border-[#0066FF] ring-2 ring-[#0066FF]/20'
                      : 'border-brand-border opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                  title={`Normal Photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Product Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Purchase Column (Original Clean Light UI) */}
          <div className="space-y-6">
            <div>
              {product.category_name && (
                <Link
                  to={`/products?category=${product.category_slug}`}
                  className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider block mb-2"
                >
                  {product.category_name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-black font-orbitron text-brand-graphite leading-tight tracking-wide">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2.5 text-xs text-brand-muted font-mono">
                <span>SKU: <span className="font-bold text-brand-graphite">{selectedVariant?.sku || product.sku}</span></span>
                <span>•</span>
                {isOutOfStock ? (
                  <span className="text-red-600 font-bold">Out of Stock</span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock ({currentStock} units verified)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex items-baseline justify-between">
              <div>
                <span className="text-xs text-brand-muted block font-mono font-semibold mb-1">UNIT PRICE:</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black font-orbitron text-[#0066FF]">
                    ৳{unitPrice.toLocaleString()}
                  </span>
                  {product.sale_price !== null && Number(product.regular_price) > Number(product.sale_price) && (
                    <span className="text-sm font-orbitron text-brand-muted line-through">
                      ৳{Number(product.regular_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono">
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
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col cursor-pointer ${
                          isSelected
                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                            : isVariantOutOfStock
                            ? 'bg-slate-50 border-brand-border text-brand-muted opacity-50 cursor-not-allowed'
                            : 'bg-white border-brand-border text-brand-graphite hover:border-[#0066FF]'
                        }`}
                      >
                        <span>{v.variant_name}</span>
                        {v.price_adjustment !== '0.00' && Number(v.price_adjustment) !== 0 && (
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-brand-muted'}`}>
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
                <span className="text-xs font-bold text-brand-graphite uppercase font-mono">QUANTITY:</span>
                <div className="flex items-center rounded-xl border border-brand-border bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-brand-graphite hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold font-mono text-brand-graphite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= currentStock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    className="p-2 text-brand-graphite hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-mono text-brand-muted">
                  SUBTOTAL: <span className="font-bold text-[#0066FF] font-orbitron">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold font-orbitron tracking-wider bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedSuccess ? 'ADDED TO CART!' : 'ADD TO CART'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-bold font-orbitron tracking-wider bg-brand-graphite text-white hover:bg-black shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>BUY NOW (COD)</span>
                </button>
              </div>

              {addedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 text-center animate-fade-in font-mono">
                  ✓ Successfully added to cart! <Link to="/cart" className="underline font-bold ml-1">View Cart &amp; Checkout</Link>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-brand-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-muted">
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-white border border-brand-border/80 shadow-xs">
                <Truck className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>64 Districts Delivery</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-white border border-brand-border/80 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>100% Genuine Hardware</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-white border border-brand-border/80 shadow-xs">
                <RotateCcw className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Specifications */}
        <div className="pt-8 border-t border-brand-border/80 space-y-8">
          <div>
            <h2 className="text-xl font-black font-orbitron text-brand-graphite mb-4 tracking-wide">
              ENGINEERING DETAILS &amp; OVERVIEW
            </h2>
            <div className="prose prose-sm max-w-none text-brand-muted leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {Object.keys(specifications).length > 0 && (
            <div>
              <h2 className="text-xl font-black font-orbitron text-brand-graphite mb-4 flex items-center gap-2 tracking-wide">
                <Sparkles className="w-5 h-5 text-[#0066FF]" />
                <span>TECHNICAL SPECIFICATIONS</span>
              </h2>
              <div className="rounded-2xl border border-brand-border overflow-hidden bg-white shadow-xs">
                <div className="divide-y divide-brand-border">
                  {Object.entries(specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      }`}
                    >
                      <span className="font-bold font-mono text-brand-graphite">{key}</span>
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
