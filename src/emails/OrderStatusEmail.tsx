import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface OrderStatusEmailProps {
  customerName: string;
  orderNumber: string;
  status: 'shipped' | 'cancelled' | 'delivered';
  trackingNumber?: string;
  shippingCarrier?: string;
  locale?: string;
}

export default function OrderStatusEmail({
  customerName,
  orderNumber,
  status,
  trackingNumber,
  shippingCarrier,
  locale = 'nl',
}: OrderStatusEmailProps) {
  const isEn = locale === 'en';

  const statusConfig = {
    shipped: {
      title: isEn ? 'Your order is on its way' : 'Uw bestelling is onderweg',
      preview: isEn ? 'Your order from 01 Living has been shipped.' : 'Uw bestelling bij 01 Living is verzonden.',
      text: isEn 
        ? `Good news! Your order #${orderNumber} has just been shipped. We hope you will enjoy your new acquisition.`
        : `Goed nieuws! Uw bestelling #${orderNumber} is zojuist verzonden. We hopen dat u veel plezier zult hebben van uw nieuwe aanwinst.`,
      cta: isEn ? (trackingNumber ? 'Track Order' : 'View Order') : (trackingNumber ? 'Bestelling Volgen' : 'Bekijk Bestelling'),
    },
    delivered: {
      title: isEn ? 'Order delivered' : 'Bestelling bezorgd',
      preview: isEn ? 'Your 01 Living order has been delivered.' : 'Uw 01 Living bestelling is bezorgd.',
      text: isEn
        ? `Your order #${orderNumber} has been successfully delivered. We hope it looks beautiful in your interior.`
        : `Uw bestelling #${orderNumber} is succesvol bezorgd. We hopen dat het prachtig staat in uw interieur.`,
      cta: isEn ? 'Share your experience' : 'Deel uw ervaring',
    },
    cancelled: {
      title: isEn ? 'Order cancelled' : 'Bestelling geannuleerd',
      preview: isEn ? 'Information about your cancelled order.' : 'Informatie over uw geannuleerde bestelling.',
      text: isEn
        ? `Your order #${orderNumber} has been cancelled. If a payment has already been made, it will be refunded within a few business days.`
        : `Uw bestelling #${orderNumber} is geannuleerd. Indien er al een betaling heeft plaatsgevonden, wordt dit binnen enkele werkdagen teruggestort.`,
      cta: isEn ? 'Contact us' : 'Contact opnemen',
    },
  };

  const config = statusConfig[status];

  return (
    <Html>
      <Head />
      <Preview>{config.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>01 LIVING</Text>
            <Text style={headerSub}>{isEn ? 'THE HAGUE • SCHIEDAM' : 'DEN HAAG • SCHIEDAM'}</Text>
          </Section>
          
          <Hr style={hrThin} />
          
          <Section style={content}>
            <Heading style={heading}>{config.title}</Heading>
            
            <Text style={paragraph}>
              {isEn ? 'Dear' : 'Beste'} {customerName},
            </Text>
            
            <Text style={paragraph}>
              {config.text}
            </Text>
            
            {status === 'shipped' && trackingNumber && (
              <Section style={trackSection}>
                <Text style={trackLabel}>Track & Trace {shippingCarrier ? `(${shippingCarrier})` : ''}</Text>
                <Text style={trackCode}>{trackingNumber}</Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Link href="https://01living.nl/account" style={button}>
                {config.cta}
              </Link>
            </Section>
          </Section>

          <Text style={signature}>
            {isEn ? 'Warm regards,' : 'Met warme groet,'}
            <br />
            <strong>01 Living Team</strong>
          </Text>
          
          <Hr style={hrThin} />
          
          <Section style={footerSection}>
            <Text style={footerText}>
              {isEn 
                ? 'Do you have questions? Reply to this email or contact us via info@01living.nl'
                : 'Heeft u vragen? Reageer op deze e-mail of neem contact op via info@01living.nl'}
            </Text>
            <Text style={footerText}>
              © 2026 01 LIVING. {isEn ? 'ALL RIGHTS RESERVED.' : 'ALLE RECHTEN VOORBEHOUDEN.'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f7f5f2",
  fontFamily: 'HelveticaNeue-Light, "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
};

const container = {
  margin: "40px auto",
  padding: "40px",
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  borderRadius: "0",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "28px",
  letterSpacing: "0.4em",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const headerSub = {
  fontSize: "10px",
  letterSpacing: "0.2em",
  color: "#8b7355",
  marginTop: "10px",
  textTransform: "uppercase" as const,
};

const heading = {
  fontSize: "22px",
  fontWeight: "300",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#1a1a1a",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
};

const content = {
  padding: "20px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "26px",
  color: "#444",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const trackSection = {
  backgroundColor: "#f9f8f6",
  padding: "30px",
  margin: "30px 0",
  textAlign: "center" as const,
};

const trackLabel = {
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "#8b7355",
  fontWeight: "bold" as const,
  marginBottom: "10px",
};

const trackCode = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const button = {
  backgroundColor: "#1a1a1a",
  borderRadius: "0",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "18px 30px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
};

const hrThin = {
  borderColor: "#f0f0f0",
  margin: "30px 0",
};

const signature = {
  fontSize: "14px",
  color: "#1a1a1a",
  marginTop: "40px",
  textAlign: "center" as const,
};

const footerSection = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#999",
  fontSize: "10px",
  lineHeight: "18px",
  letterSpacing: "0.1em",
  marginTop: "10px",
};
