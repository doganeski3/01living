import { prisma } from '@/lib/prisma';
import NewProductForm from './NewProductForm';

export default async function NewProductPage() {
  // Fetch existing categories from products
  const products = await prisma.product.findMany({
    select: {
      categoryNl: true,
      categoryEn: true
    }
  });

  const categoriesNl = Array.from(new Set(products.map(p => p.categoryNl))).filter(Boolean);
  const categoriesEn = Array.from(new Set(products.map(p => p.categoryEn))).filter(Boolean);

  // Ensure 'Showroom' is always in the list
  if (!categoriesNl.includes('Showroom')) categoriesNl.push('Showroom');
  if (!categoriesEn.includes('Showroom')) categoriesEn.push('Showroom');

  return (
    <NewProductForm 
      initialCategoriesNl={categoriesNl} 
      initialCategoriesEn={categoriesEn} 
    />
  );
}
