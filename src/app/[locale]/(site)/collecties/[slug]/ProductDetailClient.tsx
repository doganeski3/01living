'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/store/useCart';
import { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Check, ShoppingBag, Minus, Plus, X, Maximize2, 
  ChevronLeft, ChevronRight, ShieldCheck, Truck, CreditCard, 
  RefreshCcw, Clock 
} from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const t = useTranslations('ProductDetail');
  const locale = useLocale() as 'nl' | 'en';
  const addItem = useCart((state) => state.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'returns'>('description');

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  useEffect(() => {
    setMounted(true);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, product.images.length]);

  const allColors = Array.from(new Set(product.variants?.map(v => v.color[locale]).filter(Boolean) as string[]));
  const allSizes = Array.from(new Set(product.variants?.map(v => v.size[locale]).filter(Boolean) as string[]));

  const activeVariant = product.variants?.find(v => {
    const colorMatch = selectedColor ? v.color[locale] === selectedColor : !v.color[locale];
    const sizeMatch = selectedSize ? v.size[locale] === selectedSize : !v.size[locale];
    return colorMatch && sizeMatch;
  }) || product.variants?.find(v => {
    if (selectedColor && selectedSize) return false;
    if (selectedColor) return v.color[locale] === selectedColor;
    if (selectedSize) return v.size[locale] === selectedSize;
    return false;
  }) || product.variants?.[0];

  const availableColors = allColors;
  const availableSizes = allSizes;

  useEffect(() => {
    let targetImage = activeVariant?.image;
    if (!targetImage && selectedColor) {
      const variantWithColorImg = product.variants?.find(v => v.color[locale] === selectedColor && v.image);
      if (variantWithColorImg) targetImage = variantWithColorImg.image;
    }
    if (targetImage) {
      const normalize = (url: string) => url.replace(/^\/+/, '').split('?')[0];
      const normalizedTarget = normalize(targetImage);
      const imgIndex = product.images.findIndex(img => normalize(img) === normalizedTarget);
      if (imgIndex !== -1) {
        setSelectedImage(imgIndex);
      }
    }
  }, [activeVariant, selectedColor, product.images, product.variants, locale]);

  const selectedVariantId = activeVariant?.id;
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  const formattedPrice = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(currentPrice);

  const [quantity, setQuantity] = useState(1);

  const isSelectionComplete = 
    (allColors.length === 0 || selectedColor !== null) && 
    (allSizes.length === 0 || selectedSize !== null);

  const handleAddToCart = () => {
    if (!isSelectionComplete) return;
    addItem(product, selectedVariantId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getButtonText = () => {
    if (added) return t('added');
    if (currentStock === 0) return t('outOfStock');
    if (!isSelectionComplete) {
      const missing = [];
      if (allColors.length > 0 && !selectedColor) missing.push(t('color'));
      if (allSizes.length > 0 && !selectedSize) missing.push(t('size'));
      return `${t('select')} ${missing.join(' & ')}`;
    }
    return t('addToCart');
  };

  return (
    <div className="min-h-screen bg-primary-ivory pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/${locale}/collecties`}
          className="inline-flex items-center gap-2 text-sm text-primary-anthracite/60 hover:text-primary-anthracite transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t('backToCollections')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/5] w-full bg-white shadow-2xl rounded-sm overflow-hidden cursor-zoom-in group"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name[locale]}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={32} strokeWidth={1} />
              </div>
            </motion.div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] bg-white rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-accent-oak shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name[locale]} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info - Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-accent-oak font-bold">
                {product.category[locale]}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary-anthracite leading-tight uppercase tracking-tight">
                {product.name[locale]}
              </h1>
              {product.category[locale] !== 'Showroom' && (
                <p className="text-3xl font-sans text-primary-anthracite/80 tracking-tight">
                  {formattedPrice}
                </p>
              )}
            </div>

            <div className="space-y-8 py-10 border-y border-primary-anthracite/10">
              {allColors.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                    {t('color')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-8 py-3 border text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                          selectedColor === color
                            ? 'border-primary-anthracite bg-primary-anthracite text-white shadow-xl translate-y-[-2px]'
                            : 'border-gray-200 text-primary-anthracite/60 hover:border-primary-anthracite'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {allSizes.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                    {t('size')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-8 py-3 border text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                          selectedSize === size
                            ? 'border-primary-anthracite bg-primary-anthracite text-white shadow-xl translate-y-[-2px]'
                            : 'border-gray-200 text-primary-anthracite/60 hover:border-primary-anthracite'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.category[locale] !== 'Showroom' && (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                    {t('quantity')}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-primary-anthracite/10 rounded-full p-1 bg-white shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-primary-anthracite/60 hover:text-primary-anthracite hover:bg-gray-50 rounded-full transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-bold text-sm text-primary-anthracite">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        disabled={quantity >= 5}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all text-primary-anthracite/60 hover:text-primary-anthracite hover:bg-gray-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.category[locale] === 'Showroom' ? (
                <Link 
                  href={`/${locale}/showroom`}
                  className="w-full py-6 bg-primary-anthracite text-white uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-accent-oak transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl group"
                >
                  {t('bookAppointment')}
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || !isSelectionComplete}
                  className={`w-full py-6 uppercase tracking-[0.3em] text-[11px] font-bold transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl ${
                    added
                      ? 'bg-green-600 text-white'
                      : isSelectionComplete 
                        ? 'bg-primary-anthracite text-white hover:bg-accent-oak'
                        : 'bg-gray-100 text-primary-anthracite/30 cursor-not-allowed'
                  }`}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} strokeWidth={1.5} />}
                  {getButtonText()}
                </motion.button>
              )}

              <div className="p-8 bg-white/50 border border-primary-anthracite/5 rounded-sm space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent-oak">{t('bespokeTitle')}</h4>
                <p className="text-[11px] text-primary-anthracite/60 leading-relaxed uppercase tracking-wider">{t('bespokeDesc')}</p>
                <Link href={`/${locale}/contact`} className="inline-block text-[10px] font-bold uppercase tracking-widest border-b border-primary-anthracite pb-1 hover:text-accent-oak hover:border-accent-oak transition-all">
                  {t('bespokeContact')}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-sm border border-primary-anthracite/5">
                <ShieldCheck size={20} className="text-accent-oak shrink-0" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/60">{t('qualityBadge')}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-sm border border-primary-anthracite/5">
                <Truck size={20} className="text-accent-oak shrink-0" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/60">{t('shippingBadge')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 border-t border-primary-anthracite/10 pt-20">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="flex gap-12 border-b border-primary-anthracite/10">
              <button 
                onClick={() => setActiveTab('description')}
                className={`pb-6 text-xs uppercase tracking-[0.4em] font-bold transition-all relative ${
                  activeTab === 'description' ? 'text-primary-anthracite' : 'text-primary-anthracite/30 hover:text-primary-anthracite/60'
                }`}
              >
                {t('description')}
                {activeTab === 'description' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-px bg-primary-anthracite" />}
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`pb-6 text-xs uppercase tracking-[0.4em] font-bold transition-all relative ${
                  activeTab === 'shipping' ? 'text-primary-anthracite' : 'text-primary-anthracite/30 hover:text-primary-anthracite/60'
                }`}
              >
                {t('shippingTab')}
                {activeTab === 'shipping' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-px bg-primary-anthracite" />}
              </button>
            </div>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-lg max-w-none"
                  >
                    <p className="text-xl md:text-2xl text-primary-anthracite/80 font-serif italic leading-relaxed whitespace-pre-wrap">
                      {product.description[locale]}
                    </p>
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                  >
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <Truck className="text-accent-oak" size={24} />
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-bold mb-2">{t('premiumShippingTitle')}</h4>
                          <p className="text-sm text-primary-anthracite/60 font-serif italic">{t('premiumShippingDesc')}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Clock className="text-accent-oak" size={24} />
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-bold mb-2">{t('leadTimeTitle')}</h4>
                          <p className="text-sm text-primary-anthracite/60 font-serif italic">{t('leadTimeDesc')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex gap-4">
                        <RefreshCcw className="text-accent-oak" size={24} />
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-bold mb-2">{t('returnsPolicyTitle')}</h4>
                          <p className="text-sm text-primary-anthracite/60 font-serif italic">{t('returnsPolicyDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {mounted && isLightboxOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-primary-anthracite/95 backdrop-blur-2xl"
            />
            
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110] p-2 hover:bg-white/10 rounded-full"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} strokeWidth={1.5} />
            </motion.button>

            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full flex items-center justify-center z-[105]"
            >
              <div className="relative w-full h-full max-h-[85vh]">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name[locale]}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
