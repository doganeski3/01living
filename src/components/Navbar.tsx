'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsOpen: setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}/collecties`, label: t('collections') },
    { href: `/${locale}/showroom`, label: t('showroom') },
    { href: `/${locale}/over-ons`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const isDarkHeroPage = pathname === `/${locale}` || 
                         pathname === `/${locale}/collecties` || 
                         pathname === `/${locale}/showroom` || 
                         pathname === `/${locale}/over-ons` || 
                         pathname === `/${locale}/contact`;
  const isTransparentWhiteTheme = isDarkHeroPage && !isScrolled && !isMobileMenuOpen;
  const textColorClass = isTransparentWhiteTheme ? 'text-primary-ivory drop-shadow-md' : 'text-primary-anthracite';
  const logoColorClass = isTransparentWhiteTheme ? 'text-primary-ivory drop-shadow-md' : 'text-primary-anthracite';

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-primary-ivory shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className={`text-2xl font-heading font-semibold tracking-wider z-[110] transition-colors ${logoColorClass}`}>
            01 LIVING
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${textColorClass} hover:text-accent-oak transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className={`flex items-center space-x-4 md:space-x-6 ${textColorClass}`}>
            {/* Locale switcher */}
            <div className="hidden md:flex space-x-2 text-sm">
              <button onClick={() => changeLocale('nl')} className={`hover:text-accent-oak transition-colors ${pathname.startsWith('/nl') ? 'font-semibold' : ''}`}>NL</button>
              <span>/</span>
              <button onClick={() => changeLocale('en')} className={`hover:text-accent-oak transition-colors ${pathname.startsWith('/en') ? 'font-semibold' : ''}`}>EN</button>
            </div>

            {/* Account */}
            <Link 
              href={session ? `/${locale}/account` : `/${locale}/login`}
              className="hover:text-accent-oak transition-colors"
            >
              <User size={20} strokeWidth={1.5} className={textColorClass} />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-accent-oak transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} className={textColorClass} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-oak text-primary-ivory text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className={`md:hidden z-[110] ${isMobileMenuOpen ? 'text-primary-anthracite' : textColorClass}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 z-[90] bg-primary-anthracite flex flex-col items-center justify-center"
            >
            <nav className="flex flex-col items-center space-y-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl font-heading text-primary-ivory hover:text-accent-oak transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Language switcher in mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 flex space-x-4 text-primary-ivory/60 text-sm"
            >
              <button onClick={() => { changeLocale('nl'); setIsMobileMenuOpen(false); }} className={`hover:text-primary-ivory transition-colors ${pathname.startsWith('/nl') ? 'text-primary-ivory font-bold' : ''}`}>NL</button>
              <span>/</span>
              <button onClick={() => { changeLocale('en'); setIsMobileMenuOpen(false); }} className={`hover:text-primary-ivory transition-colors ${pathname.startsWith('/en') ? 'text-primary-ivory font-bold' : ''}`}>EN</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
