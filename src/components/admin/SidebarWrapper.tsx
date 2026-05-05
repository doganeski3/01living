'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Menu,
  X,
  AlertCircle,
  Users,
  Tag
} from 'lucide-react';
import { useState } from 'react';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: `/${locale}/01admin-portal` },
    { label: 'Producten', icon: Package, href: `/${locale}/01admin-portal/products` },
    { label: 'Categorieën', icon: Tag, href: `/${locale}/01admin-portal/categories` },
    { label: 'Bestellingen', icon: ShoppingBag, href: `/${locale}/01admin-portal/orders` },
    { label: 'Gebruikers', icon: Users, href: `/${locale}/01admin-portal/users` },
    { label: 'In afwachting', icon: AlertCircle, href: `/${locale}/01admin-portal/abandoned` },
    { label: 'Instellingen', icon: Settings, href: `/${locale}/01admin-portal/settings` },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-anthracite text-primary-ivory fixed h-full shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <Link href={`/${locale}`} className="text-2xl font-heading tracking-widest text-primary-ivory">
            01 LIVING
            <span className="block text-[10px] uppercase tracking-[0.4em] opacity-50 mt-1">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active 
                    ? 'bg-accent-oak text-primary-ivory' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={active ? 'text-white' : 'text-white/40 group-hover:text-white'} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Terug naar site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary-anthracite p-4 flex items-center justify-between z-[60]">
        <Link href={`/${locale}`} className="text-xl font-heading tracking-widest text-primary-ivory">
          01 LIVING
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary-ivory"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-[55] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-primary-anthracite text-primary-ivory z-[60] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5">
           <span className="text-2xl font-heading tracking-widest text-primary-ivory">01 LIVING</span>
        </div>
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.href) ? 'bg-accent-oak' : 'text-white/60'}`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
