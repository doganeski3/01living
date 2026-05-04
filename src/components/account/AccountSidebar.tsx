'use client';

import { ShoppingBag, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import { useLocale, useTranslations } from "next-intl";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export default function AccountSidebar({ user }: { user: User }) {
  const t = useTranslations('Account');
  const pathname = usePathname();
  const locale = useLocale();

  const links = [
    { href: `/${locale}/account`, label: t('sidebar.orders'), icon: ShoppingBag },
    { href: `/${locale}/account/address`, label: t('sidebar.address'), icon: MapPin },
    { href: `/${locale}/account/profile`, label: t('sidebar.profile'), icon: UserIcon },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-primary-anthracite uppercase tracking-widest">{t('myAccount')}</h1>
        <p className="text-sm text-primary-anthracite/50 truncate font-serif italic">{t('welcome', { name: user.name || 'User' })}</p>
      </div>

      <nav className="flex flex-col space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-white shadow-sm font-bold text-primary-anthracite border border-gray-100' 
                : 'text-primary-anthracite/40 hover:text-primary-anthracite font-bold hover:bg-white/50'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-accent-oak' : ''} /> {link.label}
            </Link>
          );
        })}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
