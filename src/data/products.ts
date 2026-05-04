export interface Product {
  id: string;
  name: {
    nl: string;
    en: string;
  };
  description: {
    nl: string;
    en: string;
  };
  price: number;
  images: string[];
  stock: number;
  category: {
    nl: string;
    en: string;
  };
}

export const mockProducts: Product[] = [
  {
    id: "alba-bank",
    name: {
      nl: "Alba Bank",
      en: "Alba Sofa"
    },
    description: {
      nl: "Een prachtig ontworpen bank die comfort en minimalisme combineert. Ideaal voor moderne woonkamers.",
      en: "A beautifully designed sofa that combines comfort and minimalism. Ideal for modern living rooms."
    },
    price: 3490,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80"
    ],
    stock: 5,
    category: { nl: "Zitmeubels", en: "Seating" }
  },
  {
    id: "eiken-tafel",
    name: {
      nl: "Minimalistische Eiken Tafel",
      en: "Minimalist Oak Table"
    },
    description: {
      nl: "Handgemaakte eikenhouten eettafel met een tijdloze uitstraling en robuuste kwaliteit.",
      en: "Handmade oak dining table with a timeless look and robust quality."
    },
    price: 1850,
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80"
    ],
    stock: 2,
    category: { nl: "Tafels", en: "Tables" }
  },
  {
    id: "velvet-stoel",
    name: {
      nl: "Velvet Design Stoel",
      en: "Velvet Design Chair"
    },
    description: {
      nl: "Elegante stoel met fluwelen bekleding en matzwarte metalen poten.",
      en: "Elegant chair with velvet upholstery and matte black metal legs."
    },
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80"
    ],
    stock: 12,
    category: { nl: "Zitmeubels", en: "Seating" }
  },
  {
    id: "luna-hanglamp",
    name: {
      nl: "Luna Hanglamp",
      en: "Luna Pendant Light"
    },
    description: {
      nl: "Moderne hanglamp die zorgt voor een warme en sfeervolle verlichting in elke ruimte.",
      en: "Modern pendant light that provides warm and atmospheric lighting in any room."
    },
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80"
    ],
    stock: 8,
    category: { nl: "Verlichting", en: "Lighting" }
  },
  {
    id: "walnoot-dressoir",
    name: {
      nl: "Walnoot Dressoir",
      en: "Walnut Sideboard"
    },
    description: {
      nl: "Ruim dressoir gemaakt van massief walnotenhout met greeploze deuren.",
      en: "Spacious sideboard made of solid walnut wood with handle-less doors."
    },
    price: 2100,
    images: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80"
    ],
    stock: 3,
    category: { nl: "Kasten", en: "Cabinets" }
  },
  {
    id: "marmeren-salontafel",
    name: {
      nl: "Marmeren Salontafel",
      en: "Marble Coffee Table"
    },
    description: {
      nl: "Luxe salontafel met een echt marmeren blad en een slank, goudkleurig frame.",
      en: "Luxury coffee table with a real marble top and a slim, gold-colored frame."
    },
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80"
    ],
    stock: 6,
    category: { nl: "Tafels", en: "Tables" }
  }
];
