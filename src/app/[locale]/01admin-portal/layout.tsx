import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SidebarWrapper from '@/components/admin/SidebarWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <SidebarWrapper>
      {children}
    </SidebarWrapper>
  );
}
