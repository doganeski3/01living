'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/actions/auth';
import { Loader2, Save, ShieldCheck } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

import { useLocale, useTranslations } from 'next-intl';

export default function ProfileForm({ user }: { user: User }) {
  const locale = useLocale();
  const t = useTranslations('Account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(user.id, formData);

    if (result.success) {
      setMessage(t('success'));
    } else {
      setMessage(result.error || t('error'));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-xl">
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message === t('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
         <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak">{t('personalInfo')}</h3>
         <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('name')}</label>
              <input 
                name="name" 
                defaultValue={user.name || ''} 
                required 
                className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('email')}</label>
              <input 
                name="email" 
                type="email"
                defaultValue={user.email || ''} 
                readOnly
                className="w-full bg-gray-100/50 border-b border-gray-200 py-4 text-sm focus:outline-none cursor-not-allowed opacity-60" 
              />
              <p className="text-[8px] text-primary-anthracite/30 uppercase tracking-widest mt-1">
                {locale === 'nl' ? 'E-mailadres kan niet worden gewijzigd.' : 'Email address cannot be changed.'}
              </p>
            </div>
         </div>
      </div>

      <div className="space-y-8 pt-6 border-t border-gray-50">
         <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-2">
           <ShieldCheck size={14} /> {t('security')}
         </h3>
         <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('currentPassword')}</label>
              <input 
                name="currentPassword" 
                type="password"
                className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('newPassword')}</label>
              <input 
                name="newPassword" 
                type="password"
                className="w-full bg-gray-50/50 border-b border-gray-100 py-4 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                placeholder={t('leaveBlank')}
              />
            </div>
         </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="bg-primary-anthracite text-primary-ivory px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center gap-4 hover:bg-accent-oak transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Save size={16} /> {t('updateProfile')}</>}
      </button>
    </form>
  );
}
