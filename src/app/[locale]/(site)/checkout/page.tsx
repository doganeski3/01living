import { getTranslations } from 'next-intl/server';
import CheckoutClient from './CheckoutClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Checkout' });
  return { title: t('metaTitle') };
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  let user = null;

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        street: true,
        houseNumber: true,
        addition: true,
        city: true,
        postalCode: true,
        phone: true,
        country: true,
        companyName: true,
        vatNumber: true,
      }
    });
  }

  const settings = await prisma.settings.findUnique({
    where: { id: 'site-settings' }
  });

  return <CheckoutClient savedUser={user} settings={JSON.parse(JSON.stringify(settings))} />;
}
