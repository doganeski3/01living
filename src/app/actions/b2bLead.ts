'use server';

import { sendB2BLeadEmail } from '@/lib/mail';

export interface B2BLeadFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  services: string[];
  volume: string;
  message: string;
  locale?: string;
}

export async function submitB2BLeadRequest(formData: B2BLeadFormData) {
  try {
    if (!formData.fullName?.trim()) {
      return { success: false, error: 'Full name is required / Naam is verplicht.' };
    }
    if (!formData.companyName?.trim()) {
      return { success: false, error: 'Company name is required / Bedrijfsnaam is verplicht.' };
    }
    if (!formData.email?.trim()) {
      return { success: false, error: 'Email address is required / E-mailadres is verplicht.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return { success: false, error: 'Invalid email address / Ongeldig e-mailadres.' };
    }

    return await sendB2BLeadEmail({
      fullName: formData.fullName.trim(),
      companyName: formData.companyName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || '',
      services: formData.services || [],
      volume: formData.volume || '',
      message: formData.message?.trim() || '',
      locale: formData.locale || 'nl',
    });
  } catch (error: any) {
    console.error('submitB2BLeadRequest error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while submitting your request.',
    };
  }
}
