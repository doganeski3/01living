'use server';

import { sendCustomOrderEmail } from '@/lib/mail';

export async function submitCustomOrderRequest(formData: {
  category: string;
  productName: string;
  quantity: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    if (!formData.category || !formData.fullName || !formData.email || !formData.message) {
      return { success: false, error: 'Vul alstublieft alle verplichte velden in.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { success: false, error: 'Ongeldig e-mailadres.' };
    }

    return await sendCustomOrderEmail(formData);
  } catch (error: any) {
    console.error('Custom order action error:', error);
    return { success: false, error: 'Er is een fout opgetreden bij het verzenden van uw aanvraag.' };
  }
}
