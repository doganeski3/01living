import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email as string }
  });

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const pageSize = 10;

  const where = {
    OR: search ? [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
    ] : undefined
  };

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">Gebruikers</h1>
          <p className="text-[10px] text-primary-anthracite/40 font-serif italic mt-1">Beheer ve bekijk alle geregistreerde klanten.</p>
        </div>
        <div className="bg-accent-oak/5 border border-accent-oak/10 px-6 py-2 rounded-2xl hidden md:block">
           <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-oak">Totaal Müşteri: {totalCount}</p>
        </div>
      </div>

      <UsersTable 
        initialUsers={JSON.parse(JSON.stringify(users))} 
        currentPage={page}
        totalPages={totalPages}
        currentSearch={search}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
