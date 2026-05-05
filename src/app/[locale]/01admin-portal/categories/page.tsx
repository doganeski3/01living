import { prisma } from '@/lib/prisma';
import { Plus } from 'lucide-react';
import { getLocale } from 'next-intl/server';
import CategoriesTable from './CategoriesTable';

export default async function CategoriesAdmin() {
  const locale = await getLocale();

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">Categorieën</h1>
          <p className="text-primary-anthracite/40 font-serif italic mt-2">Beheer je productcategorieën, volgorde en afbeeldingen.</p>
        </div>
      </div>

      <CategoriesTable 
        initialCategories={JSON.parse(JSON.stringify(categories))} 
      />
    </div>
  );
}
