import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressForm from "./AddressForm";
import { getTranslations } from "next-intl/server";

export default async function AddressPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Account");
  
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user) return null;

  return (
    <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in duration-700">
      <div className="mb-12 border-b border-gray-50 pb-8">
        <h2 className="text-2xl font-heading text-primary-anthracite mb-3 uppercase tracking-wider">{t('sidebar.address')}</h2>
        <p className="text-sm text-primary-anthracite/50 italic font-serif">{t('addressSubtitle')}</p>
      </div>
      
      <AddressForm user={user} />
    </div>
  );
}
