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
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  locale?: string;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  totalAmount,
  locale = 'nl',
}: OrderConfirmationEmailProps) => {
  const isEn = locale === 'en';
  
  return (
    <Html>
      <Head />
      <Preview>{isEn ? `Thank you for your order at 01 Living` : `Bedankt voor uw bestelling bij 01 Living`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>01 LIVING</Text>
            <Text style={headerSub}>{isEn ? 'THE HAGUE • SCHIEDAM' : 'DEN HAAG • SCHIEDAM'}</Text>
          </Section>
          
          <Hr style={hrThin} />
          
          <Heading style={heading}>{isEn ? `Order Confirmation` : `Bestelbevestiging`}</Heading>
          
          <Text style={paragraph}>{isEn ? `Dear` : `Beste`} {customerName},</Text>
          
          <Text style={paragraph}>
            {isEn 
              ? `We have received your order #${orderNumber} in good order. Our team is starting immediately to prepare your items with the greatest care.`
              : `We hebben uw bestelling #${orderNumber} in goede orde ontvangen. Ons team gaat direct aan de slag om uw items met de grootste zorg voor te bereiden.`
            }
          </Text>

          <Section style={orderInfoBox}>
            <div style={orderInfoRow}>
              <Text style={infoLabel}>{isEn ? `Order Number` : `Bestelnummer`}</Text>
              <Text style={infoValue}>#{orderNumber}</Text>
            </div>
            <Hr style={hrInfo} />
            <div style={orderInfoRow}>
              <Text style={infoLabel}>{isEn ? `Total Amount` : `Totaalbedrag`}</Text>
              <Text style={infoValue}>€{totalAmount.toLocaleString(isEn ? "en-US" : "nl-NL", { minimumFractionDigits: 2 })}</Text>
            </div>
          </Section>

          <Text style={paragraph}>
            {isEn
              ? `As soon as your order has been shipped, you will receive an email from us with the tracking details.`
              : `Zodra uw bestelling is verzonden, ontvangt u van ons een e-mail met de trackinggegevens.`
            }
          </Text>

          <Text style={signature}>
            {isEn ? 'Warm regards,' : 'Met warme groet,'}
            <br />
            <strong>01 Living Team</strong>
          </Text>
          
          <Hr style={hrThin} />
          
          <Section style={footerSection}>
            <Text style={footerText}>
              01 LIVING | LUXURY INTERIOR DESIGN & FURNITURE
              <br />
              Zinkwerf 24A, 2544EE Den Haag
              <br />
              {isEn ? `The Netherlands` : `Nederland`}
            </Text>
            <Text style={footerDisclaimer}>
              {isEn 
                ? 'This is an automated message. Please do not reply directly to this email.' 
                : 'Dit is een automatisch bericht. Reageer a.u.b. niet direct op deze e-mail.'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

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
  fontSize: "20px",
  fontWeight: "300",
  textAlign: "center" as const,
  margin: "40px 0",
  color: "#1a1a1a",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#444",
  marginBottom: "20px",
};

const orderInfoBox = {
  backgroundColor: "#f9f8f6",
  padding: "30px",
  margin: "40px 0",
};

const orderInfoRow = {
  margin: "0",
};

const infoLabel = {
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "#8b7355",
  fontWeight: "bold" as const,
  marginBottom: "5px",
};

const infoValue = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const hrInfo = {
  borderColor: "#e5e1da",
  margin: "20px 0",
};

const hrThin = {
  borderColor: "#f0f0f0",
  margin: "30px 0",
};

const signature = {
  fontSize: "15px",
  color: "#1a1a1a",
  marginTop: "40px",
};

const footerSection = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#999",
  fontSize: "11px",
  lineHeight: "18px",
  letterSpacing: "0.05em",
  marginTop: "20px",
};

const footerDisclaimer = {
  color: "#ccc",
  fontSize: "10px",
  marginTop: "20px",
};
