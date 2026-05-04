'use client';

import { useState } from 'react';
import { updateSettings } from '@/app/actions/settings';
import { Package, Loader2 } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Instellingen succesvol bijgewerkt!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Er is een fout opgetreden.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      {message && (
        <div className={`p-6 rounded-2xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500 ${
          message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* General Settings */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-3">
            <Package size={16} /> Algemene Informatie
          </h3>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Winkelnaam</label>
              <input 
                name="siteName" 
                defaultValue={initialSettings?.siteName || '01 Living'}
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 flex items-center gap-2">
                <Package size={12} /> Contact E-mail
              </label>
              <input 
                name="contactEmail" 
                type="email"
                defaultValue={initialSettings?.contactEmail || 'info@01living.nl'}
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 flex items-center gap-2">
                <Package size={12} /> Telefoonnummer
              </label>
              <input 
                name="contactPhone" 
                defaultValue={initialSettings?.contactPhone || '+31 00 000 00 00'}
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 flex items-center gap-2">
                <Package size={12} /> Adres
              </label>
              <textarea 
                name="address" 
                defaultValue={initialSettings?.address || 'Amsterdam, Nederland'}
                rows={3}
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all resize-none" 
              />
            </div>
          </div>
        </section>

        {/* Shipping & Financials */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-3">
            <Package size={16} /> Verzending & BTW
          </h3>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Standaard Verzending (€)</label>
                <input 
                  name="shippingFee" 
                  type="number"
                  step="0.01"
                  defaultValue={initialSettings?.shippingFee || 0}
                  className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">Gratis vanaf (€)</label>
                <input 
                  name="freeShippingThreshold" 
                  type="number"
                  step="0.01"
                  defaultValue={initialSettings?.freeShippingThreshold || 0}
                  className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 flex items-center gap-2">
                <Package size={12} /> BTW Percentage (%)
              </label>
              <input 
                name="vatRate" 
                type="number"
                defaultValue={initialSettings?.vatRate || 21}
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-xl text-sm focus:ring-1 focus:ring-accent-oak/20 transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak flex items-center gap-3">
              <Package size={16} /> Social Media
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={18} />
                </div>
                <input 
                  name="instagramUrl" 
                  placeholder="https://instagram.com/..."
                  defaultValue={initialSettings?.instagramUrl || ''}
                  className="w-full bg-gray-50 border-none py-3 px-6 rounded-xl text-xs focus:ring-1 focus:ring-accent-oak/20 transition-all" 
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={18} />
                </div>
                <input 
                  name="facebookUrl" 
                  placeholder="https://facebook.com/..."
                  defaultValue={initialSettings?.facebookUrl || ''}
                  className="w-full bg-gray-50 border-none py-3 px-6 rounded-xl text-xs focus:ring-1 focus:ring-accent-oak/20 transition-all" 
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={loading}
          className="bg-primary-anthracite text-primary-ivory px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center gap-4 hover:bg-accent-oak transition-all shadow-2xl rounded-2xl group disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Package size={18} />}
          Instellingen Opslaan
        </button>
      </div>
    </form>
  );
}
