'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { updateProduct } from '@/app/actions/products';
import { ArrowLeft, Save, Loader2, X, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  nameNl: string;
  nameEn: string;
  slug: string;
  descNl: string;
  descEn: string;
  price: number;
  stock: number;
  images: string;
  categoryNl: string;
  categoryEn: string;
  dimensionsNl?: string | null;
  dimensionsEn?: string | null;
  variants?: { id: string, nameNl: string, nameEn: string, colorNl?: string, colorEn?: string, sizeNl?: string, sizeEn?: string, price: number, stock: number }[];
}

interface Props {
  product: Product;
  initialCategoriesNl: string[];
  initialCategoriesEn: string[];
}

export default function EditProductForm({ product, initialCategoriesNl, initialCategoriesEn }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(JSON.parse(product.images));
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState(product.variants?.map(v => ({ 
    colorNl: v.colorNl || '', 
    colorEn: v.colorEn || '', 
    sizeNl: v.sizeNl || '', 
    sizeEn: v.sizeEn || '', 
    price: v.price.toString(), 
    stock: v.stock.toString(),
    image: (v as any).image || '',
    type: (v.colorNl && v.sizeNl) ? 'both' : v.colorNl ? 'color' : 'size'
  })) || []);
  const [bulkColors, setBulkColors] = useState('');
  const [bulkSizes, setBulkSizes] = useState('');
  const [mainPrice, setMainPrice] = useState(product.price.toString());
  const [mainStock, setMainStock] = useState(product.stock.toString());
  const [selectedCatNl, setSelectedCatNl] = useState(product.categoryNl);
  const [selectedCatEn, setSelectedCatEn] = useState(product.categoryEn);

  const isShowroom = selectedCatNl.toLowerCase() === 'showroom' || selectedCatEn.toLowerCase() === 'showroom';

  useEffect(() => {
    if (isShowroom) {
      setMainPrice('0');
      setVariants([]);
    }
  }, [isShowroom]);

  useEffect(() => {
    if (variants.length > 0 && !isShowroom) {
      const prices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
      const stocks = variants.map(v => parseInt(v.stock)).filter(s => !isNaN(s));
      
      if (prices.length > 0) {
        setMainPrice(Math.min(...prices).toString());
      }
      if (stocks.length > 0) {
        setMainStock(stocks.reduce((a, b) => a + b, 0).toString());
      }
    }
  }, [variants, isShowroom]);

  const generateMatrix = () => {
    if (isShowroom) return;
    const colors = bulkColors.split(',').map(c => c.trim()).filter(Boolean);
    const sizes = bulkSizes.split(',').map(s => s.trim()).filter(Boolean);
    
    if (colors.length === 0 && sizes.length === 0) return;

    const newVariants: any[] = [];

    if (colors.length > 0 && sizes.length > 0) {
      colors.forEach(color => {
        sizes.forEach(size => {
          newVariants.push({ colorNl: color, colorEn: color, sizeNl: size, sizeEn: size, price: '', stock: '', image: '', type: 'both' });
        });
      });
    } else if (colors.length > 0) {
      colors.forEach(color => {
        newVariants.push({ colorNl: color, colorEn: color, sizeNl: '', sizeEn: '', price: '', stock: '', image: '', type: 'color' });
      });
    } else if (sizes.length > 0) {
      sizes.forEach(size => {
        newVariants.push({ colorNl: '', colorEn: '', sizeNl: size, sizeEn: size, price: '', stock: '', image: '', type: 'size' });
      });
    }

    setVariants([...variants, ...newVariants]);
    setBulkColors('');
    setBulkSizes('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewFiles(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...urls]);

    e.target.value = '';
  };

  const removeExisting = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = (type: 'color' | 'size' | 'both') => {
    if (isShowroom) return;
    setVariants([...variants, { colorNl: '', colorEn: '', sizeNl: '', sizeEn: '', price: '', stock: '', image: '', type }]);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('existingImages', JSON.stringify(existingImages));
    formData.delete('images');
    newFiles.forEach(file => {
      formData.append('images', file);
    });

    formData.append('variants', JSON.stringify(variants));
    
    try {
      const result = await updateProduct(product.id, formData);
      if (result.success) {
        router.push(`/${locale}/01admin-portal/products`);
        router.refresh();
      } else {
        alert(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Er is een onverwachte fout opgetreden.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/01admin-portal/products`} className="p-3 hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-heading text-primary-anthracite">Product Bewerken</h1>
          <p className="text-primary-anthracite/50 text-sm">Pas de details aan van {product.nameNl}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-10">
            <div className="space-y-8">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-3">
                <span className="w-8 h-px bg-accent-oak"></span> Algemene Informatie
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Product Naam (NL)</label>
                  <input name="nameNl" defaultValue={product.nameNl} required className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Product Name (EN)</label>
                  <input name="nameEn" defaultValue={product.nameEn} required className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Slug / SKU</label>
                <input name="slug" defaultValue={product.slug} required className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Categorie (NL)</label>
                  <input 
                    name="categoryNl" 
                    list="categories-nl" 
                    value={selectedCatNl}
                    onChange={(e) => setSelectedCatNl(e.target.value)}
                    required 
                    className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                  />
                  <datalist id="categories-nl">
                    {initialCategoriesNl.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Category (EN)</label>
                  <input 
                    name="categoryEn" 
                    list="categories-en" 
                    value={selectedCatEn}
                    onChange={(e) => setSelectedCatEn(e.target.value)}
                    required 
                    className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                  />
                  <datalist id="categories-en">
                    {initialCategoriesEn.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>
              <p className="text-[9px] text-accent-oak font-medium italic">* 'Showroom' kategorisi seçilirse ürün satılamaz, fiyatsız görünür ve randevu butonu çıkar.</p>
            </div>

            <div className="space-y-8 pt-6 border-t border-gray-50">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-3">
                <span className="w-8 h-px bg-accent-oak"></span> Editoryale Beschrijving
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Beschrijving (NL)</label>
                  <textarea name="descNl" defaultValue={product.descNl} rows={4} required className="w-full bg-gray-50/50 border border-gray-100 p-6 text-sm focus:outline-none focus:border-accent-oak transition-all rounded-2xl leading-relaxed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Description (EN)</label>
                  <textarea name="descEn" defaultValue={product.descEn} rows={4} required className="w-full bg-gray-50/50 border border-gray-100 p-6 text-sm focus:outline-none focus:border-accent-oak transition-all rounded-2xl leading-relaxed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 block">
                      Afmetingen (NL) 
                      <span className="ml-2 text-[8px] text-accent-oak italic font-medium normal-case tracking-normal">
                        (İpucu: 'Başlık: Değer' formatında giriniz, örn. Boy: 180 cm)
                      </span>
                    </label>
                    <textarea name="dimensionsNl" defaultValue={product.dimensionsNl || ''} rows={2} className="w-full bg-gray-50/50 border border-gray-100 p-6 text-sm focus:outline-none focus:border-accent-oak transition-all rounded-2xl leading-relaxed" placeholder="bijv. 180x90 cm, Hoogte: 75 cm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 block">
                      Dimensions (EN)
                      <span className="ml-2 text-[8px] text-accent-oak italic font-medium normal-case tracking-normal">
                        (Hint: Use 'Label: Value' format, e.g. Height: 180 cm)
                      </span>
                    </label>
                    <textarea name="dimensionsEn" defaultValue={product.dimensionsEn || ''} rows={2} className="w-full bg-gray-50/50 border border-gray-100 p-6 text-sm focus:outline-none focus:border-accent-oak transition-all rounded-2xl leading-relaxed" placeholder="e.g. 180x90 cm, Height: 75 cm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-oak rounded-full"></div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/60">Snelle Variantmaker</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40">Kleuren (scheiden met komma's)</label>
                <input 
                  value={bulkColors}
                  onChange={e => setBulkColors(e.target.value)}
                  disabled={isShowroom}
                  className={`w-full bg-white border border-gray-100 py-3 px-4 text-xs focus:outline-none focus:border-accent-oak rounded-xl ${isShowroom ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                  placeholder={isShowroom ? 'Showroom ürünleri varyantsızdır' : 'Blauw, Geel, Antraciet...'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40">Afmetingen (scheiden met komma's)</label>
                <input 
                  value={bulkSizes}
                  onChange={e => setBulkSizes(e.target.value)}
                  disabled={isShowroom}
                  className={`w-full bg-white border border-gray-100 py-3 px-4 text-xs focus:outline-none focus:border-accent-oak rounded-xl ${isShowroom ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                  placeholder={isShowroom ? 'Showroom ürünleri varyantsızdır' : '120x60, 140x80, 160x90...'}
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={generateMatrix}
              disabled={isShowroom}
              className="w-full bg-primary-anthracite text-white py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-accent-oak transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Genereer Variant Matrix
            </button>
          </div>

          <div className={`bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8 ${isShowroom ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-3">
                <span className="w-8 h-px bg-accent-oak"></span> Productvarianten
              </h2>
              {!isShowroom && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addVariant('color')} className="text-[9px] uppercase tracking-widest font-bold text-accent-oak border border-accent-oak/20 px-3 py-2 rounded-lg hover:bg-accent-oak hover:text-white transition-all bg-accent-oak/5">+ Kleur</button>
                  <button type="button" onClick={() => addVariant('size')} className="text-[9px] uppercase tracking-widest font-bold text-accent-oak border border-accent-oak/20 px-3 py-2 rounded-lg hover:bg-accent-oak hover:text-white transition-all bg-accent-oak/5">+ Afmeting</button>
                  <button type="button" onClick={() => addVariant('both')} className="text-[9px] uppercase tracking-widest font-bold text-accent-oak border border-accent-oak/20 px-3 py-2 rounded-lg hover:bg-accent-oak hover:text-white transition-all bg-accent-oak/5">+ Beide</button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-2 text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40 w-20">Foto</th>
                    <th className="py-4 px-2 text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40 min-w-[120px]">Kleur (NL/EN)</th>
                    <th className="py-4 px-2 text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40 min-w-[120px]">Afmeting (NL/EN)</th>
                    <th className="py-4 px-2 text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40 w-28">Prijs (€)</th>
                    <th className="py-4 px-2 text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/40 w-20">Voorraad</th>
                    <th className="py-4 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {variants.map((variant, index) => (
                    <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="relative group/img w-10 h-12 bg-gray-50 rounded overflow-hidden border border-gray-100 cursor-pointer">
                          {variant.image ? (
                            <Image src={variant.image} alt="Variant" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 font-bold text-center p-1 leading-none">Kies Foto</div>
                          )}
                          <select className="absolute inset-0 opacity-0 cursor-pointer" value={variant.image} onChange={(e) => updateVariant(index, 'image', e.target.value)}>
                            <option value="">Geen</option>
                            {[...existingImages, ...newPreviews].map((url, i) => (<option key={i} value={url}>Foto {i + 1}</option>))}
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1">
                          <input placeholder="NL" value={variant.colorNl} onChange={e => updateVariant(index, 'colorNl', e.target.value)} className="w-full bg-transparent border-none py-1 text-xs focus:ring-0 focus:outline-none" />
                          <input placeholder="EN" value={variant.colorEn} onChange={e => updateVariant(index, 'colorEn', e.target.value)} className="w-full bg-transparent border-none py-1 text-xs focus:ring-0 focus:outline-none text-primary-anthracite/40" />
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1">
                          <input placeholder="NL" value={variant.sizeNl} onChange={e => updateVariant(index, 'sizeNl', e.target.value)} className="w-full bg-transparent border-none py-1 text-xs focus:ring-0 focus:outline-none" />
                          <input placeholder="EN" value={variant.sizeEn} onChange={e => updateVariant(index, 'sizeEn', e.target.value)} className="w-full bg-transparent border-none py-1 text-xs focus:ring-0 focus:outline-none text-primary-anthracite/40" />
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-anthracite/40 text-[10px]">€</span>
                          <input type="number" value={variant.price} onChange={e => updateVariant(index, 'price', e.target.value)} className="w-full bg-transparent border-none pl-4 py-2 text-xs focus:ring-0 focus:outline-none font-medium" />
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <input type="number" value={variant.stock} onChange={e => updateVariant(index, 'stock', e.target.value)} className="w-full bg-transparent border-none py-2 text-xs focus:ring-0 focus:outline-none" />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <button type="button" onClick={() => removeVariant(index)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><X size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {variants.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed border-gray-50 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">Nog geen varianten toegevoegd</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-3">
              <span className="w-8 h-px bg-accent-oak"></span> Prijs & Voorraad {variants.length > 0 && <span className="text-[9px] bg-accent-oak/10 px-2 py-0.5 rounded text-accent-oak">AUTOMATISCH</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Basisprijs (€)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  value={mainPrice}
                  onChange={e => setMainPrice(e.target.value)}
                  disabled={isShowroom}
                  required={!isShowroom}
                  className={`w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors ${variants.length > 0 ? 'text-accent-oak font-medium' : ''} ${isShowroom ? 'opacity-50 cursor-not-allowed bg-gray-200/30' : ''}`} 
                  placeholder={isShowroom ? 'N.v.t. (Showroom)' : '0.00'} 
                />
                {isShowroom && <p className="text-[9px] text-accent-oak font-bold">Showroom ürünlerinde fiyat girilemez.</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Totale Voorraad</label>
                <input name="stock" type="number" value={mainStock} onChange={e => setMainStock(e.target.value)} required className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-oak">Media</h2>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50/50 transition-all group">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-primary-anthracite/20 mb-2 group-hover:text-accent-oak transition-colors" />
                  <p className="text-[10px] font-bold text-primary-anthracite/40 uppercase tracking-widest">Nieuwe foto's</p>
                </div>
                <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-gray-100">
                    <Image src={src} alt="Current" fill className="object-cover" />
                    <button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ))}
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-accent-oak/20 ring-2 ring-accent-oak/10">
                    <Image src={src} alt="New" fill className="object-cover" />
                    <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    <span className="absolute bottom-1 right-1 bg-accent-oak text-white text-[8px] px-1 rounded uppercase font-bold">Nieuw</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary-anthracite text-primary-ivory py-6 uppercase tracking-[0.3em] text-xs font-bold flex items-center justify-center gap-4 hover:bg-accent-oak transition-all disabled:opacity-50 shadow-2xl rounded-2xl">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            Wijzigingen Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}
