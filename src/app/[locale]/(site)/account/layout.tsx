import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import AccountSidebar from "@/components/account/AccountSidebar";
import { getLocale } from "next-intl/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });

  if (!user) redirect(`/${locale}/login`);

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
