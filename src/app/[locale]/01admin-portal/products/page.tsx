import { prisma } from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductsTable from './ProductsTable';
import { getLocale } from 'next-intl/server';

interface Props {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function ProductsAdmin({ searchParams }: Props) {
  const locale = await getLocale();
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const pageSize = 10;

  const where = {
    isArchived: false,
    OR: search ? [
      { nameNl: { contains: search, mode: 'insensitive' as const } },
      { nameEn: { contains: search, mode: 'insensitive' as const } },
      { categoryNl: { contains: search, mode: 'insensitive' as const } },
      { categoryEn: { contains: search, mode: 'insensitive' as const } },
    ] : undefined
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">Producten</h1>
          <p className="text-primary-anthracite/40 font-serif italic mt-2">Beheer je assortiment, prijzen en voorraad.</p>
        </div>
        <Link 
          href={`/${locale}/01admin-portal/products/new`} 
          className="bg-primary-anthracite text-primary-ivory px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center gap-4 hover:bg-accent-oak transition-all shadow-2xl rounded-2xl group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
          Nieuw Item
        </Link>
      </div>

      <ProductsTable 
        initialProducts={JSON.parse(JSON.stringify(products))} 
        currentPage={page}
        totalPages={totalPages}
        currentSearch={search}
      />
    </div>
  );
}
