import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Navbar from "@/components/Navbar";
import RetourClient from '../retour-en-annulering/RetourClient';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'Legal.returns'});
  const isEn = locale === 'en';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: isEn ? '/en/return-and-cancellation-policy' : '/nl/retour-en-annulering',
      languages: {
        'nl': '/nl/retour-en-annulering',
        'en': '/en/return-and-cancellation-policy',
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

export default function ReturnAndCancellationPolicyPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  if (locale === 'nl') {
    redirect('/nl/retour-en-annulering');
  }

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      <RetourClient />
    </main>
  );
}
