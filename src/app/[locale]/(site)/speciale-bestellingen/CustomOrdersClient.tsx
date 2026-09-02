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
    mobility: <Zap className="w-5 h-5 text-accent-oak" />,
    electronics: <Tv className="w-5 h-5 text-accent-oak" />,
    modular: <Box className="w-5 h-5 text-accent-oak" />,
    furniture: <Armchair className="w-5 h-5 text-accent-oak" />,
    project: <Building2 className="w-5 h-5 text-accent-oak" />,
    corporate: <Briefcase className="w-5 h-5 text-accent-oak" />,
    custom: <Sparkles className="w-5 h-5 text-accent-oak" />
  };

  const categories = [
    {
      id: 'mobility',
      badge: isEn ? "Mobility & Innovation" : "Mobiliteit & Innovatie",
      title: isEn ? "Electric Vehicles & Mobility" : "Elektrische Voertuigen & Mobiliteit",
      originalTitle: "Elektrikli Araçlar & Mobilite",
      description: isEn 
        ? "High-performance luxury electric golf carts, urban utility mobility, airport & resort shuttles, and commercial fleet solutions with lithium battery tech and bespoke branding."
        : "Exclusieve elektrische golfkarren, stedelijke e-mobiliteitsvoertuigen, elektrische shuttles en bedrijfsmobiliteit op maat samengesteld met geavanceerde accutechnologie en custom branding.",
      tags: isEn 
        ? ["E-Golf Carts", "Urban Mobility", "Lithium Battery Tech", "Custom Livery"]
        : ["E-Golfkarren", "Stedelijke Mobiliteit", "Lithium Accu's", "Custom Branding"],
      image: "/images/custom-orders/mobility.jpg",
      highlight: isEn ? "Custom Fleet & Luxury Specs" : "Custom Vloot & Luxe Specs"
    },
    {
      id: 'electronics',
      badge: isEn ? "Smart Living & Tech" : "Smart Living & Tech",
      title: isEn ? "Consumer & Smart Electronics" : "Elektronische Producten & Smart Tech",
      originalTitle: "Elektronik Ürünler",
      description: isEn
        ? "Integrated smart living ecosystems, architectural invisible audio, OLED cinema displays, and exclusive contract electronics tailored to modern interior specifications."
        : "Geavanceerde smart home ecosystemen, high-end audio/visuele apparatuur, interactieve displays en exclusieve consumentenelektronica op project- en specificatiebasis.",
      tags: isEn
        ? ["Smart Home", "High-End Audio/Visual", "Interactive Displays", "Custom Tech"]
        : ["Smart Home", "High-End Audio/Visueel", "Interactieve Displays", "Custom Tech"],
      image: "/images/custom-orders/electronics.jpg",
      highlight: isEn ? "Architectural Smart Integration" : "Architecturale Smart Integratie"
    },
    {
      id: 'modular',
      badge: isEn ? "Architecture & Modular" : "Architectuur & Modulair",
      title: isEn ? "Container & Modular Living Solutions" : "Containers & Modulaire Oplossingen",
      originalTitle: "Konteyner & Modüler Çözümler",
      description: isEn
        ? "High-end modular living units, bespoke architectural shipping container suites, luxury pop-up showrooms, glamping retreats, and prefabricated executive spaces."
        : "Luxe modulaire woonunits, architectonische containerconcepten, pop-up showrooms, glamping suites en geprefabriceerde kantoorruimtes met hoogwaardige isolatie en afwerking.",
      tags: isEn
        ? ["Modular Villas", "Luxury Container Suites", "Glamping Units", "Pop-up Showrooms"]
        : ["Modulaire Woningen", "Luxe Container Suites", "Glamping Units", "Pop-up Showrooms"],
      image: "/images/custom-orders/modular.jpg",
      highlight: isEn ? "Turnkey Prefab Architecture" : "Sleutelklare Prefab Bouw"
    },
    {
      id: 'furniture',
      badge: isEn ? "Design & Craftsmanship" : "Design & Vakmanschap",
      title: isEn ? "Bespoke Furniture & Living Concepts" : "Meubels & Interieurconcepten op Maat",
      originalTitle: "Mobilya & Yaşam Ürünleri",
      description: isEn
        ? "Custom travertine and marble dining tables, bespoke sectional sofas in curated upholstery, architectural wall paneling, and unique one-of-a-kind furniture designs."
        : "Maatwerk travertin en marmeren eettafels, exclusieve modulaire banken met custom stofferingen, wandpanelen en unieke meubelstukken naar exacte maatspecificaties.",
      tags: isEn
        ? ["Travertine Bespoke", "Luxury Upholstery", "Custom Dining Tables", "Architectural Wood"]
        : ["Travertin Maatwerk", "Luxe Bekleding", "Maatwerk Tafels", "Architecturaal Hout"],
      image: "/kitchen_marble_detail.png",
      highlight: isEn ? "100% Handcrafted Bespoke" : "100% Handgemaakt Maatwerk"
    },
    {
      id: 'project',
      badge: isEn ? "Turnkey & Development" : "Turnkey & Ontwerp",
      title: isEn ? "Project-Based Developments" : "Projectmatige Producten & Inrichting",
      originalTitle: "Proje Bazlı Ürünler",
      description: isEn
        ? "Full-spectrum turnkey furnishings for boutique hotels, fine dining restaurants, multi-unit residential projects, and private luxury villas with custom material curation."
        : "Turnkey interieur- en exterieurproducten voor hotels, restaurants, residentiële projecten en luxe villa's inclusief specifieke materiaalkeuze en installatiebegeleiding.",
      tags: isEn
        ? ["Hospitality & Hotels", "Luxury Villa Projects", "Turnkey Fit-Outs", "Material Curation"]
        : ["Hotel & Horeca", "Villa Projecten", "Turnkey Inrichting", "Materiaalselectie"],
      image: "/luxury_kitchen_hero.png",
      highlight: isEn ? "End-to-End Project Execution" : "Totale Projectbegeleiding"
    },
    {
      id: 'corporate',
      badge: isEn ? "B2B & Enterprise" : "B2B & Volume",
      title: isEn ? "Corporate & Bulk Procurement" : "Zakelijke & B2B Bulk Bestellingen",
      originalTitle: "Kurumsal & Toplu Siparişler",
      description: isEn
        ? "Large-scale commercial procurement, headquarters styling, executive gifting, and tiered volume discounts backed by a dedicated key account manager."
        : "Grootschalige inkoop, kantoorinrichtingen, relatiegeschenken en gestandaardiseerde leveringen met volumekortingen en toegewijd accountbeheer.",
      tags: isEn
        ? ["Volume Discounts", "Corporate Fit-Outs", "Dedicated Account Manager", "B2B Invoicing"]
        : ["Volumekorting", "Kantoorinrichting", "Dedicated Accountmanager", "Flexibele Facturatie"],
      image: "/showroom_consultation.png",
      highlight: isEn ? "Tiered B2B Volume Pricing" : "Staffelkortingen & B2B Facturatie"
    },
    {
      id: 'custom',
      badge: isEn ? "Exclusive & Bespoke" : "Exclusief & Uniek",
      title: isEn ? "Other Bespoke Requests" : "Overige Exclusieve Aanvragen",
      originalTitle: "Diğer Özel Talepler",
      description: isEn
        ? "Have a distinct vision, rare stone requirement, or unique international sourcing requirement? We bring unconventional and exclusive design concepts to reality."
        : "Heeft u een specifiek idee, uniek materiaal of een internationaal sourcingverzoek? Wij realiseren onconventionele en unieke productvragen over de hele wereld.",
      tags: isEn
        ? ["Global Sourcing", "Rare Materials", "Prototype Engineering", "Custom Solutions"]
        : ["Wereldwijde Sourcing", "Unieke Materialen", "Prototype Ontwikkeling", "Maatwerk Oplossingen"],
      image: "/showroom_materials.png",
      highlight: isEn ? "Global Bespoke Sourcing" : "Wereldwijde Maatwerk Sourcing"
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
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-primary-anthracite text-primary-ivory pt-24 pb-20">
        {/* Ambient background glow & pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent-oak/20 via-primary-anthracite/80 to-primary-anthracite z-0 pointer-events-none" />
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
            <span>{isEn ? "Bespoke & Custom Orders" : "Speciale Bestellingen & Maatwerk"}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-heading font-medium tracking-tight uppercase leading-[1.1] mb-6"
          >
            {isEn ? "Tailored Solutions for Every Need" : "Her İhtiyaca Özel Çözümler"}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-primary-ivory/80 font-sans leading-relaxed mb-10"
          >
            <p>
              {isEn 
                ? "Beyond our standard collections, we deliver bespoke orders and project solutions across diverse product categories for both individual and commercial clients."
                : "Standart ürünlerin ötesinde, bireysel ve kurumsal taleplere yönelik farklı ürün gruplarında özel sipariş ve proje çözümleri sunuyoruz."}
            </p>
            <p className="text-primary-ivory/60 text-sm sm:text-base">
              {isEn
                ? "Every inquiry is custom assessed, priced, and crafted to order with uncompromising quality."
                : "Her talep, ihtiyaçlara göre ayrı olarak değerlendirilir, fiyatlandırılır ve siparişe özel hazırlanır."}
            </p>
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
              {isEn ? "Request a Custom Quote" : "Özel Teklif İste"}
            </a>
            <a
              href="#categories-section"
              className="border border-white/30 text-primary-ivory hover:border-accent-oak hover:text-accent-oak transition-all px-8 py-4 text-xs font-bold uppercase tracking-[0.25em]"
            >
              {isEn ? "Explore Categories" : "Kategorileri İncele"}
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
              <p className="text-xs font-bold uppercase tracking-wider">{isEn ? "100% Bespoke Quality" : "%100 Özel Üretim"}</p>
              <p className="text-[11px] text-primary-ivory/60">{isEn ? "Tailored to specifications" : "İhtiyaca özel mühendislik"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe2 className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{isEn ? "Global Sourcing" : "Küresel Tedarik Ağı"}</p>
              <p className="text-[11px] text-primary-ivory/60">{isEn ? "Worldwide manufacturing" : "Doğrudan üreticiden tedarik"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{isEn ? "Fast Feasibility" : "Hızlı Fiyatlandırma"}</p>
              <p className="text-[11px] text-primary-ivory/60">{isEn ? "Quote within 24 hours" : "24 saatte detaylı teklif"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-accent-oak shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{isEn ? "B2B & Individual" : "B2B & Bireysel Çözüm"}</p>
              <p className="text-[11px] text-primary-ivory/60">{isEn ? "Flexible volume scaling" : "Kurumsal ve tekil siparişler"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 7 CATEGORIES SHOWCASE GRID */}
      <section id="categories-section" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-oak block mb-3">
            {isEn ? "Portfolio of Solutions" : "Özel Sipariş Portföyümüz"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-primary-anthracite">
            {isEn ? "Custom Order Categories" : "Özel Sipariş Kategorileri"}
          </h2>
          <div className="w-16 h-0.5 bg-accent-oak mx-auto mt-4 mb-6" />
          <p className="text-primary-anthracite/70 text-sm sm:text-base">
            {isEn 
              ? "Select any category to view project scope and request immediate tailored pricing for your residential or commercial requirements."
              : "Aşağıdaki ürün gruplarından ihtiyacınıza uygun olanı seçebilir, detaylı bilgi ve anında özel teklif alabilirsiniz."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const isFeatured = index === 0 || index === 2;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`group relative bg-white border border-primary-anthracite/10 rounded-lg overflow-hidden flex flex-col shadow-md hover:shadow-2xl transition-all duration-500 ${
                  isFeatured ? 'md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                {/* Image Container */}
                <div className="relative h-60 w-full overflow-hidden bg-primary-anthracite/5">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Category Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-anthracite/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    {iconMap[cat.id]}
                    <span>{cat.badge}</span>
                  </div>

                  {/* Highlight pill */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-accent-oak font-semibold">
                      {cat.highlight}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-heading uppercase tracking-wide text-primary-anthracite mb-2 group-hover:text-accent-oak transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-primary-anthracite/50 font-bold uppercase tracking-widest mb-3">
                      {cat.originalTitle}
                    </p>
                    <p className="text-sm text-primary-anthracite/75 font-sans leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cat.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[10px] uppercase tracking-wider font-semibold bg-primary-ivory px-2.5 py-1 rounded text-primary-anthracite/70 border border-primary-anthracite/10"
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
                      <span>{isEn ? "Request Quote for This" : "Bu Kategori İçin Teklif İste"}</span>
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
              {isEn ? "4-Step Process" : "4 Adımda Özel Sipariş Süreci"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase tracking-wide text-primary-ivory">
              {isEn ? "From Inquiry to Delivery" : "Talepten Teslimata Kusursuz Süreç"}
            </h2>
            <div className="w-16 h-0.5 bg-accent-oak mx-auto mt-4 mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: isEn ? "Inquiry & Spec" : "Talep & İhtiyaç Analizi",
                desc: isEn 
                  ? "Share your desired product concept, volume requirements, and specific design/technical criteria with our concierge."
                  : "İstediğiniz ürün grubunu, teknik özellikleri, adet ve proje detaylarını bize iletin."
              },
              {
                step: "02",
                title: isEn ? "Engineering & Quote" : "Fiyatlandırma & Projelendirme",
                desc: isEn
                  ? "Our engineers verify feasibility, source premium materials, and deliver a transparent fixed-price proposal within 24 hours."
                  : "Uzmanlarımız teknik fizibilite ve maliyet çalışmasını yaparak 24 saat içinde size özel teklif sunar."
              },
              {
                step: "03",
                title: isEn ? "Custom Manufacturing" : "Siparişe Özel Üretim",
                desc: isEn
                  ? "Production is initiated with milestone progress reports, material verification, and strict European quality standards."
                  : "Onayınız ile birlikte siparişinize özel üretim süreci başlatılır ve aşamalar düzenli olarak raporlanır."
              },
              {
                step: "04",
                title: isEn ? "Delivery & Handover" : "Güvenli Teslimat",
                desc: isEn
                  ? "Insured white-glove transport directly to your private residence, development site, or corporate facility."
                  : "Sigortalı lojistik, gümrükleme ve talep halinde yerinde montaj ile ürünleriniz anahtar teslim ulaştırılır."
              }
            ].map((stepItem, idx) => (
              <div 
                key={idx}
                className="relative bg-white/5 border border-white/10 p-8 rounded-lg space-y-4 hover:border-accent-oak/50 transition-colors"
              >
                <div className="text-4xl font-heading font-bold text-accent-oak/80">
                  {stepItem.step}
                </div>
                <h3 className="text-lg font-heading uppercase tracking-wider text-white">
                  {stepItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-primary-ivory/70 leading-relaxed">
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE INQUIRY FORM SECTION ("Aradığınız ürün listede yok mu?") */}
      <section id="quote-form-section" className="py-24 max-w-5xl mx-auto px-6">
        <div className="bg-white border border-primary-anthracite/15 rounded-xl shadow-2xl p-8 sm:p-12 md:p-16">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-accent-oak/10 text-accent-oak text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
              {isEn ? "Direct Concierge Inquiry" : "Özel Teklif & Sipariş Formu"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading uppercase tracking-wide text-primary-anthracite mb-4">
              {isEn ? "Can't Find What You're Looking For?" : "Aradığınız ürün listede yok mu?"}
            </h2>
            <p className="text-primary-anthracite/75 text-sm sm:text-base leading-relaxed">
              {isEn
                ? "Share your requirements with us. We will prepare a personalized quotation based on your exact product, quantity, and delivery timeline."
                : "Talebinizi bizimle paylaşın. Ürün, adet ve teslimat detaylarına göre size özel teklif hazırlayalım."}
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
                {isEn ? "Inquiry Successfully Submitted!" : "Talebiniz Başarıyla Alındı!"}
              </h3>
              <p className="text-primary-anthracite/80 max-w-md mx-auto text-sm sm:text-base">
                {isEn 
                  ? "Thank you for reaching out. Our project specialist will analyze your specifications and send a tailored quotation within 24 hours."
                  : "Özel sipariş talebiniz uzman ekibimize iletildi. 24 saat içerisinde teknik ve mali teklifimizle size dönüş yapacağız."}
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="bg-primary-anthracite text-white hover:bg-accent-oak transition-colors px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]"
              >
                {isEn ? "Submit Another Request" : "Yeni Bir Talep Gönder"}
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
                    {isEn ? "Product Group / Category *" : "Ürün Grubu / Kategori *"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  >
                    <option value="mobility">Elektrikli Araçlar & Mobilite (Electric Vehicles & Mobility)</option>
                    <option value="electronics">Elektronik Ürünler (Consumer & Smart Electronics)</option>
                    <option value="modular">Konteyner & Modüler Çözümler (Container & Modular Living)</option>
                    <option value="furniture">Mobilya & Yaşam Ürünleri (Bespoke Furniture & Living)</option>
                    <option value="project">Proje Bazlı Ürünler (Project-Based Developments)</option>
                    <option value="corporate">Kurumsal & Toplu Siparişler (Corporate & Bulk Procurement)</option>
                    <option value="custom">Diğer Özel Talepler (Other Bespoke Requests)</option>
                  </select>
                </div>

                {/* Desired Product Name / Concept */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {isEn ? "Desired Product / Concept *" : "İstenen Ürün / Proje Adı *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g. 4-Seater Luxury Golf Cart / Modular Studio" : "Örn: 4 Kişilik Lüks Golf Arabası / Modüler Ofis"}
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
                    {isEn ? "Quantity / Volume *" : "Adet / Miktar *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g. 1 unit, 50 units" : "Örn: 1 adet / 20 adet"}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>

                {/* Full Name / Company Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {isEn ? "Full Name / Company *" : "Ad Soyad / Firma Ünvanı *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "John Doe or Company B.V." : "Adınız veya Şirket Adı"}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                    {isEn ? "Email Address *" : "E-posta Adresi *"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@sirket.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                  {isEn ? "Phone / WhatsApp Number (Optional)" : "Telefon / WhatsApp Numarası (Opsiyonel)"}
                </label>
                <input
                  type="tel"
                  placeholder="+31 6 ... veya +90 5..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-primary-ivory border border-primary-anthracite/20 px-4 py-3.5 text-sm text-primary-anthracite focus:outline-none focus:border-accent-oak transition-colors rounded"
                />
              </div>

              {/* Detailed Message / Specs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-anthracite mb-2">
                  {isEn ? "Detailed Project Specifications & Requirements *" : "Talebinizin Detayları & Proje Notları *"}
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={isEn 
                    ? "Please describe dimensions, material choices, delivery location, special customizations, and target deadline..."
                    : "Lütfen ürünün ölçüleri, teknik beklentiler, malzeme tercihleri, teslim edilecek şehir/ülke ve hedef teslim tarihi gibi detayları belirtin..."}
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
                {isSubmitting 
                  ? (isEn ? "Submitting Inquiry..." : "Teklif Talebi Gönderiliyor...") 
                  : (isEn ? "Submit Custom Order Request" : "Özel Teklif Talebini Gönder")}
              </button>
            </form>
          )}

          {/* Alternative Quick Contact Bar */}
          <div className="mt-12 pt-8 border-t border-primary-anthracite/10 flex flex-wrap items-center justify-between gap-6 text-xs uppercase tracking-wider font-bold text-primary-anthracite/70">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-accent-oak" />
              <span>info@01living.nl</span>
            </div>
            
            <a 
              href="https://wa.me/31638230747?text=Merhaba,%20ozel%20siparis%20hakkinda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageSquare size={16} />
              <span>{isEn ? "WhatsApp Direct Chat" : "WhatsApp Hızlı İletişim (+31 6 3823 0747)"}</span>
            </a>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-accent-oak" />
              <span>{isEn ? "Showroom The Hague" : "Den Haag Showroom"}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
