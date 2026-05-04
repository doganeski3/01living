'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, User as UserIcon, Mail, Calendar, ChevronLeft, ChevronRight, Shield, Eye, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { deleteUser } from '@/app/actions/users';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface Props {
  initialUsers: any[];
  currentPage: number;
  totalPages: number;
  currentSearch: string;
  currentUserId?: string;
}

export default function UsersTable({ initialUsers, currentPage, totalPages, currentSearch, currentUserId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const updateParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    if (!newParams.page) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchTerm, page: 1 });
  };

  const openDeleteModal = (id: string) => {
    setTargetId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!targetId) return;

    setDeletingId(targetId);
    try {
      const result = await deleteUser(targetId);
      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Kullanıcı silinirken bir hata oluştu.');
    } finally {
      setDeletingId(null);
      setTargetId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        loading={deletingId !== null}
        title="Gebruiker Verwijderen"
        description="Weet u zeker dat u deze gebruiker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
      />

      {/* Search Bar */}
      <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-anthracite/20 group-focus-within:text-accent-oak transition-colors" size={16} />
           <input 
             type="text" 
             placeholder="Zoek op naam of e-mail..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-primary-ivory/50 border-none py-2.5 pl-12 pr-6 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent-oak/20 transition-all placeholder:text-primary-anthracite/20"
           />
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/30 font-bold">
                <th className="px-6 py-4">Klant</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Geregistreerd</th>
                <th className="px-6 py-4 text-right">Status / Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-primary-ivory/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 bg-accent-oak/5 rounded-full flex items-center justify-center text-accent-oak shadow-sm">
                          <UserIcon size={16} />
                       </div>
                       <div>
                          <p className="font-bold text-xs text-primary-anthracite">{user.name || 'Onbekend'}</p>
                          <p className="text-[9px] text-primary-anthracite/40 uppercase tracking-widest font-bold">ID: {user.id.slice(-6)}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] text-primary-anthracite/60">
                         <Mail size={12} className="text-accent-oak" />
                         <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <p className="text-[10px] text-primary-anthracite/40 ml-5">{user.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Shield size={12} className={user.role === 'ADMIN' ? 'text-accent-oak' : 'text-gray-300'} />
                       <span className={`text-[10px] font-bold tracking-widest uppercase ${user.role === 'ADMIN' ? 'text-accent-oak' : 'text-primary-anthracite/40'}`}>
                         {user.role}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] text-primary-anthracite/40">
                      <Calendar size={12} />
                      <span>{new Date(user.createdAt).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link 
                         href={`/${locale}/01admin-portal/users/${user.id}`}
                         className="p-2 bg-white text-primary-anthracite border border-gray-100 rounded-lg hover:bg-primary-anthracite hover:text-white transition-all shadow-sm"
                         title="Bekijken"
                       >
                         <Eye size={14} />
                       </Link>
                       {user.id !== currentUserId ? (
                         <button 
                           onClick={() => openDeleteModal(user.id)}
                           disabled={deletingId === user.id}
                           className="p-2 bg-white text-red-500 border border-gray-100 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                           title="Verwijderen"
                         >
                           {deletingId === user.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                         </button>
                       ) : (
                         <span className="text-[8px] uppercase tracking-widest font-bold bg-accent-oak text-white px-3 py-1.5 rounded-lg shadow-sm">
                           Jij
                         </span>
                       )}
                    </div>
                  </td>
                </tr>
              ))}

              {initialUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[9px] font-bold text-primary-anthracite/30 uppercase tracking-widest">
                    Geen gebruikers gevonden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">
            Pagina {currentPage} van {totalPages || 1}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateParams({ page: currentPage - 1 })}
              disabled={currentPage <= 1}
              className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-primary-anthracite hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => updateParams({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages}
              className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-primary-anthracite hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
