'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function OverOnsClient() {
  const t = useTranslations('OverOns');
  const locale = useLocale();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      {/* Hero Section with Parallax */}
      <section ref={ref} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <Image
            src="/images/over_ons_hero.png"
            alt="01 Living Craftsmanship"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-primary-ivory z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-20 text-center px-6 mt-20"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary-ivory/70 font-semibold block mb-6">
            01 Living
          </span>
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-heading text-primary-ivory drop-shadow-lg">
            {t('title')}
          </h1>
        </motion.div>
      </section>

      <div className="bg-primary-ivory relative z-20">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-40">
          
          {/* Philosophy Section - Zig Zag Layout */}
          <div className="space-y-32">
            {/* Part 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full lg:w-1/2"
              >
                <div className="text-6xl font-heading text-accent-oak/20 mb-[-30px] ml-[-20px]">01</div>
                <h2 className="text-3xl font-heading text-primary-anthracite mb-6">{t('feature1Title')}</h2>
                <p className="text-lg font-sans text-primary-anthracite/80 leading-relaxed">
                  {t('philosophyP1')}
                </p>
              </motion.div>
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative aspect-[4/5] bg-gray-100 overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Living Space"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </motion.div>
            </div>

            {/* Part 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full lg:w-1/2"
              >
                <div className="text-6xl font-heading text-accent-oak/20 mb-[-30px] ml-[-20px]">02</div>
                <h2 className="text-3xl font-heading text-primary-anthracite mb-6">{t('feature2Title')}</h2>
                <p className="text-lg font-sans text-primary-anthracite/80 leading-relaxed">
                  {t('philosophyP2')}
                </p>
              </motion.div>
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative aspect-[4/3] bg-gray-100 overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Kitchen Design"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </motion.div>
            </div>

            {/* Part 3 - Emphasis */}
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center pt-16 border-t border-primary-anthracite/10"
            >
              <p className="text-2xl md:text-4xl font-heading text-primary-anthracite leading-relaxed">
                &quot;{t('philosophyP3')}&quot;
              </p>
            </motion.div>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <section className="bg-primary-anthracite text-primary-ivory py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-accent-oak inline-block"></span>
                <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-oak">
                  {t('futureBadge')}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-heading mb-8">{t('visionTitle')}</h2>
              <p className="text-primary-ivory/70 leading-relaxed font-sans text-lg">
                {t('visionText')}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-accent-oak inline-block"></span>
                <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-oak">
                  {t('targetBadge')}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-heading mb-8">{t('missionTitle')}</h2>
              <p className="text-primary-ivory/70 leading-relaxed font-sans text-lg">
                {t('missionText')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Collections CTA */}
        <section className="relative h-[60vh] flex items-center justify-center w-full overflow-hidden">
          <Image
            src="/images/over_ons_cta.png"
            alt="Discover Collections"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-20 text-center max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-primary-ivory mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-primary-ivory/80 font-sans text-lg mb-10 leading-relaxed">
              {t('ctaText')}
            </p>
            <Link
              href={`/${locale}/collecties`}
              className="inline-block border border-primary-ivory text-primary-ivory px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-primary-ivory hover:text-primary-anthracite transition-all duration-300"
            >
              {t('ctaBtn')}
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
}
