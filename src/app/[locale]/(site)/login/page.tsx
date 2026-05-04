'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useTranslations, useLocale } from 'next-intl';

export default function Login() {
  const t = useTranslations('Auth.login');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('error'));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(t('unknownError'));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading text-primary-anthracite uppercase tracking-widest">{t('title')}</h1>
            <p className="text-primary-anthracite/50 text-sm">{t('subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('email')}</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                  placeholder="exemple@mail.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40">{t('password')}</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-accent-oak transition-colors" 
                  placeholder={t('passwordPlaceholder')}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-anthracite text-primary-ivory py-5 uppercase tracking-[0.3em] text-xs font-bold flex items-center justify-center gap-4 hover:bg-accent-oak transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>{t('submit')} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-primary-anthracite/50">
              {t('noAccount')}{' '}
              <Link href={`/${locale}/register`} className="text-accent-oak font-bold hover:underline">
                {t('registerLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
