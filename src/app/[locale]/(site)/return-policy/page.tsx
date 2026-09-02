import { redirect } from 'next/navigation';

export default function ReturnPolicyAliasPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  if (locale === 'en') {
    redirect('/en/return-and-cancellation-policy');
  } else {
    redirect('/nl/retour-en-annulering');
  }
}
