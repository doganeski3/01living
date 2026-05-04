import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Account");
  
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user) return null;

  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-700">
      <h2 className="text-xl font-heading text-primary-anthracite mb-8 uppercase tracking-wider">{t('sidebar.profile')}</h2>
      <p className="text-sm text-primary-anthracite/50 mb-10 italic font-serif">{t('profileSubtitle')}</p>
      
      <ProfileForm user={user} />
    </div>
  );
}
