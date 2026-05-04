'use client';

import { deleteProduct } from '@/app/actions/products';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert(result.error);
        setLoading(false);
      } else {
        setIsModalOpen(false);
      }
    } catch (_error) {
      alert('Product silinirken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <>
      <DeleteConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Product Verwijderen"
        description="Weet u zeker dat u dit product wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt en het product zal direct uit de shop verdwijnen."
      />
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="p-2 text-primary-anthracite/20 hover:text-red-500 transition-colors disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </>
  );
}
