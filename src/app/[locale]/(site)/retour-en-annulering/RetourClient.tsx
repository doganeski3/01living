'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Truck, 
  ChevronDown, 
  Mail, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Copy,
  Check,
  Package,
  CalendarCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export default function RetourClient() {
  const t = useTranslations('Legal.returns');
  const tCommon = useTranslations('Legal');
  const locale = useLocale();
  const isEn = locale === 'en';

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const highlights = [
    {
      icon: Clock,
      title: t('highlights.coolingOff'),
      desc: t('highlights.coolingOffDesc'),
      tag: isEn ? "14 Days" : "14 Dagen"
    },
    {
      icon: RotateCcw,
      title: t('highlights.cancellation'),
      desc: t('highlights.cancellationDesc'),
      tag: isEn ? "Free" : "Kosteloos"
    },
    {
      icon: CreditCard,
      title: t('highlights.refund'),
      desc: t('highlights.refundDesc'),
      tag: isEn ? "Fast Refund" : "Terugbetaling"
    },
    {
      icon: Sparkles,
      title: t('highlights.customCare'),
      desc: t('highlights.customCareDesc'),
      tag: isEn ? "Bespoke" : "Maatwerk"
    }
  ];

  const steps = t.raw('steps') as { step: string; title: string; desc: string }[];
  const sections = t.raw('sections') as { title: string; content: string }[];

  const emailTemplate = isEn 
    ? `Subject: Withdrawal Notice - Order [Your Order Number]

Dear 01 Living Team,

I hereby give notice that I withdraw from my contract of sale for the following goods:

- Order Number: [Your Order Number]
- Product Name(s): [Product Names]
- Ordered on: [Date] / Received on: [Date]
- Full Name: [Your Name]
- Email Address: [Your Email]
- Phone Number: [Your Phone]
- Reason for return (optional): [Reason]

Please arrange collection / provide return instructions.

Best regards,
[Your Name]`
    : `Onderwerp: Herroeping Bestelling - Ordernummer [Uw Ordernummer]

Beste 01 Living Team,

Hierbij deel ik u mede dat ik onze overeenkomst betreffende de verkoop van de volgende goederen herroep:

- Ordernummer: [Uw Ordernummer]
- Product(en): [Naam van de producten]
- Besteld op: [Datum] / Ontvangen op: [Datum]
- Naam: [Uw Volledige Naam]
- E-mailadres: [Uw E-mailadres]
- Telefoonnummer: [Uw Telefoonnummer]
- Reden van retour (optioneel): [Reden]

Graag ontvang ik instructies voor de retourzending / planning van ophaling.

Met vriendelijke groet,
[Uw Naam]`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 border-b border-primary-anthracite/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-accent-oak">
              <Link href={`/${locale}`} className="hover:underline opacity-80">
                {isEn ? "Home" : "Home"}
              </Link>
              <span>/</span>
              <span>{isEn ? "Legal" : "Juridisch"}</span>
              <span>/</span>
              <span className="text-primary-anthracite">{t('title')}</span>
            </div>

            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-accent-oak">
                {t('subtitle')}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading uppercase tracking-[0.15em] text-primary-anthracite leading-tight">
                {t('title')}
              </h1>
            </div>

            <p className="text-lg md:text-xl font-serif italic text-primary-anthracite/80 max-w-3xl leading-relaxed">
              {t('intro')}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-primary-anthracite/50 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent-oak" />
                {tCommon('lastUpdated')}
              </span>
              <span>•</span>
              <span>01 Living B.V. (KVK: 85234133)</span>
              <span>•</span>
              <span>{isEn ? "EU Consumer Compliant" : "Conform EU Consumentenrecht"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 shadow-md shadow-primary-anthracite/5 border border-primary-anthracite/10 flex flex-col justify-between group hover:border-accent-oak hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent-oak/10 flex items-center justify-center text-accent-oak group-hover:bg-accent-oak group-hover:text-white transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary-anthracite/50 bg-primary-ivory px-2.5 py-1 border border-primary-anthracite/5">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary-anthracite mb-1 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary-anthracite/65 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Return Process Timeline */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-accent-oak">
            <Truck size={14} />
            <span>{isEn ? "Step by Step" : "Stap voor Stap"}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-heading uppercase tracking-[0.15em] text-primary-anthracite">
            {t('stepsTitle')}
          </h2>
          <div className="w-12 h-px bg-accent-oak mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm p-8 border border-primary-anthracite/10 flex flex-col justify-between hover:shadow-lg hover:border-accent-oak/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-heading font-light text-accent-oak">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-accent-oak/30 flex items-center justify-center text-accent-oak text-xs font-serif italic group-hover:bg-accent-oak group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-heading text-base font-bold uppercase tracking-wider text-primary-anthracite">
                  {step.title}
                </h3>
                <p className="text-xs lg:text-sm text-primary-anthracite/70 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Detailed Policy Accordion */}
      <section className="bg-white/80 border-y border-primary-anthracite/10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4 text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-[0.15em] text-primary-anthracite">
              {isEn ? "Detailed Policy Terms" : "Volledige Beleidsvoorwaarden"}
            </h2>
            <p className="text-sm font-serif italic text-primary-anthracite/60">
              {isEn 
                ? "Click on any clause to review legal conditions and procedures." 
                : "Klik op een onderdeel om de juridische voorwaarden en procedures te lezen."}
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div 
                  key={idx}
                  className="border border-primary-anthracite/15 bg-primary-ivory/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isOpen ? null : idx)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 group"
                  >
                    <span className="font-heading text-base sm:text-lg uppercase tracking-wider font-bold text-primary-anthracite group-hover:text-accent-oak transition-colors">
                      {section.title}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-primary-anthracite/20 flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 bg-accent-oak border-accent-oak text-white' : 'text-primary-anthracite'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-6 sm:p-7 pt-0 border-t border-primary-anthracite/10 font-sans text-sm sm:text-base leading-relaxed text-primary-anthracite/80 space-y-4 bg-white/70 animate-fadeIn">
                      <p className="pt-4">{section.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Model Withdrawal Form / Quick Template Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white border border-primary-anthracite/15 p-8 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent-oak/15 text-accent-oak flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-heading uppercase tracking-wider font-bold text-primary-anthracite">
                {t('modelFormTitle')}
              </h3>
              <p className="text-xs lg:text-sm text-primary-anthracite/70 font-sans mt-1">
                {t('modelFormText')}
              </p>
            </div>
          </div>

          <div className="bg-primary-ivory/80 border border-primary-anthracite/10 p-5 rounded font-mono text-xs text-primary-anthracite/80 leading-relaxed whitespace-pre-wrap relative overflow-x-auto">
            {emailTemplate}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-2 bg-primary-anthracite text-primary-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-accent-oak transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span>{isEn ? "Template Copied!" : "Tekst Gekopieerd!"}</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>{isEn ? "Copy Return Email Template" : "Kopieer E-mail Template"}</span>
                </>
              )}
            </button>

            <a
              href={`mailto:info@01living.nl?subject=${encodeURIComponent(isEn ? "Return Request - Order" : "Herroeping Bestelling - Order")}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-accent-oak hover:underline"
            >
              <Mail size={14} />
              <span>info@01living.nl</span>
            </a>
          </div>
        </div>
      </section>

      {/* Support & Concierge CTA */}
      <section className="bg-primary-anthracite text-primary-ivory py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-accent-oak">
            <CheckCircle2 size={14} />
            <span>01 Living Concierge</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-heading uppercase tracking-[0.15em] leading-snug">
            {t('contactCTA')}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <a 
              href="mailto:info@01living.nl"
              className="inline-flex items-center gap-3 bg-white text-primary-anthracite px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-accent-oak hover:text-white transition-all shadow-lg"
            >
              <Mail size={16} />
              <span>{t('emailButton')}</span>
            </a>

            <a 
              href="https://wa.me/31600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/30 text-primary-ivory px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:border-accent-oak hover:text-accent-oak transition-all"
            >
              <MessageSquare size={16} />
              <span>{t('whatsappButton')}</span>
            </a>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-accent-oak hover:underline ml-2"
            >
              <span>{isEn ? "Contact Page →" : "Contactpagina →"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
