'use server';

import { sendContactEmail as sendMail } from '@/lib/mail';

export async function sendContactEmail(formData: { name: string; email: string; message: string }) {
  return await sendMail(formData);
}
