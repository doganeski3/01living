'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { sendContactEmail } from '@/app/actions/contact';

export default function ContactClient() {
  const t = useTranslations('Contact');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Define Zod schema using translations for error messages
  const contactSchema = z.object({
    name: z.string().min(1, { message: t('validation.nameRequired') }),
    email: z.string().min(1, { message: t('validation.emailRequired') }).email({ message: t('validation.emailInvalid') }),
    message: z.string().min(10, { message: t('validation.messageMin') })
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await sendContactEmail(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.error || "Fout bij verzenden.");
      }
    } catch {
      alert("Er is een fout opgetreden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-primary-ivory overflow-x-hidden">
        {/* Hero Section with Parallax */}
        <section ref={ref} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
            <Image
              src="/images/contact_hero.png"
              alt="01 Living Showroom"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-20 text-center px-6 mt-20"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-primary-ivory/80 font-semibold block mb-4">
              01 Living
            </span>
            <h1 className="text-5xl md:text-7xl font-heading text-primary-ivory drop-shadow-md">
              {t('title')}
            </h1>
          </motion.div>
        </section>
        
        <div className="relative z-20 bg-primary-ivory pt-24 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              {/* Left: Info */}
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-5/12 space-y-16"
              >
                <div>
                  <h2 className="text-3xl font-heading mb-8 text-primary-anthracite">{t('info.title')}</h2>
                  <div className="w-12 h-px bg-accent-oak mb-8"></div>
                  
                  <div className="space-y-10 text-primary-anthracite/80 font-sans leading-relaxed">
                    <div className="group">
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-xs mb-2 group-hover:text-accent-oak transition-colors">{t('info.warehouse')}</h3>
                      <p>Zinkwerf 24A</p>
                      <p>2544EE Den Haag</p>
                      <p>Nederland</p>
                    </div>
                    
                    <div className="group">
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-xs mb-2 group-hover:text-accent-oak transition-colors">{t('info.showroomDenHaag')}</h3>
                      <p>De Werf 10</p>
                      <p>2544 EK Den Haag</p>
                    </div>

                    <div className="group">
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-xs mb-2 group-hover:text-accent-oak transition-colors">{t('info.showroomSchiedam')}</h3>
                      <p>&apos;s-Gravelandseweg 410</p>
                      <p>3125 BK Schiedam</p>
                    </div>

                    <div className="pt-8 border-t border-primary-anthracite/10">
                      <p className="mb-2"><span className="font-semibold tracking-wide uppercase text-xs">M:</span> +31 6 38230747</p>
                      <p><span className="font-semibold tracking-wide uppercase text-xs">T:</span> 070 388 8402</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-7/12"
              >
                <div className="bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-sm border border-primary-anthracite/5">
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                      <div className="w-20 h-20 bg-accent-oak/10 rounded-full flex items-center justify-center mx-auto text-accent-oak">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <h3 className="text-2xl font-heading text-primary-anthracite">{t('form.successTitle') || 'Bedankt!'}</h3>
                      <p className="text-primary-anthracite/60 text-sm">{t('form.successMessage') || 'Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op.'}</p>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-heading mb-8 text-primary-anthracite">Send a Message</h3>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                          <input 
                            type="text" 
                            placeholder={t('form.namePlaceholder')}
                            {...register('name')}
                            className="w-full border-b border-primary-anthracite/20 bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/40 focus:outline-none focus:border-accent-oak transition-colors"
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>}
                        </div>

                        <div>
                          <input 
                            type="email" 
                            placeholder={t('form.emailPlaceholder')}
                            {...register('email')}
                            className="w-full border-b border-primary-anthracite/20 bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/40 focus:outline-none focus:border-accent-oak transition-colors"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                        </div>

                        <div>
                          <textarea 
                            rows={5}
                            placeholder={t('form.messagePlaceholder')}
                            {...register('message')}
                            className="w-full border-b border-primary-anthracite/20 bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/40 focus:outline-none focus:border-accent-oak transition-colors resize-none"
                          />
                          {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message.message}</p>}
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-primary-anthracite text-primary-ivory px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-accent-oak transition-all duration-300 w-full disabled:opacity-50"
                        >
                          {isSubmitting ? (t('form.sending') || 'Verzenden...') : t('form.submit')}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
