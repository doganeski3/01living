'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Edit2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { useLocale } from 'next-intl';

interface Props {
  initialProducts: any[];
  currentPage: number;
  totalPages: number;
  currentSearch: string;
}

export default function ProductsTable({ initialProducts, currentPage, totalPages, currentSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const updateParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    if (!newParams.page) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchTerm, page: 1 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar: Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-anthracite/30 mb-6">Assortiment</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-primary-anthracite/60 font-medium">Items op buze pagina</span>
                <span className="font-heading text-xl">{initialProducts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Search & Table */}
      <div className="lg:col-span-3 space-y-6">
        <form onSubmit={handleSearch} className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-anthracite/20 group-focus-within:text-accent-oak transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoek op naam, SKU of collectie..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-primary-ivory/50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-accent-oak/20 transition-all placeholder:text-primary-anthracite/20"
            />
          </div>
        </form>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 border-b border-gray-100">
                  <th className="px-8 py-6 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/30 font-bold">Item Details</th>
                  <th className="px-8 py-6 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/30 font-bold">Prijs</th>
                  <th className="px-8 py-6 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/30 font-bold">Voorraad</th>
                  <th className="px-8 py-6 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/30 font-bold text-right">Beheer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {initialProducts.map((product) => {
                  let images = [];
                  try {
                    images = JSON.parse(product.images || '[]');
                  } catch (e) {
                    images = [];
                  }
                  
                  return (
                    <tr key={product.id} className="hover:bg-primary-ivory/10 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="relative w-14 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <Image 
                              src={images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'} 
                              alt={product.nameNl} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary-anthracite">{product.nameNl}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[9px] text-primary-anthracite/30 bg-gray-100 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{product.categoryNl}</span>
                              <Link 
                                href={`/${locale}/collecties/${product.slug}`} 
                                target="_blank" 
                                className="flex items-center gap-1.5 text-[9px] font-bold text-accent-oak uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:underline"
                              >
                                <Eye size={10} /> Bekijk
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-heading text-lg text-primary-anthracite">
                          €{product.price.toLocaleString('nl-NL')}
                        </div>
                        <p className="text-[8px] text-primary-anthracite/30 uppercase font-bold">Incl. BTW</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full shadow-sm animate-pulse ${product.stock > 10 ? 'bg-green-500 shadow-green-200' : product.stock > 0 ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock === 0 ? 'text-red-500' : 'text-primary-anthracite'}`}>{product.stock} items</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Link 
                            href={`/${locale}/01admin-portal/products/${product.id}`} 
                            className="p-3 bg-white text-primary-anthracite border border-gray-100 rounded-xl hover:bg-primary-anthracite hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {initialProducts.length === 0 && (
            <div className="px-8 py-32 text-center">
              <div className="max-w-xs mx-auto space-y-4">
                 <div className="w-16 h-16 bg-primary-ivory rounded-full flex items-center justify-center mx-auto text-primary-anthracite/10">
                    <Search size={32} />
                 </div>
                 <h4 className="text-sm font-bold text-primary-anthracite uppercase tracking-[0.2em]">Geen producten gevonden</h4>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">
              Pagina {currentPage} van {totalPages || 1}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateParams({ page: currentPage - 1 })}
                disabled={currentPage <= 1}
                className="p-3 rounded-2xl border border-gray-100 bg-white hover:bg-primary-anthracite hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => updateParams({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages}
                className="p-3 rounded-2xl border border-gray-100 bg-white hover:bg-primary-anthracite hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
