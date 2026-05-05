'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import ProductGrid from '@/components/ProductGrid';
import Navbar from '@/components/Navbar';
import { SlidersHorizontal, Check, Search, X, ArrowUpDown, ChevronDown, Palette, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PRICE_RANGES = [
  { label: '€0 — €500', min: 0, max: 500 },
  { label: '€500 — €2.000', min: 500, max: 2000 },
  { label: '€2.000 — €5.000', min: 2000, max: 5000 },
  { label: '€5.000+', min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'filters.sortOptions.newest' },
  { value: 'price-asc', labelKey: 'filters.sortOptions.priceLowHigh' },
  { value: 'price-desc', labelKey: 'filters.sortOptions.priceHighLow' },
];

interface Category {
  id: string;
  nameNl: string;
  nameEn: string;
  slug: string;
  image: string | null;
  order: number;
}

export default function CollectiesClient({ initialProducts, dbCategories = [] }: { initialProducts: Product[], dbCategories?: Category[] }) {
  const t = useTranslations('Collecties');
  const locale = useLocale() as 'en' | 'nl';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedMaxPrice = Number(searchParams.get('maxPrice') || 0);
  const selectedMinPrice = Number(searchParams.get('minPrice') || 0);
  const selectedColor = searchParams.get('color') || '';
  const selectedSort = searchParams.get('sort') || 'newest';

  // Available Categories
  const allCategories = useMemo(() => {
    // If we have categories in DB, use them
    if (dbCategories.length > 0) {
      return dbCategories
        .filter(c => c.slug !== 'all-products')
        .sort((a, b) => a.order - b.order)
        .map(c => locale === 'nl' ? c.nameNl : c.nameEn);
    }

    const rawCategories = Array.from(
      new Set(initialProducts.map((p) => p.category[locale]))
    );

    // Fixed order based on user request (Showroom, Koltuk, Köşe, Sandalye, etc.)
    // Mapped to both NL and EN keywords
    const categoryPriorityMap = [
      ['showroom'],                                    // 1. SHOWROOM
      ['fauteuil', 'armchair', 'bank', 'sofa', 'koltuk'], // 2. KOLTUK
      ['hoekbank', 'corner sofa', 'köşe'],              // 3. KÖŞE KANEPELER
      ['stoel', 'chair', 'sandalye'],                   // 4. SANDALYE
      ['bed', 'yatak'],                                 // 5. YATAK
      ['tafel', 'table', 'masa'],                       // 6. MASA (TABLE)
      ['salontafel', 'coffee table', 'sehpa'],          // 7. SEHPA (COFFEE TABLE)
      ['accessoire', 'accessory', 'aksesuar'],          // 8. AKSESUAR
      ['spiegel', 'mirror', 'ayna'],                    // 9. AYNA
      ['tapijt', 'rug', 'carpet', 'halı'],              // 10. HALI
    ];

    return rawCategories.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      const aIdx = categoryPriorityMap.findIndex(keywords => 
        keywords.some(kw => aLower === kw)
      );
      const bIdx = categoryPriorityMap.findIndex(keywords => 
        keywords.some(kw => bLower === kw)
      );

      const finalAIdx = aIdx === -1 ? 999 : aIdx;
      const finalBIdx = bIdx === -1 ? 999 : bIdx;

      if (finalAIdx !== finalBIdx) return finalAIdx - finalBIdx;
      return a.localeCompare(b);
    });
  }, [initialProducts, locale, dbCategories]);

  // Available Colors (from variants)
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    initialProducts.forEach(p => {
      p.variants?.forEach(v => {
        const color = v.color[locale];
        if (color) colors.add(color);
      });
    });
    return Array.from(colors).sort();
  }, [initialProducts, locale]);

  // Category Images for the grid view
  const categoryImages = useMemo(() => {
    const images: Record<string, string> = {
      'Showroom': '/showroom-kitchen.png',
    };

    // Use images from DB if available
    if (dbCategories.length > 0) {
      dbCategories.forEach(cat => {
        const name = locale === 'nl' ? cat.nameNl : cat.nameEn;
        if (cat.image) images[name] = cat.image;
      });
    }

    allCategories.forEach((cat) => {
      if (images[cat]) return; // Skip if already set from DB
      const product = initialProducts.find((p) => p.category[locale] === cat);
      if (product) images[cat] = product.images[0];
    });
    return images;
  }, [allCategories, initialProducts, locale, dbCategories]);

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAllFilters = () => {
    router.push('?', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let results = initialProducts.filter((p) => {
      const categoryMatch = !selectedCategory || selectedCategory === 'all' || p.category[locale] === selectedCategory;
      const priceMatch = !selectedMaxPrice || (p.price >= selectedMinPrice && p.price <= (selectedMaxPrice === Infinity ? 999999 : selectedMaxPrice));
      const searchMatch = !searchQuery || 
        p.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category[locale].toLowerCase().includes(searchQuery.toLowerCase());
      
      const colorMatch = !selectedColor || p.variants?.some(v => v.color[locale] === selectedColor);

      return categoryMatch && priceMatch && searchMatch && colorMatch;
    });

    // Sorting
    results = [...results].sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      // newest is default (prisma already returns desc by createdAt, but we can't be sure here if they are in order)
      return 0; 
    });

    return results;
  }, [initialProducts, selectedCategory, selectedMinPrice, selectedMaxPrice, searchQuery, selectedColor, selectedSort, locale]);

  const activeFiltersCount = (selectedCategory && selectedCategory !== 'all' ? 1 : 0) + 
                             (selectedMaxPrice ? 1 : 0) + 
                             (selectedColor ? 1 : 0);

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="/collections_hero.png"
            alt="Collections Hero"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </motion.div>
        <div className="relative z-10 text-center space-y-4 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-7xl font-heading text-primary-ivory uppercase tracking-[0.2em]"
          >
            {(selectedCategory === 'all' ? t('allProducts') : selectedCategory) || t('title')}
          </motion.h1>
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => updateFilter('category', null)}
              className="text-[10px] uppercase tracking-[0.4em] text-primary-ivory/60 hover:text-primary-ivory transition-colors"
            >
              ← {t('backToCollections')}
            </motion.button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {/* Special 'All Products' Card */}
              <motion.button
                onClick={() => updateFilter('category', 'all')}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-anthracite shadow-xl"
              >
                <Image
                  src={dbCategories.find(c => c.slug === 'all-products')?.image || "/collections_hero.png"}
                  alt="All Products"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <h2 className="text-3xl font-heading uppercase tracking-[0.3em] mb-4 transform transition-transform duration-500 group-hover:scale-110">
                    {t('allProducts')}
                  </h2>
                  <div className="h-[1px] w-12 bg-white/40 group-hover:w-24 transition-all duration-500" />
                  <p className="mt-4 text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {t('filters.showCategoryResults')}
                  </p>
                </div>
              </motion.button>

              {allCategories.map((cat, index) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  onClick={() => updateFilter('category', cat)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-xl"
                >
                  <Image
                    src={categoryImages[cat] || '/placeholder.png'}
                    alt={cat}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.85] group-hover:brightness-[0.7]"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <h2 className="text-3xl font-heading uppercase tracking-[0.3em] mb-4 transform transition-transform duration-500 group-hover:scale-110">
                      {cat}
                    </h2>
                    <div className="h-[1px] w-12 bg-white/40 group-hover:w-24 transition-all duration-500" />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {t('filters.showCategoryResults')}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Refined Filter Bar */}
              <div className="relative mb-12 z-40 flex flex-col gap-4">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 md:gap-8">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="group flex items-center gap-3 text-[11px] uppercase tracking-widest font-bold text-primary-anthracite hover:text-accent-oak transition-colors"
                    >
                      <div className="relative">
                        <SlidersHorizontal size={18} strokeWidth={2.5} />
                        {activeFiltersCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-accent-oak text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                            {activeFiltersCount}
                          </span>
                        )}
                      </div>
                      <span className="hidden sm:inline">{t('filters.title')}</span>
                    </button>
                    
                    <div className="h-6 w-[1px] bg-primary-anthracite/10 hidden sm:block" />

                    <div className="relative group hidden sm:block">
                      <select
                        value={selectedSort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="appearance-none bg-transparent text-[11px] uppercase tracking-widest font-bold pr-8 focus:outline-none cursor-pointer"
                      >
                        {SORT_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary-anthracite/40 group-hover:text-accent-oak transition-colors" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
                    <div className="relative w-full max-w-[200px]">
                      <input
                        type="text"
                        placeholder={t('filters.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-primary-anthracite/5 border-none rounded-full py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-accent-oak/30 transition-all placeholder:text-primary-anthracite/30"
                      />
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-anthracite/30" />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-anthracite/30 hover:text-primary-anthracite"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30 whitespace-nowrap">
                      {t('filters.results', { count: filteredProducts.length })}
                    </div>
                  </div>
                </div>

                {/* Active Filter Chips */}
                <AnimatePresence>
                  {(activeFiltersCount > 0 || searchQuery) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-wrap gap-2 px-2"
                    >
                      {selectedCategory && selectedCategory !== 'all' && (
                        <FilterChip label={selectedCategory} onRemove={() => updateFilter('category', 'all')} />
                      )}
                      {selectedMaxPrice > 0 && (
                        <FilterChip 
                          label={`${selectedMinPrice}€ - ${selectedMaxPrice === Infinity ? '∞' : selectedMaxPrice}€`} 
                          onRemove={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('minPrice');
                            params.delete('maxPrice');
                            router.push(`?${params.toString()}`, { scroll: false });
                          }} 
                        />
                      )}
                      {selectedColor && (
                        <FilterChip label={selectedColor} onRemove={() => updateFilter('color', null)} />
                      )}
                      {(activeFiltersCount > 1 || (activeFiltersCount > 0 && searchQuery)) && (
                        <button 
                          onClick={clearAllFilters}
                          className="text-[10px] uppercase tracking-widest font-bold text-accent-oak hover:underline px-2 py-1.5"
                        >
                          {t('filters.clearFilters')}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-primary-anthracite/50 space-y-6">
                  <div className="w-24 h-24 bg-primary-anthracite/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} strokeWidth={1} className="opacity-20" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-heading uppercase tracking-widest">{t('filters.noProductsFound')}</p>
                    <button 
                      onClick={clearAllFilters}
                      className="text-xs uppercase tracking-[0.3em] text-accent-oak hover:underline"
                    >
                      {t('filters.resetFilters')}
                    </button>
                  </div>
                </div>
              ) : (
                <ProductGrid products={filteredProducts} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[150] bg-primary-anthracite/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-[160] bg-primary-ivory shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-primary-anthracite/5">
                <h2 className="text-2xl font-heading uppercase tracking-widest">{t('filters.title')}</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-primary-anthracite/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {/* Categories */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-accent-oak" />
                    <h3 className="text-sm uppercase tracking-widest font-bold">{t('title')}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateFilter('category', 'all')}
                      className={`px-4 py-3 text-xs uppercase tracking-widest font-medium rounded-xl border transition-all ${
                        selectedCategory === 'all' || !selectedCategory
                          ? 'bg-primary-anthracite text-white border-primary-anthracite'
                          : 'bg-white text-primary-anthracite border-primary-anthracite/10 hover:border-accent-oak/30'
                      }`}
                    >
                      {t('allProducts')}
                    </button>
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => updateFilter('category', cat)}
                        className={`px-4 py-3 text-xs uppercase tracking-widest font-medium rounded-xl border transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary-anthracite text-white border-primary-anthracite'
                            : 'bg-white text-primary-anthracite border-primary-anthracite/10 hover:border-accent-oak/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Price Range */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="text-accent-oak font-bold text-lg">€</div>
                    <h3 className="text-sm uppercase tracking-widest font-bold">{t('filters.priceRange')}</h3>
                  </div>
                  <div className="space-y-3">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range.label}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('minPrice', range.min.toString());
                          params.set('maxPrice', range.max.toString());
                          router.push(`?${params.toString()}`, { scroll: false });
                        }}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                          selectedMaxPrice === range.max && selectedMinPrice === range.min
                            ? 'bg-primary-anthracite text-white border-primary-anthracite'
                            : 'bg-white text-primary-anthracite border-primary-anthracite/10 hover:border-accent-oak/30'
                        }`}
                      >
                        <span className="text-xs font-medium uppercase tracking-wider">{range.label}</span>
                        {selectedMaxPrice === range.max && selectedMinPrice === range.min && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Colors */}
                {allColors.length > 0 && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Palette size={18} className="text-accent-oak" />
                      <h3 className="text-sm uppercase tracking-widest font-bold">{t('filters.colors')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {allColors.map(color => (
                        <button
                          key={color}
                          onClick={() => updateFilter('color', selectedColor === color ? null : color)}
                          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                            selectedColor === color
                              ? 'bg-primary-anthracite text-white border-primary-anthracite'
                              : 'bg-white text-primary-anthracite border-primary-anthracite/10 hover:border-accent-oak/30'
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-widest font-bold">{color}</span>
                          {selectedColor === color && <Check size={10} />}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="p-8 border-t border-primary-anthracite/5 space-y-4">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-primary-anthracite text-white py-5 rounded-xl uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-primary-anthracite/90 transition-all shadow-xl"
                >
                  {t('filters.showResults', { count: filteredProducts.length })}
                </button>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsFilterOpen(false);
                  }}
                  className="w-full py-4 text-primary-anthracite/40 hover:text-primary-anthracite text-[10px] uppercase tracking-widest font-bold transition-colors"
                >
                  {t('filters.clearFilters')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function FilterChip({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 bg-white border border-primary-anthracite/5 rounded-full pl-4 pr-2 py-1.5 shadow-sm"
    >
      <span className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/60">{label}</span>
      <button 
        onClick={onRemove}
        className="p-1 hover:bg-primary-anthracite/5 rounded-full transition-colors text-primary-anthracite/40 hover:text-accent-oak"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

function ShoppingBag({ size, className, strokeWidth = 2 }: { size?: number, className?: string, strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
