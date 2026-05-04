'use client';

import { useState } from 'react';
import { updateAddress } from '@/app/actions/auth';
import { Loader2, Save, MapPin, Phone, Globe, CheckCircle2, Building2 } from 'lucide-react';

interface User {
  id: string;
  street: string | null;
  houseNumber: string | null;
  addition: string | null;
  postalCode: string | null;
  city: string | null;
  phone: string | null;
  country: string | null;
  companyName: string | null;
  vatNumber: string | null;
}

import { useTranslations } from 'next-intl';

export default function AddressForm({ user }: { user: User }) {
  const t = useTranslations('Account');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateAddress(user.id, formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || t('error'));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-2">
            <MapPin size={14} /> {t('shippingAddress')}
          </h3>
          
          <div className="space-y-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-8 space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 group-focus-within:text-accent-oak transition-colors">{t('street')}</label>
                <input name="street" defaultValue={user.street || ''} required className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" />
              </div>
              <div className="col-span-6 sm:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('houseNumber')}</label>
                <input name="houseNumber" defaultValue={user.houseNumber || ''} required className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" />
              </div>
              <div className="col-span-6 sm:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('addition')}</label>
                <input name="addition" defaultValue={user.addition || ''} className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" placeholder="bis" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('postalCode')}</label>
                <input name="postalCode" defaultValue={user.postalCode || ''} required className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" placeholder="1234 AB" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('city')}</label>
                <input name="city" defaultValue={user.city || ''} required className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 flex items-center gap-2">
                <Globe size={12} /> {t('country')}
              </label>
              <input 
                type="text" 
                value="Nederland" 
                readOnly 
                className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none cursor-not-allowed opacity-60" 
              />
              <input type="hidden" name="country" value="Nederland" />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section className="space-y-10">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-2">
              <Building2 size={14} /> {t('billingDetails')}
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('companyName')}</label>
                <input name="companyName" defaultValue={user.companyName || ''} className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('vatNumber')}</label>
                <input name="vatNumber" defaultValue={user.vatNumber || ''} className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" placeholder="NL123456789B01" />
              </div>
            </div>
          </section>

          <section className="space-y-10 pt-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-2">
              <Phone size={14} /> {t('contactDetails')}
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('phone')}</label>
                <input name="phone" defaultValue={user.phone || ''} className="w-full bg-transparent border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-all" placeholder="+31 6 12345678" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="pt-12 border-t border-gray-50">
        <button 
          type="submit"
          disabled={loading}
          className={`relative overflow-hidden px-16 py-6 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center gap-4 transition-all min-w-[240px] shadow-2xl ${
            success ? 'bg-green-600 text-white' : 'bg-primary-anthracite text-white hover:bg-accent-oak'
          }`}
        >
          <span className="flex items-center gap-4">
            {loading ? <Loader2 className="animate-spin" size={16} /> : success ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {loading ? t('processing') : success ? t('saved') : t('saveSettings')}
          </span>
        </button>
      </div>
    </form>
  );
}
