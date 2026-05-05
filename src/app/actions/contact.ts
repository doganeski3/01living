'use server';

import { sendContactEmail as sendMail } from '@/lib/mail';

export async function sendContactEmail(formData: { 
  firstName: string; 
  lastName: string; 
  email: string; 
  phone?: string; 
  date?: string; 
  time?: string; 
  location?: string; 
  message: string; 
}) {
  return await sendMail(formData);
}
