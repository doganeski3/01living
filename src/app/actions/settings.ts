'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'site-settings' }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'site-settings' }
      });
    }

    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const data = {
      siteName: (formData.get('siteName') as string) || '01 Living',
      contactEmail: (formData.get('contactEmail') as string) || 'info@01living.nl',
      contactPhone: (formData.get('contactPhone') as string) || '',
      address: (formData.get('address') as string) || '',
      freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string) || 0,
      shippingFee: parseFloat(formData.get('shippingFee') as string) || 0,
      vatRate: parseFloat(formData.get('vatRate') as string) || 21,
      instagramUrl: (formData.get('instagramUrl') as string) || null,
      pinterestUrl: (formData.get('pinterestUrl') as string) || null,
      facebookUrl: (formData.get('facebookUrl') as string) || null,
    };

    await prisma.settings.upsert({
      where: { id: 'site-settings' },
      update: data,
      create: {
        id: 'site-settings',
        ...data
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { success: false, error: 'Instellingen konden niet worden bijgewerkt.' };
  }
}
