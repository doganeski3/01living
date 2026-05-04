'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/store/useCart';
import { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ShoppingBag, Minus, Plus, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Find variant that matches the current selection
  const activeVariant = product.variants?.find(v => {
    const colorMatch = selectedColor ? v.color[locale] === selectedColor : !v.color[locale];
    const sizeMatch = selectedSize ? v.size[locale] === selectedSize : !v.size[locale];
    return colorMatch && sizeMatch;
  }) || product.variants?.find(v => {
    // Fallback: match only color if size not selected or vice-versa
    if (selectedColor && selectedSize) return false; // Both must match if both selected
    if (selectedColor) return v.color[locale] === selectedColor;
    if (selectedSize) return v.size[locale] === selectedSize;
    return false;
  }) || product.variants?.[0];

  const availableColors = allColors;
  const availableSizes = allSizes;

  // Auto-switch image when active variant has a specific image
  useEffect(() => {
    // 1. Try active variant image first
    let targetImage = activeVariant?.image;

    // 2. Fallback: If no image on active variant, try to find any variant with the same color that has an image
    if (!targetImage && selectedColor) {
      const variantWithColorImg = product.variants?.find(v => v.color[locale] === selectedColor && v.image);
      if (variantWithColorImg) targetImage = variantWithColorImg.image;
    }

    if (targetImage) {
      // Normalize URLs for robust comparison (ignore leading slashes, etc.)
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
  const tProj = useTranslations('ProjectInquiry');

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
        {/* Back link */}
        <Link
          href={`/${locale}/collecties`}
          className="inline-flex items-center gap-2 text-sm text-primary-anthracite/60 hover:text-primary-anthracite transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {t('backToCollections')}
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/5] w-full bg-gray-100 overflow-hidden cursor-zoom-in group"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name[locale]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={32} strokeWidth={1} />
              </div>
            </motion.div>

            {/* Lightbox Modal */}
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
                  
                  {/* Close Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110] p-2 hover:bg-white/10 rounded-full"
                    onClick={() => setIsLightboxOpen(false)}
                  >
                    <X size={32} strokeWidth={1.5} />
                  </motion.button>

                  {/* Navigation Buttons - Hidden on small mobile, smaller on tablets */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                      >
                        <ChevronLeft size={48} strokeWidth={1} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                      >
                        <ChevronRight size={48} strokeWidth={1} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">
                          {selectedImage + 1} <span className="mx-2 opacity-30">/</span> {product.images.length}
                        </p>
                      </div>
                    </>
                  )}

                  <motion.div
                    key={selectedImage}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x;
                      if (swipe < -50) nextImage();
                      else if (swipe > 50) prevImage();
                    }}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full h-full flex items-center justify-center z-[105] touch-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative w-[95vw] h-[70vh] md:w-full md:h-full md:max-h-[85vh]">
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

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-anthracite' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${product.name[locale]} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Category */}
            <p className="text-xs uppercase tracking-widest text-accent-oak font-semibold">
              {product.category[locale]}
            </p>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-heading text-primary-anthracite leading-tight">
              {product.name[locale]}
            </h1>

            {/* Price - Hidden for Showroom products */}
            {product.category[locale] !== 'Showroom' && (
              <p className="text-3xl font-sans text-primary-anthracite">
                {formattedPrice}
              </p>
            )}

            {/* Color Selector */}
            {allColors.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-primary-anthracite/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                  {t('color')}
                </p>
                <div className="flex flex-wrap gap-3">
                  {allColors.map((color) => {
                    const isAvailable = availableColors.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 border text-xs uppercase tracking-widest font-bold transition-all ${
                          selectedColor === color
                            ? 'border-primary-anthracite bg-primary-anthracite text-white'
                            : isAvailable 
                              ? 'border-gray-200 text-primary-anthracite/60 hover:border-primary-anthracite'
                              : 'border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {allSizes.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-primary-anthracite/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                  {t('size')}
                </p>
                <div className="flex flex-wrap gap-3">
                  {allSizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 border text-xs uppercase tracking-widest font-bold transition-all ${
                          selectedSize === size
                            ? 'border-primary-anthracite bg-primary-anthracite text-white'
                            : isAvailable
                              ? 'border-gray-200 text-primary-anthracite/60 hover:border-primary-anthracite'
                              : 'border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector - Hidden for Showroom products */}
            {product.category[locale] !== 'Showroom' && (
              <div className="space-y-4 pt-4 border-t border-primary-anthracite/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">
                  {t('quantity')}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-primary-anthracite/10 rounded-full p-1 bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-primary-anthracite/60 hover:text-primary-anthracite hover:bg-gray-50 rounded-full transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-primary-anthracite">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      disabled={quantity >= 5}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                        quantity >= 5 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-primary-anthracite/60 hover:text-primary-anthracite hover:bg-gray-50'
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {quantity === 5 && (
                    <p className="text-[10px] text-accent-oak font-bold uppercase tracking-widest animate-pulse">Max. 5 items</p>
                  )}
                </div>
              </div>
            )}

            {/* Stock / Showroom Status */}
            <div className="flex items-center gap-2 pt-8 border-t border-primary-anthracite/10">
              <div className={`w-2 h-2 rounded-full ${product.category[locale] === 'Showroom' ? 'bg-accent-oak' : currentStock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="text-sm text-primary-anthracite/70">
                {product.category[locale] === 'Showroom' 
                  ? t('showroomStatus') 
                  : currentStock > 0 ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            {/* Action Button */}
            <div className="space-y-6">
              {product.category[locale] === 'Showroom' ? (
                <Link 
                  href={`/${locale}/showroom`}
                  className="w-full py-5 uppercase tracking-widest text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl bg-primary-anthracite text-primary-ivory hover:bg-accent-oak"
                >
                  {t('bookAppointment')}
                </Link>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || !isSelectionComplete}
                  className={`w-full py-5 uppercase tracking-widest text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                    added
                      ? 'bg-green-600 text-white'
                      : isSelectionComplete 
                        ? 'bg-primary-anthracite text-primary-ivory hover:bg-accent-oak'
                        : 'bg-gray-100 text-primary-anthracite/30 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {added ? (
                    <Check size={18} />
                  ) : (
                    <ShoppingBag size={18} strokeWidth={1.5} />
                  )}
                  {getButtonText()}
                </motion.button>
              )}

              {/* Project Inquiry Info Box */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-8 border border-accent-oak/20 bg-primary-ivory/50 rounded-2xl space-y-4"
              >
                <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100/50 space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-oak/60">
                {t('bespokeTitle')}
              </h3>
              <p className="text-xs text-primary-anthracite/60 leading-relaxed">
                {t('bespokeDesc')}
              </p>
              <Link 
                href={`/${locale}/contact`}
                className="inline-block text-[10px] uppercase tracking-widest font-bold border-b border-primary-anthracite pb-1 hover:text-accent-oak hover:border-accent-oak transition-all"
              >
                {t('bespokeContact')}
              </Link>
            </div>
  </motion.div>
            </div>

            {/* Description */}
            <p className="text-primary-anthracite/70 font-sans leading-relaxed text-lg border-t border-primary-anthracite/10 pt-8 whitespace-pre-wrap">
              {product.description[locale]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
