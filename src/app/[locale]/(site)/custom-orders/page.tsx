import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Navbar from "@/components/Navbar";
import CustomOrdersClient from '../speciale-bestellingen/CustomOrdersClient';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const isEn = locale === 'en';

  return {
    title: isEn ? "Custom Orders & Bespoke Projects | 01 Living" : "Speciale Bestellingen & Maatwerk | 01 Living",
    description: isEn
      ? "Discover our bespoke custom solutions across electric mobility, smart electronics, modular containers, bespoke furniture, and commercial projects."
      : "Ontdek onze op maat gemaakte oplossingen voor elektrische mobiliteit, elektronica, modulaire containers, meubels en B2B projecten.",
    alternates: {
      canonical: isEn ? '/en/custom-orders' : '/nl/speciale-bestellingen',
      languages: {
        'nl': '/nl/speciale-bestellingen',
        'en': '/en/custom-orders',
      },
    },
    openGraph: {
      title: isEn ? "Custom Orders & Bespoke Solutions | 01 Living" : "Speciale Bestellingen | 01 Living",
      description: isEn
        ? "Tailored solutions for every need across electric mobility, electronics, modular containers, and bespoke furniture."
        : "Her İhtiyaca Özel Çözümler - Elektrikli araçlar, elektronik, modüler çözümler ve özel siparişler.",
      locale: isEn ? 'en_US' : 'nl_NL',
      type: 'website',
    }
  };
}

export default function CustomOrdersPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  if (locale === 'nl') {
    redirect('/nl/speciale-bestellingen');
  }

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      <CustomOrdersClient />
    </main>
  );
}
