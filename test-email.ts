import dotenv from 'dotenv';
import path from 'path';

// Önce ayarları yükle!
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Sonra mail kütüphanesini içe aktar
import { sendOrderEmails } from './src/lib/mail';

async function testEmail() {
  console.log('--- TEST EMAIL START (Port: ' + process.env.SMTP_PORT + ') ---');
  try {
    await sendOrderEmails({
      orderNumber: 'TEST-01-LIVING',
      customerName: 'Doğan Eski',
      customerEmail: 'doganeski47@gmail.com',
      totalAmount: 1450.00,
      locale: 'nl'
    });
    console.log('--- TEST EMAIL SUCCESS ---');
  } catch (error) {
    console.error('--- TEST EMAIL FAILED ---', error);
  }
}

testEmail();
