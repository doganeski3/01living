'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function createCategory(formData: FormData) {
  try {
    const nameNl = formData.get('nameNl') as string;
    const nameEn = formData.get('nameEn') as string;
    const slug = formData.get('slug') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageFile = formData.get('image') as File;

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, 'categories');
    }

    const category = await prisma.category.create({
      data: {
        nameNl,
        nameEn,
        slug,
        order,
        image: imageUrl || null
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, category };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Categorie kon niet worden aangemaakt.' };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const nameNl = formData.get('nameNl') as string;
    const nameEn = formData.get('nameEn') as string;
    const slug = formData.get('slug') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageFile = formData.get('image') as File;
    const existingImage = formData.get('existingImage') as string;

    let imageUrl = existingImage;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, 'categories');
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameNl,
        nameEn,
        slug,
        order,
        image: imageUrl || null
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, category };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Categorie kon niet worden bijgewerkt.' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Categorie kon niet worden verwijderd.' };
  }
}
