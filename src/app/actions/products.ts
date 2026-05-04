'use server';

import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use sharp to optimize image: Resize, Convert to WebP
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Sanitize filename: Remove special characters and Turkish characters
  const cleanFileName = file.name.split('.')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace non-alphanumeric with hyphen
    .toLowerCase();

  const filename = `${Date.now()}-${cleanFileName}.webp`;
  
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filename, optimizedBuffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage Error:', error);
    throw new Error('Resim yüklenemedi.');
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filename);
  
  return publicUrl;
}

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
