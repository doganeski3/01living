import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
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
      console.log(`[MAIL] Email sent successfully via API to: ${options.to} from: ${options.fromEmail || process.env.SMTP_USER || 'info@01living.nl'}`);
    }
  } catch (error) {
    console.error('[MAIL] SendPulse API Exception:', error);
  }
}

async function sendEmailViaSMTP(options: { to: string; subject: string; html: string; fromName?: string; fromEmail?: string }) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[MAIL] SMTP credentials missing. Skipping SMTP.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  try {
    const fromName = options.fromName || "01 Living";
    const fromEmail = options.fromEmail || user;
    
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[MAIL] Email sent successfully via SMTP to: ${options.to} from: ${fromEmail}`);
    return true;
  } catch (error) {
    console.error('[MAIL] SMTP sending failed:', error);
    return false;
  }
}

async function dispatchEmail(options: { to: string; subject: string; html: string; fromName?: string; fromEmail?: string; replyTo?: string }) {
  if (process.env.USE_SMTP === 'true') {
    const success = await sendEmailViaSMTP(options);
    if (success) return;
  }
  await sendEmailViaAPI(options);
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
    dispatchEmail({
      to: order.customerEmail,
      fromEmail: FROM_EMAIL,
      subject: isEn 
        ? `Order Confirmation - 01 Living - #${order.orderNumber}`
        : `Bedankt voor uw bestelling bij 01 Living - #${order.orderNumber}`,
      html: customerHtml,
    });

    // Send to Admin
    dispatchEmail({
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

    dispatchEmail({
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
    
    dispatchEmail({
      to: email,
      fromEmail: FROM_EMAIL,
      subject: isEn ? 'Welcome to 01 Living' : 'Welkom bij 01 Living',
      html: html,
    });
  } catch (error) {
    console.error('[MAIL] Failed to render welcome email:', error);
  }
}

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
  try {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nieuw Contactbericht</h2>
        <p><strong>Naam:</strong> ${fullName}</p>
        <p><strong>E-mail:</strong> ${formData.email}</p>
        <p><strong>Telefoon:</strong> ${formData.phone || '-'}</p>
        <p><strong>Voorkeursdag:</strong> ${formData.date || '-'}</p>
        <p><strong>Voorkeurstijd:</strong> ${formData.time || '-'}</p>
        <p><strong>Locatie:</strong> ${formData.location || '-'}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin-top: 0;"><strong>Bericht:</strong></p>
          <p style="white-space: pre-wrap; color: #444;">${formData.message}</p>
        </div>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888;">Dit bericht is verzonden via het contactformulier op 01living.nl</p>
      </div>
    `;

    await dispatchEmail({
      to: ADMIN_EMAIL,
      fromEmail: FROM_EMAIL,
      fromName: `Contact: ${fullName}`,
      subject: `Nieuw Contactbericht: ${fullName}`,
      html: html,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[MAIL] Failed to send contact email:', error);
    return { success: false, error: error.message || 'Er is een fout opgetreden.' };
  }
}

export async function sendCustomOrderEmail(data: {
  category: string;
  productName: string;
  quantity: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    const html = `
      <div style="font-family: sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #C4A482; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #1A1A1A; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Nieuwe Aanvraag: Speciale Bestelling</h2>
          <p style="color: #888; font-size: 13px; margin: 5px 0 0 0;">Ontvangen via 01living.nl</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 160px; font-weight: bold;">Categorie:</td>
            <td style="padding: 8px 0; color: #1A1A1A;"><strong>${data.category}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Gewenst Product:</td>
            <td style="padding: 8px 0; color: #1A1A1A;">${data.productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Aantal:</td>
            <td style="padding: 8px 0; color: #1A1A1A;">${data.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Klant / Bedrijf:</td>
            <td style="padding: 8px 0; color: #1A1A1A;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">E-mail:</td>
            <td style="padding: 8px 0; color: #1A1A1A;"><a href="mailto:${data.email}" style="color: #C4A482;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Telefoon:</td>
            <td style="padding: 8px 0; color: #1A1A1A;">${data.phone || '-'}</td>
          </tr>
        </table>

        <div style="background-color: #F7F5F2; padding: 18px; border-left: 4px solid #C4A482; border-radius: 4px; margin-top: 15px;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #1A1A1A; font-size: 13px; text-transform: uppercase;">Projectdetails & Specificaties:</p>
          <p style="margin: 0; white-space: pre-wrap; color: #333; font-size: 14px; line-height: 1.6;">${data.message}</p>
        </div>

        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 11px; color: #999; text-align: center; margin: 10px 0 0 0;">01 Living — Den Haag, Nederland</p>
      </div>
    `;

    await dispatchEmail({
      to: ADMIN_EMAIL,
      fromEmail: FROM_EMAIL,
      fromName: `Offerte: ${data.fullName}`,
      subject: `[Speciale Bestelling] ${data.category} - ${data.fullName}`,
      html: html,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[MAIL] Failed to send custom order email:', error);
    return { success: false, error: error.message || 'Er is een fout opgetreden.' };
  }
}
