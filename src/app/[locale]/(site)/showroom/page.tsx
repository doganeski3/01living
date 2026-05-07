'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, PenTool, Gem, Users, Mail, Smartphone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTranslations, useLocale } from 'next-intl';

export default function ShowroomPage() {
  const t = useTranslations('Showroom');
  const locale = useLocale();

  const openingHours = [
    { day: 'Maandag', hours: '12:30 - 17:30' },
    { day: 'Dinsdag', hours: '09:30 - 17:30' },
    { day: 'Woensdag', hours: '09:30 - 17:30' },
    { day: 'Donderdag', hours: '09:30 - 20:30' },
    { day: 'Vrijdag', hours: '09:30 - 17:30' },
    { day: 'Zaterdag', hours: '10:00 - 17:00' },
    { day: 'Zondag', hours: locale === 'en' ? 'Closed' : 'Gesloten' },
  ];

  const features = [
    {
      icon: <Gem size={24} />,
      title: t('features.materials.title'),
      description: t('features.materials.desc')
    },
    {
      icon: <PenTool size={24} />,
      title: t('features.design.title'),
      description: t('features.design.desc')
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t('features.quality.title'),
      description: t('features.quality.desc')
    },
    {
      icon: <Users size={24} />,
      title: t('features.advice.title'),
      description: t('features.advice.desc')
    }
  ];

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/luxury_kitchen_hero.png"
            alt={t('metaTitle')}
            fill
            className="object-cover brightness-[0.5] scale-105"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-8 bg-accent-oak"></div>
            <p className="text-accent-oak uppercase tracking-[0.5em] text-xs font-bold">
              {t('hero.badge')}
            </p>
            <div className="h-px w-8 bg-accent-oak"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading text-white uppercase tracking-widest leading-tight mb-10"
          >
             {t('hero.title').split(' ').slice(0, -1).join(' ')} <br />
            <span className="italic font-serif normal-case tracking-normal text-primary-ivory/90">{t('hero.title').split(' ').slice(-1)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/80 text-base md:text-xl font-serif italic max-w-3xl mx-auto leading-relaxed mb-12"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center"
          >
            <Link 
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-6 bg-white text-primary-anthracite px-12 py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-accent-oak hover:text-white transition-all shadow-2xl group"
            >
              {t('hero.cta')}
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4"
        >
          <span className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-bold rotate-90 origin-left mb-12">{locale === 'en' ? 'Discover More' : 'Ontdek Meer'}</span>
          <div className="w-px h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. Intro Section */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-accent-oak">{t('intro.badge')}</h2>
                <h3 className="text-4xl md:text-6xl font-heading text-primary-anthracite leading-[1.1] uppercase tracking-wider">
                  {t('intro.title')}
                </h3>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg text-primary-anthracite/70 font-serif italic leading-relaxed"
              >
                <p>{t('intro.p1')}</p>
                <p>{t('intro.p2')}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="text-accent-oak group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-primary-anthracite">{f.title}</h4>
                      <p className="text-[11px] text-primary-anthracite/50 leading-relaxed uppercase tracking-wider">{f.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative aspect-[3/4] rounded-sm overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/showroom_kitchen_intro_v2.png"
                alt={t('intro.title')}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Process Section */}
      <section className="py-32 px-6 bg-primary-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-accent-oak">{t('process.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-heading text-primary-anthracite uppercase tracking-widest">
              {t('process.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: t('process.step1.title'), text: t('process.step1.text') },
              { step: '02', title: t('process.step2.title'), text: t('process.step2.text') },
              { step: '03', title: t('process.step3.title'), text: t('process.step3.text') }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-12 rounded-sm shadow-sm hover:shadow-xl transition-all duration-700 group border border-gray-100"
              >
                <span className="text-5xl font-heading text-accent-oak/20 group-hover:text-accent-oak/40 transition-colors block mb-6">{item.step}</span>
                <h4 className="text-lg font-heading text-primary-anthracite mb-4 uppercase tracking-widest">{item.title}</h4>
                <p className="text-primary-anthracite/60 text-sm leading-relaxed font-serif italic">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Materials Focus */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1 relative aspect-video lg:aspect-square rounded-sm overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/showroom_materials_v3.png"
                alt={t('materials.title')}
                fill
                className="object-cover"
              />
            </motion.div>
            
            <div className="order-1 lg:order-2 space-y-10 lg:pl-10">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-accent-oak">{t('materials.badge')}</h2>
                <h3 className="text-4xl md:text-5xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t('materials.title')}
                </h3>
              </motion.div>
              <div className="space-y-6 text-primary-anthracite/70 text-lg leading-relaxed font-serif italic">
                <p>{t('materials.p1')}</p>
                <p>{t('materials.p2')}</p>
              </div>
              <div className="pt-6">
                <Link 
                  href={`/${locale}/collecties`}
                  className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-bold text-primary-anthracite group"
                >
                  {t('materials.cta')}
                  <div className="w-12 h-px bg-primary-anthracite transition-all group-hover:w-20"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Consultation Area */}
      <section className="py-32 px-6 bg-primary-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 lg:pr-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-accent-oak">{t('consultation.badge')}</h2>
                <h3 className="text-4xl md:text-5xl font-heading text-primary-anthracite leading-tight uppercase tracking-wider">
                  {t('consultation.title')}
                </h3>
              </motion.div>
              <div className="space-y-6 text-primary-anthracite/70 text-lg leading-relaxed font-serif italic">
                <p>{t('consultation.p1')}</p>
                <p>{t('consultation.p2')}</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-video lg:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/showroom_consultation_v3.png"
                alt={t('consultation.title')}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Location & Hours */}
      <section id="location" className="bg-white py-32 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-accent-oak">{t('contact.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-heading text-primary-anthracite uppercase tracking-widest">
              {t('contact.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:divide-x divide-gray-100">
            
            {/* Column 1: Contact */}
            <div className="space-y-10">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak">Locatie & Contact</h4>
              <div className="space-y-8">
                {/* Showroom */}
                <div className="flex gap-4 group" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=De%20Werf%2010%2C%202544%20EK%20Den%20Haag%2C%20Hollanda', '_blank')}>
                  <div className="w-10 h-10 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all duration-500 cursor-pointer">
                    <MapPin size={18} />
                  </div>
                  <div className="cursor-pointer">
                    <p className="text-sm font-bold text-primary-anthracite uppercase tracking-widest mb-2 group-hover:text-accent-oak transition-colors">{t('contact.address')}</p>
                    <p className="text-sm text-primary-anthracite/60 font-serif italic leading-relaxed">
                      De Werf 10 <br />
                      2544 EK Den Haag
                    </p>
                  </div>
                </div>

                {/* Warehouse */}
                <div className="flex gap-4 group" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=De%20Werf%2015%2C%20Loods%203%2C%20Zinkwerf%2024%20A%2C%202544%20EH%20Den%20Haag%2C%20Hollanda', '_blank')}>
                  <div className="w-10 h-10 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all duration-500 cursor-pointer">
                    <MapPin size={18} />
                  </div>
                  <div className="cursor-pointer">
                    <p className="text-sm font-bold text-primary-anthracite uppercase tracking-widest mb-2 group-hover:text-accent-oak transition-colors">{t('contact.warehouse')}</p>
                    <p className="text-sm text-primary-anthracite/60 font-serif italic leading-relaxed">
                      De Werf 15, Loods 3 <br />
                      Zinkwerf 24 A, 2544 EH <br />
                      Den Haag, Hollanda
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all duration-500">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-anthracite uppercase tracking-widest mb-2">{t('contact.phone')}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-primary-anthracite/60 font-serif italic flex items-center gap-2">
                        <span className="font-bold uppercase text-[9px] text-primary-anthracite/30 w-4">M:</span>
                        <a href="tel:+31638230747" className="hover:text-accent-oak transition-colors">+31 6 38230747</a>
                      </p>
                      <p className="text-sm text-primary-anthracite/60 font-serif italic flex items-center gap-2">
                        <span className="font-bold uppercase text-[9px] text-primary-anthracite/30 w-4">T:</span>
                        <a href="tel:0703888402" className="hover:text-accent-oak transition-colors">070 388 8402</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-ivory flex items-center justify-center text-primary-anthracite/40 group-hover:bg-accent-oak group-hover:text-white transition-all duration-500">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-anthracite uppercase tracking-widest mb-2">{t('contact.email')}</p>
                    <a href="mailto:info@01living.nl" className="text-sm text-primary-anthracite/60 font-serif italic hover:text-accent-oak transition-colors">info@01living.nl</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Hours */}
            <div className="md:pl-16 space-y-10">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak">{t('contact.hours')}</h4>
              <div className="space-y-4">
                {openingHours.map((item) => (
                  <div key={item.day} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="font-bold text-primary-anthracite/40 uppercase tracking-widest text-[10px]">{item.day}</span>
                    <span className="text-primary-anthracite/70 font-serif italic">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Maps */}
            <div className="md:pl-16 space-y-10">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak">{t('contact.findUs')}</h4>
              <div className="aspect-square w-full rounded-sm overflow-hidden grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-xl border border-gray-100">
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

      {/* 7. Appointment CTA */}
      <section className="bg-primary-anthracite py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-oak via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white uppercase tracking-[0.1em] leading-tight">
              {t('cta.title').split(' ').slice(0, -2).join(' ')} <br /> 
              <span className="italic font-serif normal-case text-primary-ivory/80">
                {t('cta.title').split(' ').slice(-2).join(' ')}
              </span>
            </h2>
            <p className="text-primary-ivory/60 text-lg font-serif italic max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href={`/${locale}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-6 bg-white text-primary-anthracite px-12 py-6 text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent-oak hover:text-white transition-all shadow-2xl group"
            >
              {t('cta.btn')}
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <a 
              href="tel:0703888402"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-6 bg-transparent border border-white/20 text-white px-12 py-6 text-xs uppercase tracking-[0.4em] font-bold hover:bg-white/5 transition-all"
            >
              {t('cta.call')}
            </a>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
