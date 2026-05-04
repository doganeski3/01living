import { getTranslations } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import OverOnsClient from './OverOnsClient';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'OverOns'});
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function OverOns() {
  return (
    <main className="min-h-screen bg-primary-ivory overflow-x-hidden">
      <Navbar />
      <OverOnsClient />
    </main>
  );
}
