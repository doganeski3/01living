'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';


export async function createProduct(formData: FormData) {
  try {
    const nameNl = formData.get('nameNl') as string;
    const nameEn = formData.get('nameEn') as string;
    const slug = formData.get('slug') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const categoryNl = formData.get('categoryNl') as string;
    const categoryEn = formData.get('categoryEn') as string;
    const descNl = formData.get('descNl') as string;
    const descEn = formData.get('descEn') as string;

    const images: string[] = [];
    
    // Handle multiple image uploads
    const files = formData.getAll('images') as File[];
    for (const file of files) {
      if (file.size > 0) {
        const url = await uploadFile(file);
        images.push(url);
      }
    }

    // Fallback if no images uploaded (shouldn't happen with validation)
    if (images.length === 0) {
      const imageUrl = formData.get('imageUrl') as string;
      if (imageUrl) images.push(imageUrl);
    }

    const variantsJson = formData.get('variants') as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : [];

    const product = await prisma.product.create({
      data: {
        slug,
        nameNl,
        nameEn,
        descNl,
        descEn,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        images: JSON.stringify(images),
        categoryNl,
        categoryEn,
        variants: {
          create: variants.map((v: any) => ({
            nameNl: v.nameNl || null,
            nameEn: v.nameEn || null,
            colorNl: v.colorNl || null,
            colorEn: v.colorEn || null,
            sizeNl: v.sizeNl || null,
            sizeEn: v.sizeEn || null,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
            image: v.image || null
          }))
        }
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: 'Product kon niet worden aangemaakt.' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const nameNl = formData.get('nameNl') as string;
    const nameEn = formData.get('nameEn') as string;
    const slug = formData.get('slug') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const categoryNl = formData.get('categoryNl') as string;
    const categoryEn = formData.get('categoryEn') as string;
    const descNl = formData.get('descNl') as string;
    const descEn = formData.get('descEn') as string;
    const existingImagesJson = formData.get('existingImages') as string;
    
    const images: string[] = existingImagesJson ? JSON.parse(existingImagesJson) : [];
    
    // Handle new image uploads if any
    const files = formData.getAll('images') as File[];
    for (const file of files) {
      if (file.size > 0) {
        const url = await uploadFile(file);
        images.push(url);
      }
    }

    const variantsJson = formData.get('variants') as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        slug,
        nameNl,
        nameEn,
        descNl,
        descEn,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        images: JSON.stringify(images),
        categoryNl,
        categoryEn,
        variants: {
          deleteMany: {},
          create: variants.map((v: any) => ({
            nameNl: v.nameNl || null,
            nameEn: v.nameEn || null,
            colorNl: v.colorNl || null,
            colorEn: v.colorEn || null,
            sizeNl: v.sizeNl || null,
            sizeEn: v.sizeEn || null,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
            image: v.image || null
          }))
        }
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Product kon niet worden bijgewerkt.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isArchived: true }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Product kon niet worden verwijderd.' };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isArchived: true }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete products:', error);
    return { success: false, error: 'Producten konden niet worden verwijderd.' };
  }
}
