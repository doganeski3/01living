import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface AdminNotificationEmailProps {
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  baseUrl: string;
}

export const AdminNotificationEmail = ({
  orderNumber,
  totalAmount,
  customerName,
  baseUrl,
}: AdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nieuwe Bestelling Ontvangen: #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>01 LIVING</Text>
          <Text style={headerSub}>INTERNAL NOTIFICATION</Text>
        </Section>
        
        <Hr style={hrThin} />
        
        <Heading style={heading}>Nieuwe Bestelling!</Heading>
        
        <Section style={content}>
          <Text style={paragraph}>Er is een nieuwe bestelling geplaatst op de webshop.</Text>
          
          <Section style={orderInfoBox}>
            <div style={orderInfoRow}>
              <Text style={infoLabel}>Klant</Text>
              <Text style={infoValue}>{customerName}</Text>
            </div>
            <Hr style={hrInfo} />
            <div style={orderInfoRow}>
              <Text style={infoLabel}>Bestelnummer</Text>
              <Text style={infoValue}>#{orderNumber}</Text>
            </div>
            <Hr style={hrInfo} />
            <div style={orderInfoRow}>
              <Text style={infoLabel}>Totaalbedrag</Text>
              <Text style={infoValue}>€{totalAmount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</Text>
            </div>
          </Section>

          <Section style={buttonContainer}>
            <Link
              style={button}
              href={`${baseUrl}/nl/01admin-portal/orders`}
            >
              Bekijk Bestelling in Admin Portal
            </Link>
          </Section>
        </Section>
        
        <Hr style={hrThin} />
        
        <Section style={footerSection}>
          <Text style={footerText}>
            SYSTEM NOTIFICATION | 01 LIVING
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNotificationEmail;

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
  fontSize: "24px",
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

const content = {
  padding: "20px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#444",
  marginBottom: "20px",
  textAlign: "center" as const,
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
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const hrInfo = {
  borderColor: "#e5e1da",
  margin: "15px 0",
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

const footerSection = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#ccc",
  fontSize: "10px",
  letterSpacing: "0.1em",
  marginTop: "20px",
};
