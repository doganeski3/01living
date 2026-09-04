'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Boxes,
  Briefcase,
  Sparkles,
  ShoppingCart,
  MapPin,
  Smartphone,
  Mail,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Warehouse,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLocale } from 'next-intl';
import { b2bLogisticsTranslations, LocaleKey } from '@/locales/b2b-logistics';
import { submitB2BLeadRequest } from '@/app/actions/b2bLead';

const COUNTRY_CODES = [
  { code: '+31', label: 'NL (+31)' },
  { code: '+90', label: 'TR (+90)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+32', label: 'BE (+32)' },
  { code: '+33', label: 'FR (+33)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+1', label: 'US (+1)' },
];

export default function B2BFulfillmentPage() {
  const currentLocale = useLocale();
  const [locale, setLocale] = useState<LocaleKey>(currentLocale === 'en' ? 'en' : 'nl');

  React.useEffect(() => {
    setLocale(currentLocale === 'en' ? 'en' : 'nl');
  }, [currentLocale]);

  const t = b2bLogisticsTranslations[locale];

  // Form State
  const [countryCode, setCountryCode] = useState('+31');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['storage', 'fulfillment']);
  const [monthlyVolume, setMonthlyVolume] = useState('11-50');
  const [message, setMessage] = useState('');

  // Form Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleServiceToggle = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !companyName.trim() || !email.trim()) {
      setErrorMessage(
        locale === 'en'
          ? 'Please fill in your name, company name, and corporate email.'
          : 'Vul alstublieft uw naam, bedrijfsnaam en zakelijk e-mailadres in.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = phoneNumber.trim() ? `${countryCode} ${phoneNumber.trim()}` : '';
      const res = await submitB2BLeadRequest({
        fullName,
        companyName,
        email,
        phone: fullPhone,
        services: selectedServices,
        volume: monthlyVolume,
        message,
        locale,
      });

      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setErrorMessage(res.error || t.leadForm.errorMessage);
      }
    } catch (err: any) {
      setErrorMessage(t.leadForm.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPhoneNumber('');
    setMessage('');
    setSelectedServices(['storage', 'fulfillment']);
    setMonthlyVolume('11-50');
    setSubmitSuccess(false);
    setErrorMessage(null);
  };

  const openingHours = [
    { day: locale === 'en' ? 'Monday' : 'Maandag', hours: '09:00 - 18:00' },
    { day: locale === 'en' ? 'Tuesday' : 'Dinsdag', hours: '09:00 - 18:00' },
    { day: locale === 'en' ? 'Wednesday' : 'Woensdag', hours: '09:00 - 18:00' },
    { day: locale === 'en' ? 'Thursday' : 'Donderdag', hours: '09:00 - 18:00' },
    { day: locale === 'en' ? 'Friday' : 'Vrijdag', hours: '09:00 - 18:00' },
    { day: locale === 'en' ? 'Saturday' : 'Zaterdag', hours: '10:00 - 16:00' },
    { day: locale === 'en' ? 'Sunday' : 'Zondag', hours: locale === 'en' ? 'Closed' : 'Gesloten' },
  ];

  const whatsappMessage = encodeURIComponent(
    locale === 'en'
      ? `Hello 01 Living team, I am inquiring about European B2B Warehousing, Fulfillment & Sales Representation for my brand.`
      : `Hallo 01 Living team, ik wil graag informatie ontvangen over Europese B2B Warehousing, Fulfillment & Commerciële Vertegenwoordiging.`
  );

  return (
    <main className="min-h-screen bg-primary-ivory text-primary-anthracite selection:bg-accent-oak selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION (Refined Scale & Mobile Optimized Proportions) */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/b2b-warehouse-hero.jpg"
            alt="01 Living European Logistics Hub"
            fill
            className="object-cover brightness-[0.40] scale-105"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Accent Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-2 sm:gap-3.5 mb-4 sm:mb-6"
          >
            <div className="h-px w-5 sm:w-8 bg-accent-oak shrink-0"></div>
            <p className="text-accent-oak uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold leading-normal text-center">
              {t.hero.badge}
            </p>
            <div className="h-px w-5 sm:w-8 bg-accent-oak shrink-0"></div>
          </motion.div>

          {/* Majestic Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[64px] font-heading text-white uppercase tracking-normal sm:tracking-wider leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 max-w-5xl mx-auto"
          >
            {t.hero.titleStart}
            <span className="italic font-serif normal-case tracking-normal text-primary-ivory/95 block mt-2 sm:mt-2.5 text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug">
              {t.hero.titleHighlight} {t.hero.titleEnd}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 text-xs sm:text-sm md:text-base lg:text-lg font-serif italic max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5 w-full max-w-md sm:max-w-none mx-auto"
          >
            <a
              href="#quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-5 bg-white text-primary-anthracite px-6 sm:px-9 py-3.5 sm:py-5 text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-accent-oak hover:text-white transition-all shadow-xl group text-center whitespace-nowrap"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>
            <a
              href="#pipeline"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 bg-transparent border border-white/35 text-white px-6 sm:px-8 py-3.5 sm:py-5 text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-white/10 transition-all text-center whitespace-nowrap"
            >
              <span>{t.hero.secondaryCta}</span>
            </a>
          </motion.div>
        </div>

        {/* Scroll Line Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-white/40 text-[8px] uppercase tracking-[0.35em] font-bold rotate-90 origin-left mb-8">
            {locale === 'en' ? 'Discover' : 'Ontdek'}
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. STATS BAR (Compact, Elegant Mobile Proportions) */}
      <section className="bg-white py-8 sm:py-12 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
          {Object.entries(t.hero.stats).map(([key, item]) => (
            <div key={key} className="space-y-1 text-left">
              <span className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary-anthracite block tracking-tight">
                {item.value}
              </span>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] font-bold text-accent-oak">
                {item.label}
              </p>
              <p className="text-[11px] sm:text-xs text-primary-anthracite/60 font-serif italic leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTRO & OPERATIONS HUB SECTION (Refined Mobile & Desktop Grid) */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-2 sm:space-y-4"
              >
                <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                  {locale === 'en' ? 'Netherlands Operations Hub' : 'Nederlands Operatiecentrum'}
                </h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {locale === 'en' ? 'The Hague 1,600 m²' : 'Den Haag 1.600 m²'} <br />
                  <span className="italic font-serif normal-case text-primary-anthracite/80 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    {locale === 'en' ? 'Logistics Center' : 'Logistiek Centrum'}
                  </span>
                </h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-primary-anthracite/70 font-serif italic leading-relaxed text-xs sm:text-sm md:text-base space-y-2.5 sm:space-y-3"
              >
                <p>
                  {locale === 'en'
                    ? 'Operating from our strategic location in The Hague since 2021, 01 Living B.V. bridges international manufacturers with Western Europe. With 1,600 m² of modern high-rack storage, on-site heavy material handling, and native Benelux commercial teams, we manage your complete European footprint.'
                    : 'Vanuit onze strategische locatie in Den Haag sinds 2021 slaat 01 Living B.V. een directe brug tussen internationale fabrikanten en West-Europa. Met 1.600 m² moderne hoogbouwopslag, zware hefapparatuur en een lokaal commercieel verkoopteam beheren wij uw complete Europese operatie.'}
                </p>
                <p>
                  {locale === 'en'
                    ? 'No Dutch BV formation expenses, no long-term warehouse leases, and no foreign payroll liabilities. An immediate, turnkey infrastructure aligned with your commercial growth.'
                    : 'Geen oprichtingskosten voor een Nederlandse BV, geen langlopende huurcontracten en geen salarisverplichtingen. Een directe, turn-key infrastructuur die meegroeit met uw omzet.'}
                </p>
              </motion.div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1 sm:pt-2">
                <div className="flex gap-3 group">
                  <div className="text-accent-oak group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <Warehouse size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary-anthracite">
                      {locale === 'en' ? '1,600 m² High-Rack Hub' : '1.600 m² Hoogbouw Hub'}
                    </h4>
                    <p className="text-[11px] text-primary-anthracite/60 leading-relaxed font-serif italic">
                      {locale === 'en' ? 'Pallet & carton storage' : 'Pallet- en doosopslag'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 group">
                  <div className="text-accent-oak group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary-anthracite">
                      {locale === 'en' ? 'Physical Showroom' : 'Fysieke Showroom'}
                    </h4>
                    <p className="text-[11px] text-primary-anthracite/60 leading-relaxed font-serif italic">
                      {locale === 'en' ? 'Architectural sample displays' : 'Monster- en presentatieruimte'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 group">
                  <div className="text-accent-oak group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary-anthracite">
                      {locale === 'en' ? 'Bol.com & EU Marketplaces' : 'Bol.com & EU Marktplaatsen'}
                    </h4>
                    <p className="text-[11px] text-primary-anthracite/60 leading-relaxed font-serif italic">
                      {locale === 'en' ? 'Automated integration' : 'Geautomatiseerd beheer'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 group">
                  <div className="text-accent-oak group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <Briefcase size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary-anthracite">
                      {locale === 'en' ? 'B2B Commercial Team' : 'B2B Commercieel Team'}
                    </h4>
                    <p className="text-[11px] text-primary-anthracite/60 leading-relaxed font-serif italic">
                      {locale === 'en' ? 'Dutch & English negotiators' : 'Lokale vertegenwoordigers'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Resolution Operations Center Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-gray-100 bg-neutral-900 group"
            >
              <Image
                src="/images/b2b-operations-hub.jpg"
                alt={locale === 'en' ? '01 Living The Hague Operations Hub' : '01 Living Den Haag Operatiecentrum'}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-primary-anthracite/80 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-white text-xs z-10">
                <div className="bg-primary-anthracite/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[8px] sm:text-[9px] tracking-wider uppercase font-bold flex items-center gap-1.5 sm:gap-2 border border-white/10 shadow-sm">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{locale === 'en' ? 'The Hague Hub • Active Dispatch' : 'Den Haag Hub • Actieve Operatie'}</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-primary-anthracite/90 backdrop-blur-md p-3 sm:p-3.5 rounded-sm border border-white/10 text-white z-10">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-accent-oak">
                    {locale === 'en' ? 'De Werf 15 & 10 • The Hague' : 'De Werf 15 & 10 • Den Haag'}
                  </p>
                  <span className="text-[8px] uppercase tracking-wider text-white/60 font-mono">
                    1.600 m²
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-serif italic text-white/85 mt-1">
                  {locale === 'en'
                    ? 'High-rack storage, mezzanine offices & automated fulfillment'
                    : 'Hoogbouwopslag, commercieel kantoor & orderverwerking'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. THE PROCESS SECTION (Proportionate Cards) */}
      <section id="pipeline" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-primary-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
              {t.pipeline.badge}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-wider">
              {t.pipeline.title}
            </h3>
            <p className="text-primary-anthracite/60 text-xs sm:text-sm md:text-base font-serif italic max-w-xl mx-auto leading-relaxed">
              {t.pipeline.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.pipeline.steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 sm:p-7 rounded-sm shadow-sm hover:shadow-lg transition-all duration-500 group border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl sm:text-4xl font-heading text-accent-oak/25 group-hover:text-accent-oak/50 transition-colors block mb-3 sm:mb-4">
                    {item.number}
                  </span>
                  <div className="text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-accent-oak mb-1 sm:mb-1.5">
                    {item.badge}
                  </div>
                  <h4 className="text-sm sm:text-base font-heading text-primary-anthracite mb-2 sm:mb-3 uppercase tracking-wider leading-snug">
                    {item.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  <p className="text-primary-anthracite/60 text-xs leading-relaxed font-serif italic mb-4 sm:mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 pt-3 sm:pt-3.5">
                  {item.highlights.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-[11px] text-primary-anthracite/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-oak mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DETAILED SERVICES (Balanced Editorial Split-Screen) */}

      {/* Service 1 */}
      <section id="services" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden shadow-xl"
            >
              <Image
                src="/images/b2b-warehouse-hero.jpg"
                alt={t.services.items[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </motion.div>

            <div className="space-y-4 sm:space-y-6 lg:pl-6">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                  {t.services.items[0].badge}
                </h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t.services.items[0].title}
                </h3>
              </div>

              <p className="text-primary-anthracite/70 text-xs sm:text-sm md:text-base leading-relaxed font-serif italic">
                {t.services.items[0].description}
              </p>

              <div className="space-y-2 pt-1">
                {t.services.items[0].specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs md:text-sm text-primary-anthracite/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-oak shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 sm:pt-3">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite group"
                >
                  <span>{locale === 'en' ? 'Check Storage Capacity' : 'Capaciteit Aanvragen'}</span>
                  <div className="w-8 sm:w-10 h-px bg-primary-anthracite transition-all group-hover:w-16"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2 */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-primary-ivory overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6 lg:pr-6 order-2 lg:order-1">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                  {t.services.items[1].badge}
                </h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t.services.items[1].title}
                </h3>
              </div>

              <p className="text-primary-anthracite/70 text-xs sm:text-sm md:text-base leading-relaxed font-serif italic">
                {t.services.items[1].description}
              </p>

              <div className="space-y-2 pt-1">
                {t.services.items[1].specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs md:text-sm text-primary-anthracite/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-oak shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 sm:pt-3">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite group"
                >
                  <span>{locale === 'en' ? 'Expand Into Europe' : 'Start B2B Vertegenwoordiging'}</span>
                  <div className="w-8 sm:w-10 h-px bg-primary-anthracite transition-all group-hover:w-16"></div>
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden shadow-xl order-1 lg:order-2"
            >
              <Image
                src="/images/b2b-sales-rep.jpg"
                alt={t.services.items[1].title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service 3 */}
      <section id="showroom" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden shadow-xl"
            >
              <Image
                src="/images/showroom_materials_v3.png"
                alt={t.services.items[2].title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </motion.div>

            <div className="space-y-4 sm:space-y-6 lg:pl-6">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                  {t.services.items[2].badge}
                </h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t.services.items[2].title}
                </h3>
              </div>

              <p className="text-primary-anthracite/70 text-xs sm:text-sm md:text-base leading-relaxed font-serif italic">
                {t.services.items[2].description}
              </p>

              <div className="space-y-2 pt-1">
                {t.services.items[2].specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs md:text-sm text-primary-anthracite/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-oak shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 sm:pt-3">
                <Link
                  href={`/${locale}/showroom`}
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite group"
                >
                  <span>{locale === 'en' ? 'Visit Showroom Details' : 'Ontdek Onze Showroom'}</span>
                  <div className="w-8 sm:w-10 h-px bg-primary-anthracite transition-all group-hover:w-16"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 4 */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-primary-ivory overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6 lg:pr-6 order-2 lg:order-1">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                  {t.services.items[3].badge}
                </h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t.services.items[3].title}
                </h3>
              </div>

              <p className="text-primary-anthracite/70 text-xs sm:text-sm md:text-base leading-relaxed font-serif italic">
                {t.services.items[3].description}
              </p>

              <div className="space-y-2 pt-1">
                {t.services.items[3].specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs md:text-sm text-primary-anthracite/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-oak shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 sm:pt-3">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite group"
                >
                  <span>{locale === 'en' ? 'Automate Bol.com Operations' : 'Koppel Bol.com Verkoop'}</span>
                  <div className="w-8 sm:w-10 h-px bg-primary-anthracite transition-all group-hover:w-16"></div>
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden shadow-xl order-1 lg:order-2"
            >
              <Image
                src="/images/b2b-fulfillment-pack.jpg"
                alt={t.services.items[3].title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. BUSINESS MODEL COMPARISON */}
      <section id="advantages" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
              {t.comparison.badge}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-wider">
              {t.comparison.title}
            </h3>
            <p className="text-primary-anthracite/60 text-xs sm:text-sm md:text-base font-serif italic max-w-xl mx-auto leading-relaxed">
              {t.comparison.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Traditional */}
            <div className="bg-primary-ivory p-5 sm:p-8 md:p-10 rounded-sm border border-gray-200 flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-red-500/80 bg-red-50 px-2.5 py-1 rounded-sm inline-block">
                  {locale === 'en' ? 'Traditional Model' : 'Traditioneel Model'}
                </span>
                <h4 className="text-lg sm:text-xl font-heading text-primary-anthracite uppercase tracking-wider">
                  {t.comparison.traditionalTitle}
                </h4>
                <p className="text-xs font-serif italic text-primary-anthracite/60">
                  {t.comparison.traditionalSubtitle}
                </p>

                <div className="space-y-2.5 sm:space-y-3 pt-3 border-t border-gray-200">
                  {t.comparison.traditionalPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✕
                      </div>
                      <span className="text-xs sm:text-sm text-primary-anthracite/70 font-serif italic leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-white border border-gray-200 text-center text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-primary-anthracite/50">
                {locale === 'en' ? 'Estimated Year 1 Fixed Overhead: €150,000+' : 'Geschat Vast Startkapitaal: €150.000+'}
              </div>
            </div>

            {/* 01 Living */}
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-sm border-2 border-accent-oak shadow-xl flex flex-col justify-between space-y-5 sm:space-y-6 relative">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-white bg-accent-oak px-2.5 py-1 rounded-sm shadow-sm">
                    {t.comparison.zeroOneBadge}
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-accent-oak">
                    01 LIVING B.V.
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-heading text-primary-anthracite uppercase tracking-wider">
                  {t.comparison.zeroOneTitle}
                </h4>
                <p className="text-xs font-serif italic text-primary-anthracite/70">
                  {t.comparison.zeroOneSubtitle}
                </p>

                <div className="space-y-2.5 sm:space-y-3 pt-3 border-t border-accent-oak/20">
                  {t.comparison.zeroOnePoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-4 h-4 rounded-full bg-accent-oak text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm text-primary-anthracite font-serif italic leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-primary-ivory border-l-4 border-accent-oak text-primary-anthracite text-xs sm:text-sm font-serif italic">
                ★ {t.comparison.summaryNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE B2B PROPOSAL FORM (Architectural Compact Form) */}
      <section id="quote" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-primary-ivory border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
            <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
              {t.leadForm.badge}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-wider">
              {t.leadForm.title}
            </h3>
            <p className="text-primary-anthracite/60 text-xs sm:text-sm font-serif italic max-w-lg mx-auto leading-relaxed">
              {t.leadForm.subtitle}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-8 md:p-12 rounded-sm shadow-lg border border-gray-100">
            {submitSuccess ? (
              <div className="text-center py-8 sm:py-10 space-y-5 sm:space-y-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-oak/20 text-accent-oak flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-heading text-primary-anthracite uppercase tracking-wider">
                    {t.leadForm.successTitle}
                  </h4>
                  <p className="text-primary-anthracite/70 text-xs sm:text-sm font-serif italic max-w-md mx-auto leading-relaxed">
                    {t.leadForm.successMessage}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite group py-3"
                  >
                    <span>{t.leadForm.resetButton}</span>
                    <div className="w-6 h-px bg-primary-anthracite group-hover:w-12 transition-all"></div>
                  </button>
                  <a
                    href={`https://wa.me/31638230747?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-accent-oak text-white px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold hover:bg-primary-anthracite transition-all shadow-md text-center"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Direct</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-serif italic">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                      {t.leadForm.labels.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder={t.leadForm.placeholders.fullName}
                      className="w-full bg-primary-ivory/50 border border-gray-200 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-primary-anthracite placeholder-primary-anthracite/30 focus:outline-none focus:border-accent-oak transition-colors rounded-sm"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                      {t.leadForm.labels.companyName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder={t.leadForm.placeholders.companyName}
                      className="w-full bg-primary-ivory/50 border border-gray-200 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-primary-anthracite placeholder-primary-anthracite/30 focus:outline-none focus:border-accent-oak transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Email */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                      {t.leadForm.labels.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t.leadForm.placeholders.email}
                      className="w-full bg-primary-ivory/50 border border-gray-200 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-primary-anthracite placeholder-primary-anthracite/30 focus:outline-none focus:border-accent-oak transition-colors rounded-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                      {t.leadForm.labels.phone}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="bg-primary-ivory/50 border border-gray-200 px-2 sm:px-2.5 py-2.5 sm:py-3 text-xs font-bold text-primary-anthracite focus:outline-none focus:border-accent-oak rounded-sm cursor-pointer shrink-0"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder={t.leadForm.placeholders.phone}
                        className="flex-1 min-w-0 bg-primary-ivory/50 border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-primary-anthracite placeholder-primary-anthracite/30 focus:outline-none focus:border-accent-oak transition-colors rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Checkboxes */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                    {t.leadForm.labels.services}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    {t.leadForm.serviceOptions.map(service => {
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleServiceToggle(service.id)}
                          className={`p-2.5 sm:p-3 border text-left text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-between rounded-sm ${
                            isSelected
                              ? 'bg-accent-oak text-white border-accent-oak shadow-sm'
                              : 'bg-primary-ivory/50 text-primary-anthracite/70 border-gray-200 hover:border-accent-oak'
                          }`}
                        >
                          <span className="pr-2">{service.label}</span>
                          <span className="shrink-0">{isSelected ? '✓' : '+'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume Dropdown */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                    {t.leadForm.labels.volume}
                  </label>
                  <select
                    value={monthlyVolume}
                    onChange={e => setMonthlyVolume(e.target.value)}
                    className="w-full bg-primary-ivory/50 border border-gray-200 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs font-bold uppercase tracking-wider text-primary-anthracite focus:outline-none focus:border-accent-oak rounded-sm cursor-pointer"
                  >
                    {t.leadForm.volumeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-primary-anthracite/80 block">
                    {t.leadForm.labels.message}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={t.leadForm.placeholders.message}
                    className="w-full bg-primary-ivory/50 border border-gray-200 p-3 sm:p-4 text-xs sm:text-sm text-primary-anthracite placeholder-primary-anthracite/30 focus:outline-none focus:border-accent-oak transition-colors rounded-sm resize-none font-serif italic"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-anthracite text-white hover:bg-accent-oak transition-all py-3.5 sm:py-4 text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.leadForm.buttonLoading}</span>
                  ) : (
                    <>
                      <span>{t.leadForm.buttonIdle}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <p className="text-[9px] text-primary-anthracite/40 text-center uppercase tracking-widest font-bold">
                  {t.leadForm.privacyNote}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. LOCATION & CONTACT (Showroom Section 6) */}
      <section id="location" className="bg-white py-14 sm:py-20 md:py-28 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <h2 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
              {t.sidebarContact.title}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-wider">
              {locale === 'en'
                ? 'The Hague Operations Center & Showroom'
                : 'Den Haag Operatiecentrum & Showroom'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:divide-x divide-gray-100">
            {/* Column 1 */}
            <div className="space-y-6 sm:space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                {locale === 'en' ? 'Location & Contact' : 'Locatie & Contact'}
              </h4>
              <div className="space-y-5 sm:space-y-6">
                <div
                  className="flex gap-3 group cursor-pointer"
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/?api=1&query=De%20Werf%2015%2C%20Loods%203%2C%20Zinkwerf%2024%20A%2C%202544%20EH%20Den%20Haag%2C%20Hollanda',
                      '_blank'
                    )
                  }
                >
                  <div className="w-9 h-9 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-anthracite uppercase tracking-wider mb-1 group-hover:text-accent-oak transition-colors">
                      {t.sidebarContact.warehouse1Title}
                    </p>
                    <p className="text-xs text-primary-anthracite/60 font-serif italic leading-relaxed">
                      De Werf 15, Loods 3 <br />
                      Zinkwerf 24 A, 2544 EH <br />
                      {locale === 'en' ? 'The Hague, Netherlands' : 'Den Haag, Nederland'}
                    </p>
                  </div>
                </div>

                <div
                  className="flex gap-3 group cursor-pointer"
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/?api=1&query=De%20Werf%2010%2C%202544%20EK%20Den%20Haag%2C%20Hollanda',
                      '_blank'
                    )
                  }
                >
                  <div className="w-9 h-9 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-anthracite uppercase tracking-wider mb-1 group-hover:text-accent-oak transition-colors">
                      {t.sidebarContact.warehouse2Title}
                    </p>
                    <p className="text-xs text-primary-anthracite/60 font-serif italic leading-relaxed">
                      De Werf 10 <br />
                      {locale === 'en' ? '2544 EK The Hague, Netherlands' : '2544 EK Den Haag, Nederland'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all shrink-0">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-anthracite uppercase tracking-wider mb-1">
                      {locale === 'en' ? 'Phone & WhatsApp' : 'Telefoon & WhatsApp'}
                    </p>
                    <div className="space-y-0.5 text-xs text-primary-anthracite/60 font-serif italic">
                      <p>NL: <a href="tel:+31638230747" className="hover:text-accent-oak transition-colors font-sans">+31 6 38 23 07 47</a></p>
                      <p>TR: <a href="tel:+905433408264" className="hover:text-accent-oak transition-colors font-sans">+90 543 340 82 64</a></p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-anthracite uppercase tracking-wider mb-1">
                      {locale === 'en' ? 'Email' : 'E-mail'}
                    </p>
                    <a
                      href="mailto:info@01living.nl"
                      className="text-xs text-primary-anthracite/60 font-serif italic hover:text-accent-oak transition-colors"
                    >
                      info@01living.nl
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="md:pl-10 space-y-5 sm:space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                {t.sidebarContact.hoursTitle}
              </h4>
              <div className="space-y-2.5 sm:space-y-3">
                {openingHours.map(item => (
                  <div
                    key={item.day}
                    className="flex justify-between items-center text-xs border-b border-gray-50 pb-1.5"
                  >
                    <span className="font-bold text-primary-anthracite/40 uppercase tracking-wider text-[9px]">
                      {item.day}
                    </span>
                    <span className="text-primary-anthracite/70 font-serif italic">{item.hours}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 sm:pt-3">
                <a
                  href={`https://wa.me/31638230747?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-accent-oak text-white px-5 sm:px-6 py-3 text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold hover:bg-primary-anthracite transition-all shadow-sm"
                >
                  <MessageCircle size={13} />
                  <span>{t.sidebarContact.whatsappButton}</span>
                </a>
              </div>
            </div>

            {/* Column 3 */}
            <div className="md:pl-10 space-y-5 sm:space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-accent-oak">
                {locale === 'en' ? 'Map & Directions' : 'Kaart & Bereikbaarheid'}
              </h4>
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full rounded-sm overflow-hidden grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500 shadow-md border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.19565507436!2d4.258814777085759!3d52.03980197193699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b6da9f82d217%3A0xe6ba15e63fd518f0!2sStar%20Keukencenter%20Den%20Haag!5e0!3m2!1sen!2snl!4v1714650000000!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. APPOINTMENT CTA */}
      <section className="bg-primary-anthracite py-14 sm:py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-oak via-transparent to-transparent"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-white uppercase tracking-wider leading-tight">
              {locale === 'en' ? 'European Expansion' : 'Europese Expansie'} <br />
              <span className="italic font-serif normal-case text-primary-ivory/80 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {locale === 'en' ? 'Launch Today Without Risk' : 'Start Vandaag Zonder Risico'}
              </span>
            </h2>
            <p className="text-primary-ivory/60 text-xs sm:text-sm md:text-base font-serif italic max-w-xl mx-auto leading-relaxed">
              {locale === 'en'
                ? 'Contact our commercial directors directly to schedule a warehouse walk-through in The Hague or request a tailored fulfillment quote.'
                : 'Neem direct contact op met onze directie voor een rondleiding in ons magazijn in Den Haag of vraag een logistiek voorstel op maat aan.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
          >
            <a
              href="#quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 bg-white text-primary-anthracite px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-accent-oak hover:text-white transition-all shadow-xl group text-center whitespace-nowrap"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>
            <a
              href="tel:+31638230747"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 bg-transparent border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-white/5 transition-all text-center whitespace-nowrap"
            >
              {locale === 'en' ? 'Call Direct: +31 6 38 23 07 47' : 'Direct Bellen: +31 6 38 23 07 47'}
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
