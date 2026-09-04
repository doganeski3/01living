export type LocaleKey = 'en' | 'nl';

export interface B2BLogisticsContent {
  nav: {
    brandSubtitle: string;
    services: string;
    pipeline: string;
    showroom: string;
    advantages: string;
    contact: string;
    ctaQuote: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    liveBadge: string;
    videoTitle: string;
    stats: {
      stat1: { value: string; label: string; desc: string };
      stat2: { value: string; label: string; desc: string };
      stat3: { value: string; label: string; desc: string };
      stat4: { value: string; label: string; desc: string };
    };
  };
  pipeline: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      badge: string;
      description: string;
      highlights: string[];
    }>;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      specs: string[];
      icon: string;
      bgGradient: string;
    }>;
  };
  comparison: {
    badge: string;
    title: string;
    subtitle: string;
    traditionalTitle: string;
    traditionalSubtitle: string;
    traditionalPoints: string[];
    zeroOneTitle: string;
    zeroOneSubtitle: string;
    zeroOneBadge: string;
    zeroOnePoints: string[];
    summaryNote: string;
  };
  leadForm: {
    badge: string;
    title: string;
    subtitle: string;
    labels: {
      fullName: string;
      companyName: string;
      email: string;
      phone: string;
      services: string;
      volume: string;
      message: string;
    };
    placeholders: {
      fullName: string;
      companyName: string;
      email: string;
      phone: string;
      message: string;
    };
    serviceOptions: Array<{ id: string; label: string }>;
    volumeOptions: Array<{ value: string; label: string }>;
    buttonIdle: string;
    buttonLoading: string;
    successTitle: string;
    successMessage: string;
    resetButton: string;
    errorMessage: string;
    privacyNote: string;
  };
  sidebarContact: {
    title: string;
    subtitle: string;
    warehouse1Title: string;
    warehouse1Address: string;
    warehouse2Title: string;
    warehouse2Address: string;
    nlPhoneLabel: string;
    nlPhoneValue: string;
    trPhoneLabel: string;
    trPhoneValue: string;
    emailLabel: string;
    emailValue: string;
    hoursTitle: string;
    hoursValue: string;
    whatsappButton: string;
  };
  footer: {
    company: string;
    description: string;
    rights: string;
    locations: string;
    compliance: string;
  };
}

export const b2bLogisticsTranslations: Record<LocaleKey, B2BLogisticsContent> = {
  en: {
    nav: {
      brandSubtitle: 'European Logistics & Representation Hub',
      services: 'Services',
      pipeline: 'Fulfillment Pipeline',
      showroom: 'Showroom',
      advantages: 'Why 01 Living',
      contact: 'Contact & Hub',
      ctaQuote: 'Request B2B Proposal',
    },
    hero: {
      badge: 'Netherlands Operations Center • 1,600 m² Logistics Hub',
      titleStart: 'Expand Into Europe Without Boundaries: ',
      titleHighlight: '1,600 m² Warehousing,',
      titleEnd: ' Fulfillment & B2B Representation',
      subtitle:
        'Eliminate European subsidiary setup, local payroll overhead, and storage lease liabilities. We provide Turkish and international manufacturers with a turnkey commercial sales force, high-rack warehousing in The Hague, and pan-European distribution channels.',
      primaryCta: 'Request Custom Proposal',
      secondaryCta: 'Explore Fulfillment Pipeline',
      liveBadge: 'THE HAGUE HUB • ACTIVE OPERATIONS',
      videoTitle: '01 Living Logistics Center • Den Haag, Netherlands',
      stats: {
        stat1: {
          value: '1,600 m²',
          label: 'Indoor Warehouse Area',
          desc: 'High-rack pallet & carton storage facility',
        },
        stat2: {
          value: 'Bol.com & EU',
          label: 'Marketplace Integration',
          desc: 'Seamless wholesale & online merchant operations',
        },
        stat3: {
          value: 'Den Haag',
          label: 'Strategic EU Gateway',
          desc: 'Fast delivery reach to NL, BE, DE, FR & UK',
        },
        stat4: {
          value: '0 €',
          label: 'Entity & Hiring Costs',
          desc: 'Zero legal company formation or staffing risk',
        },
      },
    },
    pipeline: {
      badge: 'END-TO-END SUPPLY CHAIN',
      title: 'Step-by-Step Logistics & Fulfillment Pipeline',
      subtitle:
        'From customs discharge at European ports to final doorstep delivery across 27 EU member states, every phase is managed with precision, speed, and real-time tracking.',
      steps: [
        {
          number: '01',
          title: 'Inbound & 1,600 m² Storage',
          badge: 'Reception & Inspection',
          description:
            'Container arrival, customs clearance verification, quality audit, SKU barcoding, pallet allocation, and precision high-rack placement in our secure The Hague facility.',
          highlights: [
            'Damage & quantity protocol verification',
            'GS1 / EAN barcode integration & labeling',
            'Dedicated pallet rack & carton zone assignment',
          ],
        },
        {
          number: '02',
          title: 'Sales Channels & Commercial Representation',
          badge: 'Active B2B Sales',
          description:
            'Active commercial representation in the Benelux and DACH regions. We present your catalog to wholesale buyers, interior designers, and execute automated Bol.com catalog operations.',
          highlights: [
            'Direct B2B buyer outreach & contract negotiation',
            'Bol.com official vendor & fulfillment management',
            'Architect & project contractor showroom presentations',
          ],
        },
        {
          number: '03',
          title: 'Automated Pick, Pack & Labeling',
          badge: 'Fulfillment Execution',
          description:
            'Upon automated order injection, goods are picked via optimized warehouse pathing, packed according to European transport standards, and labeled for courier dispatch.',
          highlights: [
            'Fast order dispatch within European cut-off times',
            'Shock-proof protective packaging & pallet wrapping',
            'Automated carrier label printing (PostNL, DHL, DPD, GLS)',
          ],
        },
        {
          number: '04',
          title: 'European Delivery & Transparent Reporting',
          badge: 'Final Mile & Analytics',
          description:
            '24 to 48-hour delivery across key European markets. Reverse logistics handling, returned item inspection, and transparent weekly inventory & revenue reporting.',
          highlights: [
            '24-48h expedited delivery across NL, BE, DE, FR',
            'Comprehensive return logistics & quality grading',
            'Transparent inventory status & sales disbursement audits',
          ],
        },
      ],
    },
    services: {
      badge: 'CORE B2B CAPABILITIES',
      title: 'Turnkey Infrastructure Modules',
      subtitle:
        'Choose modular services tailored to your expansion stage: from pallet-only storage to full commercial agency and marketplace automation.',
      items: [
        {
          id: 'fulfillment',
          badge: 'Infrastructure',
          title: 'Fulfillment & High-Rack Storage',
          description:
            'Our 1,600 m² covered logistics facility in Den Haag offers modular storage for standard Euro-pallets (80x120), industrial pallets (100x120), and carton volume with modern reach trucks.',
          specs: [
            '1,600 m² dry, heated, and 24/7 CCTV monitored space',
            'Heavy-duty reach trucks & electric pallet stackers',
            'Flexible pay-as-you-grow pallet capacity',
            'Customs bonded handling & container unbagging',
          ],
          icon: 'Boxes',
          bgGradient: 'from-amber-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'representation',
          badge: 'Commercial Expansion',
          title: 'European B2B Representation & Field Sales',
          description:
            'Native Dutch and English speaking commercial specialists represent your brand in the Netherlands, Belgium, Germany, and beyond. We establish wholesale buyer and distributor channels.',
          specs: [
            'Dedicated field commercial manager for buyer meetings',
            'Wholesale pricing strategy & contract negotiations',
            'Bilingual customer communication and invoicing support',
            'Active outreach to retail chains, hotels, and designers',
          ],
          icon: 'Briefcase',
          bgGradient: 'from-blue-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'showroom',
          badge: 'Physical Presence',
          title: 'Luxury Architectural Showroom & Samples',
          description:
            'Give European decision-makers tangible confidence. Exhibit your architectural products, furniture, or design materials inside our Den Haag corporate design showroom.',
          specs: [
            'Physical sample display & material library',
            'Meeting rooms available for VIP client presentations',
            'Professional product presentation by our on-site team',
            'Located in De Werf business park with easy highway access',
          ],
          icon: 'Sparkles',
          bgGradient: 'from-emerald-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'ecommerce',
          badge: 'Online Growth',
          title: 'E-Commerce & Bol.com Marketplace Ops',
          description:
            'Full management of your European marketplace footprint on Bol.com, Amazon EU, and proprietary B2B merchant portals with automated stock synchronization.',
          specs: [
            'Official Bol.com vendor onboarding & SEO listings',
            'Same-day pick-and-pack fulfillment adhering to marketplace SLAs',
            'First-line Dutch and English customer service management',
            'Consolidated VAT invoicing & payment clearing',
          ],
          icon: 'ShoppingCart',
          bgGradient: 'from-purple-500/10 via-neutral-900 to-neutral-950',
        },
      ],
    },
    comparison: {
      badge: 'STRATEGIC ADVANTAGE',
      title: 'Why Partner with 01 Living?',
      subtitle:
        'A side-by-side comparison between setting up an independent European subsidiary versus partnering with 01 Living B.V.',
      traditionalTitle: 'Traditional European Expansion',
      traditionalSubtitle: 'High Capital Expenditure & Heavy Legal Burden',
      traditionalPoints: [
        'Mandatory Dutch BV incorporation & notary fees (€5,000 - €15,000+)',
        'Compulsory local employment contracts, pension plans, and Dutch labor tax',
        'Long-term warehouse lease commitments (minimum 3 to 5-year lock-in)',
        'Complex local bookkeeping, VAT compliance, and legal liability risk',
        'Language and cultural barriers negotiating with Benelux B2B buyers',
      ],
      zeroOneTitle: '01 Living Turnkey Partnership',
      zeroOneSubtitle: 'Immediate Market Entry with Performance Alignment',
      zeroOneBadge: 'RECOMMENDED BY EXPORTERS',
      zeroOnePoints: [
        'Instant operational launch using 01 Living B.V. Dutch infrastructure',
        '1,600 m² modern warehouse & showroom ready in Den Haag from Day 1',
        'Transparent fixed operational service fee + performance success commission',
        'Native Dutch & English commercial team handling sales and customer care',
        'Zero long-term real estate lock-in; flexible scaling based on inventory volume',
      ],
      summaryNote:
        'Save over €120,000 in first-year fixed overhead while beginning immediate sales across the European Union.',
    },
    leadForm: {
      badge: 'START YOUR EXPANSION',
      title: 'Request a B2B Proposal & Capacity Check',
      subtitle:
        'Tell us about your product categories and operational requirements. Our Dutch commercial leadership will review your requirements and provide a customized proposal within 24 business hours.',
      labels: {
        fullName: 'Authorized Contact Name',
        companyName: 'Company / Brand Name',
        email: 'Corporate Email Address',
        phone: 'Phone Number',
        services: 'Required Solutions (Select all that apply)',
        volume: 'Estimated Monthly Storage / Shipment Volume',
        message: 'Product Details & Special Requirements',
      },
      placeholders: {
        fullName: 'e.g. Alexander van den Berg',
        companyName: 'e.g. Nordic Ceramics Ltd.',
        email: 'alexander@company.com',
        phone: '6 38 23 07 47',
        message:
          'Please describe your product catalog, packaging dimensions, target European markets, or timeline...',
      },
      serviceOptions: [
        { id: 'storage', label: 'Warehousing & Pallet Storage' },
        { id: 'fulfillment', label: 'Pick, Pack & Pan-EU Delivery' },
        { id: 'bol_ecommerce', label: 'Bol.com & E-Commerce Integration' },
        { id: 'b2b_sales', label: 'B2B Sales & Field Representation' },
        { id: 'showroom', label: 'Showroom Sample Display' },
        { id: 'customs', label: 'Customs Clearance & Inbound Receiving' },
      ],
      volumeOptions: [
        { value: '1-10', label: '1 - 10 Pallets (Trial / Initial Inbound)' },
        { value: '11-50', label: '11 - 50 Pallets (Medium Stock)' },
        { value: '51-150', label: '51 - 150 Pallets (Full Scale Storage)' },
        { value: '150+', label: '150+ Pallets (Dedicated Storage Bay)' },
        { value: 'parcel-only', label: 'Parcel / Carton High-Turnover E-Commerce' },
      ],
      buttonIdle: 'Submit B2B Capacity Request',
      buttonLoading: 'Processing Request...',
      successTitle: 'Inquiry Successfully Received',
      successMessage:
        'Thank you for reaching out. Our Dutch logistics directorate has received your details and will get in touch with a customized quote and capacity breakdown within 24 hours.',
      resetButton: 'Submit Another Inquiry',
      errorMessage:
        'There was an issue submitting your request. Please try again or reach out directly via WhatsApp or telephone.',
      privacyNote:
        'Your business information is strictly confidential and protected under Dutch and European GDPR data regulations.',
    },
    sidebarContact: {
      title: 'Den Haag Logistics Hub',
      subtitle: 'Visit our operations center or discuss your project directly with our leadership.',
      warehouse1Title: 'Operations Hub & Warehouse 1',
      warehouse1Address: 'De Werf 15, Zinkwerf 24 A, 2544 EH Den Haag, Netherlands',
      warehouse2Title: 'Showroom & Warehouse 2',
      warehouse2Address: 'De Werf 10, 2544 EK Den Haag, Netherlands',
      nlPhoneLabel: 'Netherlands Direct (HQ)',
      nlPhoneValue: '+31 6 38 23 07 47',
      trPhoneLabel: 'Turkey Commercial Liaison',
      trPhoneValue: '+90 543 340 82 64',
      emailLabel: 'Inquiries & Proposals',
      emailValue: 'info@01living.nl',
      hoursTitle: 'Operating Hours (CET)',
      hoursValue: 'Monday – Friday: 09:00 – 18:00 | Saturday: 10:00 – 16:00',
      whatsappButton: 'Chat with Commercial Team on WhatsApp',
    },
    footer: {
      company: '01 Living B.V. • Registered in the Netherlands (Est. 2021)',
      description:
        'Premium European fulfillment, commercial representation, and logistics hub bridging global manufacturing with Western European markets.',
      rights: 'All rights reserved.',
      locations: 'Logistics Hub: Den Haag | Port of Rotterdam Corridor',
      compliance: 'Dutch Chamber of Commerce (KVK) & EU VAT Registered',
    },
  },
  nl: {
    nav: {
      brandSubtitle: 'Europees Logistiek & Vertegenwoordigingscentrum',
      services: 'Diensten',
      pipeline: 'Fulfillment Proces',
      showroom: 'Showroom',
      advantages: 'Waarom 01 Living',
      contact: 'Contact & Hub',
      ctaQuote: 'Vraag B2B Offerte Aan',
    },
    hero: {
      badge: 'Nederlands Operatiecentrum • 1.600 m² Logistieke Hub',
      titleStart: 'Breid Zonder Grenzen Uit Naar Europa: ',
      titleHighlight: '1.600 m² Warehousing,',
      titleEnd: ' Fulfillment & B2B Vertegenwoordiging',
      subtitle:
        'Elimineer de kosten en risico’s van een eigen dochteronderneming, lokaal personeel en langlopende huurcontracten. Wij bieden Turkse en internationale fabrikanten een kant-en-klaar commercieel verkoopteam, hoogbouwopslag in Den Haag en pan-Europese distributie.',
      primaryCta: 'Vraag B2B Voorstel Aan',
      secondaryCta: 'Ontdek Ons Logistiek Proces',
      liveBadge: 'DEN HAAG HUB • ACTIEVE OPERATIES',
      videoTitle: '01 Living Logistiek Centrum • Den Haag, Nederland',
      stats: {
        stat1: {
          value: '1.600 m²',
          label: 'Overdekte Opslagruimte',
          desc: 'Moderne hoogbouwstellingen voor pallets en dozen',
        },
        stat2: {
          value: 'Bol.com & EU',
          label: 'Marktplaats Koppeling',
          desc: 'Naadloze groothandel- en e-commerce integratie',
        },
        stat3: {
          value: 'Den Haag',
          label: 'Strategische Distributiehub',
          desc: 'Snelle levertijden naar NL, BE, DE, FR en het VK',
        },
        stat4: {
          value: '0 €',
          label: 'Vaste Oprichtingskosten',
          desc: 'Geen juridische entiteits- of personeelsrisico’s',
        },
      },
    },
    pipeline: {
      badge: 'VOLLEDIGE KETENBEHEERSING',
      title: 'Stap-voor-Stap Logistiek & Fulfillment Proces',
      subtitle:
        'Van douanevrijgave in Europese havens tot aflevering bij B2B- en retailklanten in heel Europa: elke schakel wordt gecontroleerd met maximale snelheid en transparantie.',
      steps: [
        {
          number: '01',
          title: 'Inslag & 1.600 m² Opslag',
          badge: 'Ontvangst & Controle',
          description:
            'Aankomst van containers/vrachtwagens, verificatie van douanedocumenten, kwaliteitsinspectie, SKU-barcodering en efficiënte plaatsing in onze stellingen in Den Haag.',
          highlights: [
            'Grondige fysieke controle op schades en aantallen',
            'GS1 / EAN barcode etikettering en registratie',
            'Plaatsing op speciale pallet- en dooslocaties',
          ],
        },
        {
          number: '02',
          title: 'Verkoopkanalen & Commerciële Vertegenwoordiging',
          badge: 'Actieve B2B Verkoop',
          description:
            'Commerciële vertegenwoordiging in de Benelux en DACH-regio. Wij presenteren uw collectie aan inkopers, architecten en beheren geautomatiseerde Bol.com catalogi.',
          highlights: [
            'Direct contact met groothandels en contractonderhandelingen',
            'Officieel beheer van Bol.com verkopersaccount en fulfillment',
            'Presentaties voor architecten en projectinrichters in onze showroom',
          ],
        },
        {
          number: '03',
          title: 'Geautomatiseerde Pick, Pack & Etikettering',
          badge: 'Fulfillment Uitvoering',
          description:
            'Zodra een bestelling binnenkomt, wordt deze via geoptimaliseerde routes verzameld, schokbestendig verpakt volgens Europese normen en verzendklaar gemaakt.',
          highlights: [
            'Snelle orderverwerking binnen Europese verzendtijden',
            'Professionele beschermende verpakking en palletsealing',
            'Automatische aanmaak van verzendlabels (PostNL, DHL, DPD, GLS)',
          ],
        },
        {
          number: '04',
          title: 'Europese Levering & Transparante Rapportage',
          badge: 'Bezorging & Inzicht',
          description:
            'Snelle levering binnen 24-48 uur in de belangrijkste Europese markten. Volledige retourlogistiek, kwaliteitsbeoordeling en wekelijkse voorraad- en omzetrapportages.',
          highlights: [
            '24 tot 48 uur levering in Nederland, België, Duitsland en Frankrijk',
            'Professionele retourverwerking en kwaliteitscontrole',
            'Transparante rapportages van voorraadniveaus en verkoopcijfers',
          ],
        },
      ],
    },
    services: {
      badge: 'ONZE DIENSTEN',
      title: 'Complete B2B Infrastructuur Modules',
      subtitle:
        'Kies de modulaire diensten die aansluiten bij uw groeistrategie: van flexibele palletopslag tot volledige commerciële verkoop en marktplaatsautomatisering.',
      items: [
        {
          id: 'fulfillment',
          badge: 'Infrastructuur',
          title: 'Fulfillment & Hoogbouwopslag',
          description:
            'Onze moderne 1.600 m² logistieke faciliteit in Den Haag biedt flexibele opslag voor standaard Europallets (80x120), blokpallets (100x120) en bulkdozen met geavanceerde reachtrucks.',
          specs: [
            '1.600 m² droge, beveiligde ruimte met 24/7 cameratoezicht',
            'Zware reachtrucks en elektrische stapelaars',
            'Flexibele palletcapaciteit die meegroeit met uw vraag',
            'Douaneafhandeling en professioneel lossen van containers',
          ],
          icon: 'Boxes',
          bgGradient: 'from-amber-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'representation',
          badge: 'Commerciële Groei',
          title: 'Europese B2B Vertegenwoordiging & Sales',
          description:
            'Nederlands- en Engelstalige accountmanagers vertegenwoordigen uw merk in Nederland, België, Duitsland en omstreken. Wij bouwen een duurzaam dealernetwerk op.',
          specs: [
            'Toegewijde commerciële vertegenwoordiger voor klantbezoeken',
            'Prijsstrategieën en contractonderhandelingen met groothandels',
            'Lokale communicatie en facturatieondersteuning in het Nederlands',
            'Gerichte acquisitie bij retailers, projectontwikkelaars en designers',
          ],
          icon: 'Briefcase',
          bgGradient: 'from-blue-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'showroom',
          badge: 'Fysieke Presentatie',
          title: 'Luxe Showroom & Monsterbeheer',
          description:
            'Bied Europese zakelijke beslissers tastbaar vertrouwen. Toon uw interieurproducten, architectonische monsters en meubilair in onze professionele showroom in Den Haag.',
          specs: [
            'Fysieke presentatie van monsters en stalenbibliotheek',
            'Vergaderruimtes beschikbaar voor VIP-klanten en projectbesprekingen',
            'Vakkundige producttoelichting door ons lokale team',
            'Gelegen op bedrijventerrein De Werf met uitstekende bereikbaarheid',
          ],
          icon: 'Sparkles',
          bgGradient: 'from-emerald-500/10 via-neutral-900 to-neutral-950',
        },
        {
          id: 'ecommerce',
          badge: 'Online Marktplaatsen',
          title: 'E-Commerce & Bol.com Operatie',
          description:
            'Volledige ontzorging van uw verkoop op Bol.com, Amazon Europa en zakelijke portals met geautomatiseerde voorraadsynchronisatie en snelle levering.',
          specs: [
            'Aanmaken en optimaliseren van Bol.com productvermeldingen',
            'Same-day fulfillment conform strenge marktplaats-normen (SLA)',
            'Eerstelijns klantenservice in het Nederlands en Engels',
            'Gezamenlijke btw-conforme facturatie en uitbetalingen',
          ],
          icon: 'ShoppingCart',
          bgGradient: 'from-purple-500/10 via-neutral-900 to-neutral-950',
        },
      ],
    },
    comparison: {
      badge: 'STRATEGISCH VOORDEEL',
      title: 'Waarom Kiezen Voor 01 Living?',
      subtitle:
        'Een directe vergelijking tussen het zelfstandig oprichten van een Europese dochteronderneming versus samenwerken met 01 Living B.V.',
      traditionalTitle: 'Traditionele Europese Expansie',
      traditionalSubtitle: 'Hoge Kosten & Complexe Regelgeving',
      traditionalPoints: [
        'Hoge notariskosten en oprichtingskosten voor een Nederlandse BV (€5.000 - €15.000+)',
        'Verplichte lokale salarisadministratie, pensioenen en sociale lasten',
        'Langlopende huurcontracten voor opslagruimte (vaak 3 tot 5 jaar vast)',
        'Complexe lokale boekhouding, btw-aangiftes en juridische risico’s',
        'Taal- en cultuurbarrières bij onderhandelingen met Benelux inkopers',
      ],
      zeroOneTitle: '01 Living Samenwerkingsmodel',
      zeroOneSubtitle: 'Directe Markttoegang Zonder Vaste Risico’s',
      zeroOneBadge: 'AANBEVOLEN VOOR EXPORTEURS',
      zeroOnePoints: [
        'Direct operationeel gebruik van de Nederlandse infrastructuur van 01 Living B.V.',
        '1.600 m² modern magazijn en showroom in Den Haag per direct beschikbaar',
        'Vaste maandelijkse beheervergoeding + prestatiecommissie over behaalde omzet',
        'Nederlands- en Engelstalig verkoopteam voor directe marktbenadering',
        'Geen langetermijn vastgoedverplichtingen; flexibel meegroeien met uw volume',
      ],
      summaryNote:
        'Bespaar meer dan €120.000 aan vaste opstartkosten in het eerste jaar en start direct met verkopen in heel Europa.',
    },
    leadForm: {
      badge: 'START UW EXPANSIE',
      title: 'Vraag een B2B Offerte & Capaciteitscheck Aan',
      subtitle:
        'Deel uw productassortiment en logistieke wensen met ons. Ons commerciële management in Nederland neemt binnen 24 werkuren contact met u op voor een voorstel op maat.',
      labels: {
        fullName: 'Naam Bevoegde Contactpersoon',
        companyName: 'Bedrijfsnaam / Merk',
        email: 'Zakelijk E-mailadres',
        phone: 'Telefoonnummer',
        services: 'Gewenste Diensten (Meerdere keuzes mogelijk)',
        volume: 'Geschat Maandelijks Opslag- of Verzendvolume',
        message: 'Productdetails & Specifieke Vereisten',
      },
      placeholders: {
        fullName: 'bijv. Jan de Vries',
        companyName: 'bijv. Anatolia Design Meubels B.V.',
        email: 'jandevries@bedrijf.nl',
        phone: '6 38 23 07 47',
        message:
          'Geef een korte toelichting op uw producten, verpakkingsafmetingen, gewenste doellanden of planning...',
      },
      serviceOptions: [
        { id: 'storage', label: 'Warehousing & Palletopslag' },
        { id: 'fulfillment', label: 'Orderpicking, Verpakken & Distributie' },
        { id: 'bol_ecommerce', label: 'Bol.com & E-Commerce Beheer' },
        { id: 'b2b_sales', label: 'B2B Verkoop & Commerciële Vertegenwoordiging' },
        { id: 'showroom', label: 'Showroom Presentatie & Monsterbeheer' },
        { id: 'customs', label: 'Douanevrijgave & Container Inslag' },
      ],
      volumeOptions: [
        { value: '1-10', label: '1 - 10 Pallets (Start / Eerste Inslag)' },
        { value: '11-50', label: '11 - 50 Pallets (Middelgrote Voorraad)' },
        { value: '51-150', label: '51 - 150 Pallets (Volledige Opslagruimte)' },
        { value: '150+', label: '150+ Pallets (Toegewijde Halcapaciteit)' },
        { value: 'parcel-only', label: 'Pakketgoed / Snel roterende E-Commerce' },
      ],
      buttonIdle: 'Verstuur B2B Aanvraag',
      buttonLoading: 'Verwerken van aanvraag...',
      successTitle: 'Aanvraag Succesvol Ontvangen',
      successMessage:
        'Hartelijk dank voor uw aanvraag. Ons directieteam in Den Haag heeft uw gegevens ontvangen en neemt binnen 24 uur contact met u op met een passend capaciteits- en tariefvoorstel.',
      resetButton: 'Nieuwe Aanvraag Indienen',
      errorMessage:
        'Er is een probleem opgetreden bij het versturen. Probeer het opnieuw of neem direct contact op via WhatsApp of telefoon.',
      privacyNote:
        'Uw bedrijfsgegevens worden strikt vertrouwelijk behandeld conform de Nederlandse en Europese AVG/GDPR wetgeving.',
    },
    sidebarContact: {
      title: 'Den Haag Logistieke Hub',
      subtitle: 'Bezoek ons operatiecentrum of bespreek uw expansieplannen direct met onze directie.',
      warehouse1Title: 'Operatiecentrum & Magazijn 1',
      warehouse1Address: 'De Werf 15, Zinkwerf 24 A, 2544 EH Den Haag, Nederland',
      warehouse2Title: 'Showroom & Magazijn 2',
      warehouse2Address: 'De Werf 10, 2544 EK Den Haag, Nederland',
      nlPhoneLabel: 'Nederland Direct (Hoofdkantoor)',
      nlPhoneValue: '+31 6 38 23 07 47',
      trPhoneLabel: 'Turkije Commercieel Contact',
      trPhoneValue: '+90 543 340 82 64',
      emailLabel: 'Informatie & Offertes',
      emailValue: 'info@01living.nl',
      hoursTitle: 'Openingstijden (CET)',
      hoursValue: 'Maandag – Vrijdag: 09:00 – 18:00 | Zaterdag: 10:00 – 16:00',
      whatsappButton: 'Chat Direct met Ons Team via WhatsApp',
    },
    footer: {
      company: '01 Living B.V. • Gevestigd in Nederland (Opgericht 2021)',
      description:
        'Hoogwaardige Europese fulfillment, commerciële vertegenwoordiging en logistieke hub die internationale fabrikanten verbindt met West-Europese markten.',
      rights: 'Alle rechten voorbehouden.',
      locations: 'Logistieke Hub: Den Haag | Haven van Rotterdam Corridors',
      compliance: 'Ingeschreven bij de Kamer van Koophandel (KVK) & Btw-geregistreerd',
    },
  },
};
