import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';
import OrderStatusEmail from '@/emails/OrderStatusEmail';
import WelcomeEmail from '@/emails/WelcomeEmail';

// Dynamic Transporter to ensure .env is loaded first
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const FROM_EMAIL = 'info@01living.nl'; 
const ADMIN_EMAIL = 'info@01living.nl'; 

interface Order {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  locale?: string;
}

export async function sendOrderEmails(order: Order) {
  if (!process.env.SMTP_HOST) {
    console.log('[SMTP] MOCK MODE: No SMTP config found.');
    return;
  }

  const locale = order.locale || 'nl';
  const isEn = locale === 'en';

  try {
    console.log(`[SMTP] Rendering & Sending emails for #${order.orderNumber} (Locale: ${locale})...`);
    
    const customerHtml = await render(OrderConfirmationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      locale: locale,
    }));

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const adminHtml = await render(AdminNotificationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      baseUrl: baseUrl,
    }));

    // 1. Send to Customer
    getTransporter().sendMail({
      from: `"01 Living" <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: isEn 
        ? `Order Confirmation - 01 Living - #${order.orderNumber}`
        : `Bedankt voor uw bestelling bij 01 Living - #${order.orderNumber}`,
      html: customerHtml,
    }).then(() => console.log('[SMTP] CUSTOMER EMAIL SUCCESS'))
      .catch(err => console.error('[SMTP] CUSTOMER EMAIL FAILED:', err));

    // 2. Send to Admin
    getTransporter().sendMail({
      from: `"01 Living System" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Nieuwe Bestelling: #${order.orderNumber}`,
      html: adminHtml,
    }).then(() => console.log('[SMTP] ADMIN EMAIL SUCCESS'))
      .catch(err => console.error('[SMTP] ADMIN EMAIL FAILED:', err));

  } catch (error) {
    console.error('[SMTP] FATAL EXCEPTION:', error);
  }
}

export async function sendOrderStatusEmail(
  order: Order, 
  status: 'shipped' | 'cancelled' | 'delivered',
  trackingNumber?: string,
  shippingCarrier?: string
) {
  if (!process.env.SMTP_HOST) return;

  const locale = order.locale || 'nl';
  const isEn = locale === 'en';

  const subjects = {
    shipped: isEn ? `Your order from 01 Living is on its way! (#${order.orderNumber})` : `Uw bestelling bij 01 Living is onderweg! (#${order.orderNumber})`,
    delivered: isEn ? `Order delivered (#${order.orderNumber})` : `Bestelling bezorgd (#${order.orderNumber})`,
    cancelled: isEn ? `Information about your cancelled order (#${order.orderNumber})` : `Informatie over uw geannuleerde bestelling (#${order.orderNumber})`,
  };

  try {
    const html = await render(OrderStatusEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status,
      trackingNumber,
      shippingCarrier,
      locale: locale,
    }));

    getTransporter().sendMail({
      from: `"01 Living" <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: subjects[status],
      html: html,
    }).then(() => console.log(`[SMTP] Status email (${status}) sent for #${order.orderNumber}`))
      .catch(err => console.error(`[SMTP] Failed to send ${status} email:`, err));
  } catch (error) {
    console.error(`[SMTP] Failed to render ${status} email:`, error);
  }
}

export async function sendWelcomeEmail(email: string, name: string, locale: string = 'nl') {
  if (!process.env.SMTP_HOST) return;

  const isEn = locale === 'en';

  try {
    const html = await render(WelcomeEmail({ customerName: name, locale: locale }));
    
    await getTransporter().sendMail({
      from: `"01 Living" <${FROM_EMAIL}>`,
      to: email,
      subject: isEn ? 'Welcome to 01 Living' : 'Welkom bij 01 Living',
      html: html,
    });
    console.log(`[SMTP] Welcome email sent to ${email}`);
  } catch (error) {
    console.error('[SMTP] Failed to send welcome email:', error);
  }
}

export async function sendContactEmail(formData: { name: string; email: string; message: string }) {
  if (!process.env.SMTP_HOST) return { success: false, error: 'SMTP Host is not configured.' };

  try {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nieuw Contactbericht</h2>
        <p><strong>Naam:</strong> ${formData.name}</p>
        <p><strong>E-mail:</strong> ${formData.email}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin-top: 0;"><strong>Bericht:</strong></p>
          <p style="white-space: pre-wrap; color: #444;">${formData.message}</p>
        </div>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888;">Dit bericht is verzonden via het contactformulier op 01living.nl</p>
      </div>
    `;

    await getTransporter().sendMail({
      from: `"01 Living Contact" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: formData.email,
      subject: `Nieuw Contactbericht: ${formData.name}`,
      html: html,
    });

    console.log(`[SMTP] Contact email sent from ${formData.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('[SMTP] Failed to send contact email:', error);
    return { success: false, error: error.message || 'Er is bir hata oluştu.' };
  }
}


