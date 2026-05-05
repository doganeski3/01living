'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const openInMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <footer className="bg-primary-anthracite text-primary-ivory pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Description */}
          <div className="lg:col-span-3 space-y-8">
            <Link href={`/${locale}`} className="text-3xl font-heading font-semibold tracking-wider block">
              {t('brand')}
            </Link>
            <p className="text-primary-ivory/60 font-sans leading-relaxed text-sm italic font-serif">
              &quot;{t('description')}&quot;
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase mb-8 text-accent-oak">{t('quickLinks')}</h3>
            <ul className="space-y-4 text-primary-ivory/70 text-xs uppercase tracking-widest font-bold">
              <li>
                <Link href={`/${locale}/collecties`} className="hover:text-accent-oak transition-colors">
                  {t('collections')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/over-ons`} className="hover:text-accent-oak transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-accent-oak transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/showroom`} className="hover:text-accent-oak transition-colors">
                  Showroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase mb-8 text-accent-oak">{t('legal')}</h3>
            <ul className="space-y-4 text-primary-ivory/70 text-xs uppercase tracking-widest font-bold">
              <li>
                <Link href={`/${locale}/algemene-voorwaarden`} className="hover:text-accent-oak transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacybeleid`} className="hover:text-accent-oak transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/verzending-en-retour`} className="hover:text-accent-oak transition-colors">
                  {t('shipping')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookiebeleid`} className="hover:text-accent-oak transition-colors">
                  {t('cookies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Warehouse Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-accent-oak"></div>
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent-oak">{t('showroomTitle')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <p className="text-primary-ivory/70 text-sm leading-relaxed font-serif italic">
                  {t('showroomDesc')}
                </p>
                
                {/* Showroom Address */}
                <div 
                  onClick={() => openInMaps(t('showroomAddress'))}
                  className="flex items-start gap-5 group cursor-pointer"
                >
                   <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-accent-oak group-hover:bg-accent-oak group-hover:text-white transition-all duration-500">
                    <MapPin size={20} />
                   </div>
                   <div className="text-xs space-y-1 pt-2">
                      <p className="font-bold uppercase tracking-widest">Showroom</p>
                      <p className="text-primary-ivory/40 font-serif italic group-hover:text-accent-oak transition-colors">{t('showroomAddress')}</p>
                   </div>
                </div>

                {/* Warehouse Address */}
                <div 
                  onClick={() => openInMaps(t('warehouseAddress'))}
                  className="flex items-start gap-5 group cursor-pointer"
                >
                   <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-accent-oak group-hover:bg-accent-oak group-hover:text-white transition-all duration-500">
                    <MapPin size={20} />
                   </div>
                   <div className="text-xs space-y-1 pt-2">
                      <p className="font-bold uppercase tracking-widest">{t('warehouseTitle')}</p>
                      <p className="text-primary-ivory/40 font-serif italic group-hover:text-accent-oak transition-colors">{t('warehouseAddress')}</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <Link 
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center justify-between bg-white text-primary-anthracite px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-oak hover:text-white transition-all shadow-xl"
                >
                  {t('bookAppointment')}
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Socials & Copyright */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-primary-ivory/30 text-[9px] uppercase tracking-[0.2em] font-bold">
            {t('copyright')}
          </p>
          
          <div className="flex space-x-10 text-primary-ivory/40 text-[10px] font-bold tracking-[0.3em] uppercase">
            <a href="https://www.instagram.com/01livingg/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-oak transition-colors">Instagram</a>
            <a href="https://www.tiktok.com/@01livingg" target="_blank" rel="noopener noreferrer" className="hover:text-accent-oak transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
