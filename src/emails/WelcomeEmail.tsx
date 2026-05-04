'use client';

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  customerName: string;
  locale?: string;
}

export const WelcomeEmail = ({
  customerName,
  locale = 'nl',
}: WelcomeEmailProps) => {
  const isEn = locale === 'en';

  return (
    <Html>
      <Head />
      <Preview>{isEn ? 'Welcome to 01 Living - Discover timeless design' : 'Welkom bij 01 Living - Ontdek tijdloos design'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>01 LIVING</Text>
            <Text style={headerSub}>{isEn ? 'THE HAGUE • SCHIEDAM' : 'DEN HAAG • SCHIEDAM'}</Text>
          </Section>
          
          <Hr style={hrThin} />
          
          <Section style={content}>
            <Heading style={heading}>{isEn ? `Welcome,` : `Welkom,`} {customerName}</Heading>
            
            <Text style={paragraph}>
              {isEn 
                ? `We are delighted to welcome you to 01 Living. You have just created an account and are now part of our community of design enthusiasts.`
                : `We zijn verheugd je te verwelkomen bij 01 Living. Je hebt zojuist een account aangemaakt en bent nu onderdeel van onze community van designliefhebbers.`
              }
            </Text>
            
            <Text style={paragraph}>
              {isEn
                ? `At 01 Living, we believe in the power of minimalism and craftsmanship. Our collections are carefully curated to bring tranquility and elegance to your interior.`
                : `Bij 01 Living geloven we in de kracht van minimalisme en vakmanschap. Onze collecties zijn zorgvuldig samengesteld om rust en elegantie in je interieur te brengen.`
              }
            </Text>
            
            <Section style={buttonContainer}>
              <Link style={button} href="https://01living.nl/collecties">
                {isEn ? 'Discover the Collections' : 'Ontdek de Collecties'}
              </Link>
            </Section>
            
            <Text style={paragraphSmall}>
              {isEn
                ? `Do you have questions about a product or need advice? Our specialists are ready for you.`
                : `Heb je vragen over een product of heb je advies nodig? Onze specialisten staan voor je klaar.`
              }
            </Text>
          </Section>

          <Text style={signature}>
            {isEn ? 'Warm regards,' : 'Met warme groet,'}
            <br />
            <strong>01 Living Team</strong>
          </Text>
          
          <Hr style={hrThin} />
          
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2026 01 LIVING. {isEn ? 'ALL RIGHTS RESERVED.' : 'ALLE RECHTEN VOORBEHOUDEN.'}
              <br />
              Zinkwerf 24A, 2544EE Den Haag
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const paragraphSmall = {
  fontSize: "13px",
  lineHeight: "22px",
  color: "#888",
  textAlign: "center" as const,
  marginTop: "30px",
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
  marginTop: "20px",
};
