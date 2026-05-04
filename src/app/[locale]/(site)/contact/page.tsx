import { getTranslations } from 'next-intl/server';
import ContactClient from './ContactClient';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'Contact'});
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
