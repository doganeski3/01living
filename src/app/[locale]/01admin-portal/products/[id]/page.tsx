import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params: { id } }: Props) {
  const [product, allProducts] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    }),
    prisma.product.findMany({
      select: { categoryNl: true, categoryEn: true }
    })
  ]);

  if (!product) notFound();

  const categoriesNl = Array.from(new Set(allProducts.map(p => p.categoryNl))).filter(Boolean);
  const categoriesEn = Array.from(new Set(allProducts.map(p => p.categoryEn))).filter(Boolean);

  // Ensure 'Showroom' is always in the list
  if (!categoriesNl.includes('Showroom')) categoriesNl.push('Showroom');
  if (!categoriesEn.includes('Showroom')) categoriesEn.push('Showroom');

  return (
    <EditProductForm 
      product={product} 
      initialCategoriesNl={categoriesNl} 
      initialCategoriesEn={categoriesEn} 
    />
  );
}
