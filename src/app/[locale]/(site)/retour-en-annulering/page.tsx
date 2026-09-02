import { getTranslations } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RetourClient from './RetourClient';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'Legal.returns'});
  const isEn = locale === 'en';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/retour-en-annulering`,
      languages: {
        'nl': '/nl/retour-en-annulering',
        'en': '/en/retour-en-annulering',
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      locale: isEn ? 'en_US' : 'nl_NL',
      type: 'website',
    }
  };
}

export default function RetourEnAnnuleringPage() {
  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      <RetourClient />
      <Footer />
    </main>
  );
}
