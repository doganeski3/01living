import dotenv from 'dotenv';
import path from 'path';

// Önce ayarları yükle!
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Sonra mail kütüphanesini içe aktar
import { sendOrderEmails, sendContactEmail } from './src/lib/mail';

async function testEmail() {
  console.log('--- TEST EMAIL START (Port: ' + process.env.SMTP_PORT + ') ---');
  try {
    // 1. Sipariş E-postaları Testi
    await sendOrderEmails({
      orderNumber: 'TEST-01-LIVING',
      customerName: 'Doğan Eski',
      customerEmail: 'info@01living.nl',
      totalAmount: 1450.00,
      locale: 'nl'
    });

    // 2. İletişim Formu E-postası Testi
    console.log('[MAIL] Preparing contact email for info@01living.nl...');
    await sendContactEmail({
      firstName: 'Doğan',
      lastName: 'Eski (Test)',
      email: 'info@01living.nl',
      phone: '+905555555555',
      message: 'Bu e-posta, SendPulse API entegrasyonunu doğrulamak için gönderilen canlı bir test mesajıdır.'
    });

    console.log('--- TEST EMAIL SUCCESS ---');
  } catch (error) {
    console.error('--- TEST EMAIL FAILED ---', error);
  }
}

testEmail();
