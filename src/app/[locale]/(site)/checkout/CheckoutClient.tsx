'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/store/useCart';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Sparkles, UserCheck, ChevronRight, MapPin, Check } from 'lucide-react';

interface SavedUser {
  name: string | null;
  email: string | null;
  street: string | null;
  houseNumber: string | null;
  addition: string | null;
  city: string | null;
  postalCode: string | null;
  phone: string | null;
  country: string | null;
  companyName: string | null;
  vatNumber: string | null;
}

interface SiteSettings {
  id: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  freeShippingThreshold: number;
  shippingFee: number;
  vatRate: number;
  instagramUrl?: string;
  pinterestUrl?: string;
  facebookUrl?: string;
}

export default function CheckoutClient({ savedUser, settings }: { savedUser: SavedUser | null, settings: SiteSettings | null }) {
  const locale = useLocale() as 'nl' | 'en';
  const t = useTranslations('Checkout');
  const tAcc = useTranslations('Account');
  const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const [mounted, setMounted] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const schema = z.object({
    firstName: z.string().min(1, { message: t('validation.firstNameRequired') }),
    lastName: z.string().min(1, { message: t('validation.lastNameRequired') }),
    email: z.string().min(1, { message: t('validation.emailRequired') }).email({ message: t('validation.emailInvalid') }),
    phone: z.string().min(1, { message: tAcc('contactDetails') }),
    
    // Shipping
    street: z.string().min(1, { message: t('validation.addressRequired') }),
    houseNumber: z.string().min(1, { message: tAcc('houseNumber') }),
    addition: z.string().optional(),
    postalCode: z.string().min(1, { message: t('validation.postalCodeRequired') }),
    city: z.string().min(1, { message: t('validation.cityRequired') }),
    country: z.literal('Nederland', { errorMap: () => ({ message: t('validation.addressRequired') }) }),

    // Billing
    billingSameAsShipping: z.boolean(),
    billingStreet: z.string().optional(),
    billingHouseNumber: z.string().optional(),
    billingAddition: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCity: z.string().optional(),
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
  }).refine((data) => {
    if (!data.billingSameAsShipping) {
      return !!data.billingStreet && !!data.billingHouseNumber && !!data.billingPostalCode && !!data.billingCity;
    }
    return true;
  }, {
    message: "Factuur adresi eksik",
    path: ["billingStreet"]
  });

  type CheckoutFormValues = z.infer<typeof schema>;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'Nederland',
      billingSameAsShipping: true,
    }
  });

  const watchBillingSame = watch('billingSameAsShipping');

  const fillSavedData = () => {
    if (!savedUser) return;
    
    const nameParts = savedUser.name?.split(' ') || ['', ''];
    setValue('firstName', nameParts[0]);
    setValue('lastName', nameParts.slice(1).join(' '));
    setValue('email', savedUser.email || '');
    setValue('phone', savedUser.phone || '');
    setValue('street', savedUser.street || '');
    setValue('houseNumber', savedUser.houseNumber || '');
    setValue('addition', savedUser.addition || '');
    setValue('city', savedUser.city || '');
    setValue('postalCode', savedUser.postalCode || '');
    setValue('country', savedUser.country || 'Nederland');
    setValue('companyName', savedUser.companyName || '');
    setValue('vatNumber', savedUser.vatNumber || '');

    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      console.log('[Checkout] Submitting with locale:', locale);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map(item => ({ 
            id: item.id, 
            quantity: item.quantity, 
            variantId: item.selectedVariantId 
          })), 
          customer: values, 
          locale 
        }),
      });

      const data = await response.json();
      if (response.ok && data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        // Handle Zod or Mollie errors more gracefully
        let errorMessage = data.error || 'Checkout failed.';
        if (data.details && typeof data.details === 'object') {
           errorMessage = JSON.stringify(data.details);
        }
        alert(errorMessage);
      }
    } catch (err: any) {
      console.error('[Checkout] Submission Error:', err);
      alert('Something went wrong: ' + err.message);
    }
  };

  const freeThreshold = settings?.freeShippingThreshold || 0;
  const shippingFee = (totalPrice >= freeThreshold && freeThreshold > 0) ? 0 : (settings?.shippingFee || 0);
  const finalTotal = totalPrice + shippingFee;

  const formattedTotal = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(finalTotal);
  const formattedShipping = shippingFee === 0 ? t('shippingFree') : new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(shippingFee);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      
      <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
        {items.length === 0 ? (
          <div className="pt-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
            <div className="bg-white/40 p-12 rounded-[3rem] shadow-sm border border-white/20">
              <h2 className="text-3xl font-heading text-primary-anthracite mb-6">{t('emptyCart')}</h2>
              <Link href={`/${locale}/collecties`} className="inline-block bg-primary-anthracite text-primary-ivory px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-accent-oak transition-all shadow-xl">
                {t('goToShop')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-primary-anthracite/5 pb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak mb-4">{locale === 'nl' ? 'Stap 3/3 — Veilig Afrekenen' : 'Step 3/3 — Secure Checkout'}</p>
                <h1 className="text-5xl md:text-7xl font-heading text-primary-anthracite uppercase tracking-widest">{t('title')}</h1>
              </div>
              <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-primary-anthracite/40">
                <span className="flex items-center gap-2 text-primary-anthracite"><ShieldCheck size={14} /> 256-BIT SSL</span>
                <span className="flex items-center gap-2"><Truck size={14} /> {locale === 'nl' ? 'SNELLE LEVERING' : 'FAST DELIVERY'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              {/* Form Side */}
              <div className="lg:col-span-7 space-y-16">
                
                {savedUser && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent-oak/5 border border-accent-oak/10 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent-oak shadow-sm">
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary-anthracite">{tAcc('welcome', { name: savedUser.name?.split(' ')[0] })}</p>
                        <p className="text-xs text-primary-anthracite/50 italic">{locale === 'nl' ? 'Klik om uw opgeslagen gegevens automatisch in te vullen.' : 'Click to autofill your saved information.'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={fillSavedData}
                      className="bg-primary-anthracite text-primary-ivory px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-accent-oak transition-all flex items-center gap-2 shadow-lg"
                    >
                      <Sparkles size={14} /> {locale === 'nl' ? 'Snel Invullen' : 'Quick Fill'}
                    </button>
                  </motion.div>
                )}

                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-20">
                  {/* Personal Info */}
                  <section className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                       <h2 className="text-2xl font-heading uppercase tracking-widest text-primary-anthracite">1. {t('personalInfo')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <InputField label={t('firstName')} name="firstName" register={register} error={errors.firstName} />
                      <InputField label={t('lastName')} name="lastName" register={register} error={errors.lastName} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <InputField label={t('email')} name="email" type="email" register={register} error={errors.email} />
                      <InputField label={tAcc('phone')} name="phone" register={register} error={errors.phone} placeholder="+31 6 12345678" />
                    </div>
                  </section>

                  {/* Delivery Info */}
                  <section className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                       <h2 className="text-2xl font-heading uppercase tracking-widest text-primary-anthracite">2. {locale === 'nl' ? 'Bezorgadres' : 'Delivery Address'}</h2>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-8">
                       <div className="col-span-12 sm:col-span-8">
                          <InputField label={tAcc('street')} name="street" register={register} error={errors.street} />
                       </div>
                       <div className="col-span-6 sm:col-span-2">
                          <InputField label={tAcc('houseNumber')} name="houseNumber" register={register} error={errors.houseNumber} />
                       </div>
                       <div className="col-span-6 sm:col-span-2">
                          <InputField label={tAcc('addition')} name="addition" register={register} error={errors.addition} placeholder="A" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <InputField label={t('postalCode')} name="postalCode" register={register} error={errors.postalCode} placeholder="1234 AB" />
                      <InputField label={t('city')} name="city" register={register} error={errors.city} />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40">{locale === 'nl' ? 'Bezorggebied' : 'Delivery Region'}</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-accent-oak/5 rounded-2xl -m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center justify-between p-6 bg-white border border-primary-anthracite/5 rounded-2xl shadow-sm overflow-hidden">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-accent-oak/10 rounded-full flex items-center justify-center text-accent-oak">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary-anthracite uppercase tracking-widest">{t('country')}</p>
                              <p className="text-[9px] text-primary-anthracite/40 uppercase tracking-[0.1em] mt-0.5">Premium Local Service</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tighter bg-accent-oak text-primary-ivory px-2 py-1 rounded-md">
                              <ShieldCheck size={10} /> NL ONLY
                            </div>
                            <span className="text-[9px] text-accent-oak font-medium mt-2">{locale === 'nl' ? 'Binnen 2-5 werkdagen' : 'Within 2-5 business days'}</span>
                          </div>
                        </div>
                      </div>
                      <input type="hidden" value="Nederland" {...register('country')} />
                      <p className="text-[9px] text-primary-anthracite/40 leading-relaxed px-2">
                        <span className="text-accent-oak font-bold">Note:</span> {locale === 'nl' ? 'Om de hoogste servicekwaliteit te garanderen, leveren wij momenteel uitsluitend aan adressen binnen Nederland.' : 'To ensure the highest quality of service, we currently deliver exclusively to addresses within the Netherlands.'}
                      </p>
                    </div>
                  </section>

                  {/* Billing Info */}
                  <section className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                       <h2 className="text-2xl font-heading uppercase tracking-widest text-primary-anthracite">3. {locale === 'nl' ? 'Factuuradres' : 'Billing Address'}</h2>
                    </div>

                    <div className="space-y-6">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            {...register('billingSameAsShipping')}
                            className="peer hidden"
                          />
                          <div className="w-6 h-6 border-2 border-primary-anthracite/10 rounded-lg peer-checked:bg-primary-anthracite peer-checked:border-primary-anthracite transition-all flex items-center justify-center">
                            <Check size={14} strokeWidth={4} className="text-primary-ivory opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <span className="text-xs uppercase tracking-widest font-bold text-primary-anthracite/60 group-hover:text-primary-anthracite transition-colors">{locale === 'nl' ? 'Zelfde als bezorgadres' : 'Same as delivery address'}</span>
                      </label>

                      <AnimatePresence>
                        {!watchBillingSame && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden space-y-8 pt-8"
                          >
                             <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-12 sm:col-span-8">
                                   <InputField label={tAcc('street')} name="billingStreet" register={register} error={errors.billingStreet} />
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                   <InputField label={tAcc('houseNumber')} name="billingHouseNumber" register={register} error={errors.billingHouseNumber} />
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                   <InputField label={tAcc('addition')} name="billingAddition" register={register} error={errors.billingAddition} />
                                </div>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               <InputField label={t('postalCode')} name="billingPostalCode" register={register} error={errors.billingPostalCode} />
                               <InputField label={t('city')} name="billingCity" register={register} error={errors.billingCity} />
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <InputField label={tAcc('companyName')} name="companyName" register={register} error={errors.companyName} />
                        <InputField label={tAcc('vatNumber')} name="vatNumber" register={register} error={errors.vatNumber} placeholder="NL123456789B01" />
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Sidebar side */}
              <div className="lg:col-span-5">
                <div className="sticky top-32 space-y-8">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-oak/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    
                    <h2 className="text-xl font-heading text-primary-anthracite mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center justify-between">
                      {t('orderSummary')} <span className="text-[10px] text-primary-anthracite/30">{items.length} items</span>
                    </h2>

                    <div className="space-y-6 mb-10 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.selectedVariantId || 'base'}`} className="flex gap-4 items-center group">
                          <div className="relative w-16 h-20 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={item.images[0]} alt={item.name[locale]} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-primary-anthracite">{item.name[locale]}</p>
                            <div className="flex flex-col gap-0.5 mt-1">
                              {item.selectedColor?.[locale] && (
                                <p className="text-[8px] text-accent-oak font-bold uppercase tracking-widest">
                                  {locale === 'nl' ? 'Kleur' : 'Color'}: {item.selectedColor[locale]}
                                </p>
                              )}
                              {item.selectedSize?.[locale] && (
                                <p className="text-[8px] text-accent-oak font-bold uppercase tracking-widest">
                                  {locale === 'nl' ? 'Afmeting' : 'Size'}: {item.selectedSize[locale]}
                                </p>
                              )}
                              {item.selectedVariantName?.[locale] && (
                                <p className="text-[8px] text-accent-oak font-bold uppercase tracking-widest">
                                  {item.selectedVariantName[locale]}
                                </p>
                              )}
                            </div>
                            <p className="text-[9px] text-primary-anthracite/40 font-bold uppercase tracking-widest mt-1">{locale === 'nl' ? 'Aantal' : 'Quantity'}: {item.quantity}</p>
                          </div>
                          <p className="text-xs font-bold text-primary-anthracite">
                            €{(item.price * item.quantity).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-primary-anthracite/40">{t('subtotal')}</span>
                        <span className="text-primary-anthracite">€{totalPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-primary-anthracite/40">{t('shipping')}</span>
                        <span className={shippingFee === 0 ? "text-green-600" : "text-primary-anthracite"}>{formattedShipping}</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 mt-6 border-t border-primary-anthracite/10">
                        <span className="text-xl font-heading uppercase tracking-widest text-primary-anthracite">{t('total')}</span>
                        <div className="text-right">
                           <span className="text-2xl font-bold text-primary-anthracite">{formattedTotal}</span>
                           <p className="text-[8px] text-primary-anthracite/30 uppercase tracking-widest mt-1">Incl. BTW</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting}
                      className="w-full bg-primary-anthracite text-primary-ivory py-6 mt-10 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-accent-oak transition-all shadow-xl disabled:opacity-60 flex items-center justify-center gap-4 group"
                    >
                      {isSubmitting ? (locale === 'nl' ? 'Verwerken...' : 'Processing...') : (locale === 'nl' ? 'Nu Afrekenen' : 'Checkout Now')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSavedNotification && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-10 right-10 z-[100] bg-primary-anthracite text-primary-ivory px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={14} strokeWidth={4} />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold">{locale === 'nl' ? 'Ingevuld!' : 'Filled!'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputField({ label, name, type = 'text', register, error, placeholder }: { label: string, name: string, type?: string, register: any, error: any, placeholder?: string }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40 group-focus-within:text-accent-oak transition-colors">
        {label}
      </label>
      <input 
        type={type} 
        {...register(name)} 
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-primary-anthracite/10 py-3 text-sm text-primary-anthracite placeholder:text-gray-200 focus:outline-none focus:border-accent-oak transition-all" 
      />
      {error && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{error.message}</p>}
    </div>
  );
}
