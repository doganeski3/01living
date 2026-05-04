import { render } from '@react-email/render';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';
import OrderStatusEmail from '@/emails/OrderStatusEmail';
import WelcomeEmail from '@/emails/WelcomeEmail';

// SendPulse API Helpers
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getSendPulseToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;

  const response = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.SENDPULSE_API_ID,
      client_secret: process.env.SENDPULSE_API_SECRET,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Failed to get SendPulse token: ${JSON.stringify(data)}`);

  accessToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 60) * 1000;
  return accessToken;
}

async function sendEmailViaAPI(options: { to: string; subject: string; html: string; fromName?: string; fromEmail?: string; replyTo?: string }) {
  if (!process.env.SENDPULSE_API_ID || !process.env.SENDPULSE_API_SECRET) {
    console.warn('[MAIL] SENDPULSE_API_ID or SECRET is missing. Skipping email.');
    return;
  }

  try {
    const token = await getSendPulseToken();
    const response = await fetch('https://api.sendpulse.com/smtp/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: {
          html: Buffer.from(options.html).toString('base64'),
          subject: options.subject,
          from: {
            name: options.fromName || "01 Living",
            email: options.fromEmail || process.env.SMTP_USER || "info@01living.nl"
          },
          to: [
            {
              email: options.to
            }
          ]
        }
      })
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('[MAIL] SendPulse API Error:', result);
    } else {
      console.log('[MAIL] Email sent successfully via API to:', options.to);
    }
  } catch (error) {
    console.error('[MAIL] SendPulse API Exception:', error);
  }
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@01living.nl'; 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@01living.nl'; 

interface Order {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  locale?: string;
}

export async function sendOrderEmails(order: Order) {
  const locale = order.locale || 'nl';
  const isEn = locale === 'en';

  try {
    console.log(`[MAIL] Preparing order emails for #${order.orderNumber}...`);
    
    const customerHtml = await render(OrderConfirmationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      locale: locale,
    }));

    const baseUrl = process.env.NEXTAUTH_URL || 'https://01living.nl';

    const adminHtml = await render(AdminNotificationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      baseUrl: baseUrl,
    }));

    // Send to Customer
    sendEmailViaAPI({
      to: order.customerEmail,
      fromEmail: FROM_EMAIL,
      subject: isEn 
        ? `Order Confirmation - 01 Living - #${order.orderNumber}`
        : `Bedankt voor uw bestelling bij 01 Living - #${order.orderNumber}`,
      html: customerHtml,
    });

    // Send to Admin
    sendEmailViaAPI({
      to: ADMIN_EMAIL,
      fromEmail: FROM_EMAIL,
      fromName: "01 Living System",
      subject: `Nieuwe Bestelling: #${order.orderNumber}`,
      html: adminHtml,
    });

  } catch (error) {
    console.error('[MAIL] Rendering Error:', error);
  }
}

export async function sendOrderStatusEmail(
  order: Order, 
  status: 'shipped' | 'cancelled' | 'delivered',
  trackingNumber?: string,
  shippingCarrier?: string
) {
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

    sendEmailViaAPI({
      to: order.customerEmail,
      fromEmail: FROM_EMAIL,
      subject: subjects[status],
      html: html,
    });
  } catch (error) {
    console.error(`[MAIL] Failed to render ${status} email:`, error);
  }
}

export async function sendWelcomeEmail(email: string, name: string, locale: string = 'nl') {
  const isEn = locale === 'en';

  try {
    const html = await render(WelcomeEmail({ customerName: name, locale: locale }));
    
    sendEmailViaAPI({
      to: email,
      fromEmail: FROM_EMAIL,
      subject: isEn ? 'Welcome to 01 Living' : 'Welkom bij 01 Living',
      html: html,
    });
  } catch (error) {
    console.error('[MAIL] Failed to render welcome email:', error);
  }
}

export async function sendContactEmail(formData: { name: string; email: string; message: string }) {
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

    await sendEmailViaAPI({
      to: ADMIN_EMAIL,
      fromEmail: FROM_EMAIL,
      fromName: `Contact: ${formData.name}`,
      subject: `Nieuw Contactbericht: ${formData.name}`,
      html: html,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[MAIL] Failed to send contact email:', error);
    return { success: false, error: error.message || 'Er is bir hata oluştu.' };
  }
}


