'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { 
  Zap, 
  Tv, 
  Box, 
  Armchair, 
  Building2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MessageSquare,
  ShieldCheck,
  Globe2,
  Clock,
  Layers
} from 'lucide-react';
import { submitCustomOrderRequest } from '@/app/actions/customOrder';

export default function CustomOrdersClient() {
  const t = useTranslations('CustomOrders');
  const locale = useLocale();
  const isEn = locale === 'en';

  const [selectedCategory, setSelectedCategory] = useState('mobility');
  const [formData, setFormData] = useState({
    category: 'mobility',
    productName: '',
    quantity: '1',
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const iconMap: Record<string, React.ReactNode> = {
    mobility: <Zap className="w-4 h-4 text-accent-oak" />,
    electronics: <Tv className="w-4 h-4 text-accent-oak" />,
    modular: <Box className="w-4 h-4 text-accent-oak" />,
    furniture: <Armchair className="w-4 h-4 text-accent-oak" />,
    project: <Building2 className="w-4 h-4 text-accent-oak" />,
    corporate: <Briefcase className="w-4 h-4 text-accent-oak" />,
    custom: <Sparkles className="w-4 h-4 text-accent-oak" />
  };

  const categories = [
    {
      id: 'mobility',
      number: '01',
      badge: t('categories.0.badge'),
      title: t('categories.0.title'),
      description: t('categories.0.description'),
      tags: isEn 
        ? ["E-Golf Carts", "Urban Mobility", "Lithium Battery Tech", "Custom Livery"]
        : ["E-Golfkarren", "Stedelijke Mobiliteit", "Lithium Accu's", "Custom Branding"],
      image: "/images/custom-orders/mobility.jpg",
      highlight: t('categories.0.highlight')
    },
    {
      id: 'electronics',
      number: '02',
      badge: t('categories.1.badge'),
      title: t('categories.1.title'),
      description: t('categories.1.description'),
      tags: isEn
        ? ["Smart Home", "High-End Audio/Visual", "Interactive Displays", "Custom Tech"]
        : ["Smart Home", "High-End Audio/Visueel", "Interactieve Displays", "Custom Tech"],
      image: "/images/custom-orders/electronics.jpg",
      highlight: t('categories.1.highlight')
    },
    {
      id: 'modular',
      number: '03',
      badge: t('categories.2.badge'),
      title: t('categories.2.title'),
      description: t('categories.2.description'),
      tags: isEn
        ? ["Modular Villas", "Luxury Container Suites", "Glamping Units", "Pop-up Showrooms"]
        : ["Modulaire Woningen", "Luxe Container Suites", "Glamping Units", "Pop-up Showrooms"],
      image: "/images/custom-orders/modular.jpg",
      highlight: t('categories.2.highlight')
    },
    {
      id: 'furniture',
      number: '04',
      badge: t('categories.3.badge'),
      title: t('categories.3.title'),
      description: t('categories.3.description'),
      tags: isEn
        ? ["Travertine Bespoke", "Luxury Upholstery", "Custom Dining Tables", "Architectural Wood"]
        : ["Travertin Maatwerk", "Luxe Bekleding", "Maatwerk Tafels", "Architecturaal Hout"],
      image: "/images/custom-orders/furniture.jpg",
      highlight: t('categories.3.highlight')
    },
    {
      id: 'project',
      number: '05',
      badge: t('categories.4.badge'),
      title: t('categories.4.title'),
      description: t('categories.4.description'),
      tags: isEn
        ? ["Hospitality & Hotels", "Luxury Villa Projects", "Turnkey Fit-Outs", "Material Curation"]
        : ["Hotel & Horeca", "Villa Projecten", "Turnkey Inrichting", "Materiaalselectie"],
      image: "/images/custom-orders/project.jpg",
      highlight: t('categories.4.highlight')
    },
    {
      id: 'corporate',
      number: '06',
      badge: t('categories.5.badge'),
      title: t('categories.5.title'),
      description: t('categories.5.description'),
      tags: isEn
        ? ["Volume Discounts", "Corporate Fit-Outs", "Dedicated Account Manager", "B2B Invoicing"]
        : ["Volumekorting", "Kantoorinrichting", "Dedicated Accountmanager", "Flexibele Facturatie"],
      image: "/images/custom-orders/corporate.jpg",
      highlight: t('categories.5.highlight')
    },
    {
      id: 'custom',
      number: '07',
      badge: t('categories.6.badge'),
      title: t('categories.6.title'),
      description: t('categories.6.description'),
      tags: isEn
        ? ["Global Sourcing", "Rare Materials", "Prototype Engineering", "Custom Solutions"]
        : ["Wereldwijde Sourcing", "Unieke Materialen", "Prototype Ontwikkeling", "Maatwerk Oplossingen"],
      image: "/images/custom-orders/custom.jpg",
      highlight: t('categories.6.highlight')
    }
  ];

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setFormData(prev => ({ ...prev, category: catId }));
    const formElement = document.getElementById('quote-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const targetCategoryObj = categories.find(c => c.id === formData.category);
    const categoryName = targetCategoryObj ? targetCategoryObj.title : formData.category;

    const res = await submitCustomOrderRequest({
      category: categoryName,
      productName: formData.productName,
      quantity: formData.quantity,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setFormData({
        category: 'mobility',
        productName: '',
        quantity: '1',
        fullName: '',
        email: '',
        phone: '',
        message: ''
      });
    } else {
      setErrorMessage(res.error || (isEn ? 'Something went wrong.' : 'Er is een fout opgetreden.'));
    }
  };

  return (
    <div className="bg-primary-ivory text-primary-anthracite selection:bg-accent-oak selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-primary-anthracite text-primary-ivory pt-28 pb-20">
        {/* Ambient subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent-oak/20 via-primary-anthracite/90 to-primary-anthracite z-0 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-oak/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-oak/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-oak/40 bg-accent-oak/10 text-accent-oak text-[11px] font-bold uppercase tracking-[0.25em] mb-8"
          >
            <Sparkles size={13} />
            <span>{t('badge')}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-heading font-medium tracking-tight uppercase leading-[1.1] mb-6 text-primary-ivory"
          >
            {t('title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-primary-ivory/80 font-sans leading-relaxed mb-10"
          >
            <p>{t('intro')}</p>
            <p className="text-primary-ivory/60 text-sm sm:text-base">{t('subIntro')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#quote-form-section"
              className="bg-accent-oak text-primary-ivory hover:bg-white hover:text-primary-anthracite transition-all px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] shadow-xl hover:shadow-2xl"
            >
              {t('heroCta')}
            </a>
            <a
              href="#categories-section"
              className="border border-white/30 text-primary-ivory hover:border-accent-oak hover:text-accent-oak transition-all px-8 py-4 text-xs font-bold uppercase tracking-[0.25em]"
            >
              {t('heroExplore')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section className="bg-primary-anthracite/95 border-t border-b border-white/10 py-6 text-primary-ivory">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('valueProps.bespoke')}</p>
              <p className="text-[11px] text-primary-ivory/60">{t('valueProps.bespokeSub')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe2 className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('valueProps.sourcing')}</p>
              <p className="text-[11px] text-primary-ivory/60">{t('valueProps.sourcingSub')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('valueProps.fastQuote')}</p>
              <p className="text-[11px] text-primary-ivory/60">{t('valueProps.fastQuoteSub')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('valueProps.b2b')}</p>
              <p className="text-[11px] text-primary-ivory/60">{t('valueProps.b2bSub')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 7 CATEGORIES SHOWCASE GRID */}
      <section id="categories-section" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-oak block mb-3">
            {t('portfolioBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-primary-anthracite">
            {t('categoriesTitle')}
          </h2>
          <div className="w-16 h-0.5 bg-accent-oak mx-auto mt-4 mb-6" />
          <p className="text-primary-anthracite/70 text-sm sm:text-base">
            {t('categoriesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-white border border-primary-anthracite/10 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-anthracite/5">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Subtle glass badge top left */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {iconMap[cat.id]}
                    <span>{cat.badge}</span>
                  </div>

                  {/* Number top right */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary-anthracite font-heading text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {cat.number}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-accent-oak shrink-0" />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-accent-oak font-semibold">
                        {cat.highlight}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading uppercase tracking-wide text-primary-anthracite mb-3 group-hover:text-accent-oak transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-sm text-primary-anthracite/75 font-sans leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Tags & Action */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[10px] uppercase tracking-wider font-semibold bg-[#F7F5F2] px-2.5 py-1 rounded text-primary-anthracite/70 border border-primary-anthracite/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className="w-full flex items-center justify-between border-t border-primary-anthracite/10 pt-4 text-xs uppercase tracking-[0.2em] font-bold text-primary-anthracite hover:text-accent-oak transition-colors group/btn"
                    >
                      <span>{t('requestForCategory')}</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. PROCESS SECTION */}
      <section className="bg-primary-anthracite text-primary-ivory py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-oak block mb-3">
              {t('process.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-primary-ivory">
              {t('process.title')}
            </h2>
            <div className="w-16 h-0.5 bg-accent-oak mx-auto mt-4 mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx}
                className="relative bg-white/5 border border-white/10 p-8 rounded-lg space-y-4 hover:border-accent-oak/50 transition-colors"
              >
                <div className="text-4xl font-heading font-bold text-accent-oak/80">
                  {t(`process.steps.${idx}.step`)}
                </div>
                <h3 className="text-lg font-heading uppercase tracking-wider text-white">
                  {t(`process.steps.${idx}.title`)}
                </h3>
                <p className="text-xs sm:text-sm text-primary-ivory/70 leading-relaxed">
                  {t(`process.steps.${idx}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE INQUIRY FORM SECTION ("Staat het door u gezochte product niet in de lijst?") */}
      <section id="quote-form-section" className="py-24 max-w-5xl mx-auto px-6">
        <div className="bg-white border border-primary-anthracite/15 rounded-xl shadow-2xl p-8 sm:p-12 md:p-16">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-accent-oak/10 text-accent-oak text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
              {t('bottomCTA.badge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading uppercase tracking-wide text-primary-anthracite mb-4">
              {t('bottomCTA.title')}
            </h2>
            <p className="text-primary-anthracite/75 text-sm sm:text-base leading-relaxed">
              {t('bottomCTA.description')}
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F7F5F2] border border-accent-oak/30 p-10 rounded-lg text-center space-y-6"
            >
              <div className="w-16 h-16 bg-accent-oak text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-heading uppercase tracking-wider text-primary-anthracite">
                {t('bottomCTA.successTitle')}
              </h3>
              <p className="text-primary-anthracite/80 max-w-md mx-auto text-sm sm:text-base">
                {t('bottomCTA.successDesc')}
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="bg-primary-anthracite text-white hover:bg-accent-oak transition-colors px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]"
              >
                {t('bottomCTA.sendAnother')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {t('bottomCTA.categoryLabel')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  >
                    <option value="mobility">{t('bottomCTA.categoryOptions.mobility')}</option>
                    <option value="electronics">{t('bottomCTA.categoryOptions.electronics')}</option>
                    <option value="modular">{t('bottomCTA.categoryOptions.modular')}</option>
                    <option value="furniture">{t('bottomCTA.categoryOptions.furniture')}</option>
                    <option value="project">{t('bottomCTA.categoryOptions.project')}</option>
                    <option value="corporate">{t('bottomCTA.categoryOptions.corporate')}</option>
                    <option value="custom">{t('bottomCTA.categoryOptions.custom')}</option>
                  </select>
                </div>

                {/* Desired Product Name / Concept */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {t('bottomCTA.productName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('bottomCTA.productNamePlaceholder')}
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {t('bottomCTA.quantity')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('bottomCTA.quantityPlaceholder')}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>

                {/* Full Name / Company Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {t('bottomCTA.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('bottomCTA.fullNamePlaceholder')}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {t('bottomCTA.email')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t('bottomCTA.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                  {t('bottomCTA.phone')}
                </label>
                <input
                  type="tel"
                  placeholder={t('bottomCTA.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                />
              </div>

              {/* Detailed Message / Specs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                  {t('bottomCTA.message')}
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={t('bottomCTA.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-anthracite text-white hover:bg-accent-oak transition-colors py-4 px-8 text-xs font-bold uppercase tracking-[0.25em] shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? t('bottomCTA.submitting') : t('bottomCTA.submitButton')}
              </button>
            </form>
          )}

          {/* Alternative Quick Contact Bar */}
          <div className="mt-12 pt-8 border-t border-primary-anthracite/10 flex flex-wrap items-center justify-between gap-6 text-xs uppercase tracking-wider font-bold text-primary-anthracite/70">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-accent-oak" />
              <span>{t('bottomCTA.emailButton')}</span>
            </div>
            
            <a 
              href="https://wa.me/31638230747?text=Hello,%20I%20have%20an%20inquiry%20regarding%20custom%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageSquare size={16} />
              <span>{t('bottomCTA.whatsappButton')}</span>
            </a>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-accent-oak" />
              <span>{t('bottomCTA.showroom')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
