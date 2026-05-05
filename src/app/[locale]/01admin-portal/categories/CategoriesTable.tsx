'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
  Plus, Edit2, Trash2, X, Save, Upload, Loader2, GripVertical, 
  Search, ExternalLink, Image as ImageIcon 
} from 'lucide-react';
import Image from 'next/image';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';

interface Category {
  id: string;
  nameNl: string;
  nameEn: string;
  slug: string;
  image: string | null;
  order: number;
}

interface CategoriesTableProps {
  initialCategories: Category[];
}

export default function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setPreview(category?.image || null);
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setPreview(null);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (file) formData.append('image', file);
    if (editingCategory?.image) formData.append('existingImage', editingCategory.image);

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success) {
        // Refresh local state or revalidate
        window.location.reload(); 
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Er is bir fout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) return;
    
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Fout bij verwijderen.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => openModal()}
          className="bg-white text-primary-anthracite px-6 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-accent-oak transition-all"
        >
          <Plus size={16} /> Categorie Toevoegen
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-6 px-8 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 w-24 text-center">Volgorde</th>
              <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 w-32">Afbeelding</th>
              <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Naam (NL/EN)</th>
              <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Slug</th>
              <th className="py-6 px-8 text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-6 px-8 text-center font-mono text-sm text-primary-anthracite/40">
                  {cat.order}
                </td>
                <td className="py-6 px-4">
                  <div className="relative w-16 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.nameNl} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-6 px-4">
                  <div className="space-y-1">
                    <p className="font-bold text-primary-anthracite">{cat.nameNl}</p>
                    <p className="text-xs text-primary-anthracite/40 uppercase tracking-widest font-medium">{cat.nameEn}</p>
                  </div>
                </td>
                <td className="py-6 px-4 font-mono text-xs text-primary-anthracite/40">
                  {cat.slug}
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openModal(cat)}
                      className="p-3 text-primary-anthracite/40 hover:text-accent-oak hover:bg-accent-oak/5 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-3 text-primary-anthracite/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-primary-anthracite/20">
                    <Search size={48} strokeWidth={1} />
                    <p className="text-xs uppercase tracking-widest font-bold">Nog geen categorieën</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-primary-anthracite/40 backdrop-blur-md" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-heading uppercase tracking-widest">
                {editingCategory ? 'Categorie Bewerken' : 'Nieuwe Categorie'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Naam (NL)</label>
                  <input name="nameNl" defaultValue={editingCategory?.nameNl} required className="w-full bg-gray-50 border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Name (EN)</label>
                  <input name="nameEn" defaultValue={editingCategory?.nameEn} required className="w-full bg-gray-50 border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Slug (URL)</label>
                  <input name="slug" defaultValue={editingCategory?.slug} required className="w-full bg-gray-50 border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" placeholder="bijv. banken" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Volgorde</label>
                  <input name="order" type="number" defaultValue={editingCategory?.order || 0} required className="w-full bg-gray-50 border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Categorie Afbeelding</label>
                <div className="flex items-start gap-8">
                  <div className="relative w-32 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-dashed border-gray-200 flex items-center justify-center group cursor-pointer">
                    {preview ? (
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-200" />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload className="text-white" size={24} />
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-primary-anthracite/60 font-medium italic">Kies bir sfeervolle afbeelding die de collectie vertegenwoordigt.</p>
                    <p className="text-[10px] text-primary-anthracite/40 uppercase tracking-widest">Aanbevolen verhouding: 3:4 (Portrait)</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-primary-anthracite text-white py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-accent-oak transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  Opslaan
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-8 py-5 text-primary-anthracite/40 hover:text-primary-anthracite font-bold text-[11px] uppercase tracking-widest transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
