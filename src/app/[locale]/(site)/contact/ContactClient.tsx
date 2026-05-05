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
import { ChevronDown } from 'lucide-react';

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

  // Define Zod schema
  const contactSchema = z.object({
    firstName: z.string().min(1, { message: t('validation.firstNameRequired') }),
    lastName: z.string().min(1, { message: t('validation.lastNameRequired') }),
    email: z.string().min(1, { message: t('validation.emailRequired') }).email({ message: t('validation.emailInvalid') }),
    phone: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
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
      alert("Er is bir fout opgetreden.");
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
                    <div className="group cursor-pointer hover:text-accent-oak transition-colors" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=De%20Werf%2010%2C%202544%20EK%20Den%20Haag%2C%20Hollanda', '_blank')}>
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-xs mb-2 group-hover:text-accent-oak transition-colors">Showroom</h3>
                      <p>De Werf 10</p>
                      <p>2544 EK Den Haag</p>
                      <p>Hollanda</p>
                    </div>

                    <div className="group cursor-pointer hover:text-accent-oak transition-colors" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=De%20Werf%2015%2C%20Loods%203%2C%20Zinkwerf%2024%20A%2C%202544%20EH%20Den%20Haag%2C%20Hollanda', '_blank')}>
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-xs mb-2 group-hover:text-accent-oak transition-colors">{t('info.warehouse')}</h3>
                      <p>De Werf 15, Loods 3</p>
                      <p>Zinkwerf 24 A, 2544 EH</p>
                      <p>Den Haag, Hollanda</p>
                    </div>
                    
                    <div className="pt-8 border-t border-primary-anthracite/10 space-y-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-3"><span className="font-semibold tracking-wide uppercase text-[10px] text-primary-anthracite/50 w-4">M:</span> +31 6 38230747</p>
                        <p className="flex items-center gap-3"><span className="font-semibold tracking-wide uppercase text-[10px] text-primary-anthracite/50 w-4">T:</span> 070 388 8402</p>
                      </div>
                      <p className="flex items-center gap-3">
                        <span className="font-semibold tracking-wide uppercase text-[10px] text-primary-anthracite/50 w-4">E:</span> 
                        <a href="mailto:info@01living.nl" className="hover:text-accent-oak transition-colors font-medium">info@01living.nl</a>
                      </p>
                    </div>

                    {/* Social Media */}
                    <div className="pt-8 border-t border-primary-anthracite/10">
                      <h3 className="font-semibold text-primary-anthracite uppercase tracking-widest text-[10px] mb-6">Volg Ons</h3>
                      <div className="flex gap-6">
                        <a 
                          href="https://www.instagram.com/01livingg/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group text-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-anthracite/5 flex items-center justify-center group-hover:bg-accent-oak group-hover:text-white transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </div>
                          <span className="font-medium group-hover:text-accent-oak transition-colors">Instagram</span>
                        </a>
                        <a 
                          href="https://www.tiktok.com/@01livingg" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group text-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-anthracite/5 flex items-center justify-center group-hover:bg-accent-oak group-hover:text-white transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                          </div>
                          <span className="font-medium group-hover:text-accent-oak transition-colors">TikTok</span>
                        </a>
                      </div>
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
                      <h3 className="text-2xl font-heading text-primary-anthracite">{t('form.successTitle')}</h3>
                      <p className="text-primary-anthracite/60 text-sm">{t('form.successMessage')}</p>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-heading mb-8 text-primary-anthracite">Send a Message</h3>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <input 
                              type="text" 
                              placeholder={t('form.firstName')}
                              {...register('firstName')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-2">{errors.firstName.message}</p>}
                          </div>
                          <div>
                            <input 
                              type="text" 
                              placeholder={t('form.lastName')}
                              {...register('lastName')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-2">{errors.lastName.message}</p>}
                          </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <input 
                              type="email" 
                              placeholder={t('form.email')}
                              {...register('email')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                          </div>
                          <div>
                            <input 
                              type="tel" 
                              placeholder={t('form.phone')}
                              {...register('phone')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors"
                            />
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <input 
                              type="text" 
                              placeholder={t('form.date')}
                              {...register('date')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors"
                            />
                          </div>
                          <div className="relative">
                            <select 
                              {...register('time')}
                              className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors appearance-none cursor-pointer"
                            >
                              <option value="" disabled selected>{t('form.time')}</option>
                              <option value="morning">{t('form.morning')}</option>
                              <option value="afternoon">{t('form.afternoon')}</option>
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-anthracite/50 pointer-events-none" size={16} />
                          </div>
                        </div>

                        {/* Location Dropdown */}
                        <div className="relative">
                          <select 
                            {...register('location')}
                            className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors appearance-none cursor-pointer"
                          >
                            <option value="" disabled selected>{t('form.location')}</option>
                            <option value="den-haag">Den Haag Showroom</option>
                            <option value="other">Other / Online Consultation</option>
                          </select>
                          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-anthracite/50 pointer-events-none" size={16} />
                        </div>

                        {/* Message */}
                        <div>
                          <textarea 
                            rows={4}
                            placeholder={t('form.message')}
                            {...register('message')}
                            className="w-full border-b border-primary-anthracite bg-transparent py-4 text-primary-anthracite placeholder:text-primary-anthracite/50 focus:outline-none focus:border-accent-oak transition-colors resize-none"
                          />
                          {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message.message}</p>}
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-primary-anthracite text-primary-ivory px-10 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-accent-oak transition-all duration-300 w-full disabled:opacity-50 shadow-lg"
                        >
                          {isSubmitting ? t('form.sending') : t('form.submit')}
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
