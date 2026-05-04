import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Providers from "@/components/Providers";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  
  return {
    title: {
      default: isEn ? "01 Living | Luxury Interior Design & Furniture" : "01 Living | Luxe Interieurontwerp & Meubels",
      template: "%s | 01 Living"
    },
    description: isEn 
      ? "Experience timeless luxury with 01 Living. Curated interior design and minimalist furniture for the modern home."
      : "Ervaar tijdloze luxe met 01 Living. Zorgvuldig samengesteld interieurontwerp en minimalistische meubels voor het moderne huis.",
    keywords: ["luxury interior", "minimalist furniture", "Dutch design", "01 Living", "interieurontwerp"],
    metadataBase: new URL("https://01living.nl"),
    alternates: {
      canonical: "/",
      languages: {
        "en": "/en",
        "nl": "/nl",
      },
    },
  };
}

import CookieConsent from "@/components/CookieConsent";

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
            <CookieConsent />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
