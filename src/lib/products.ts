import { prisma } from './prisma'
import { Product as PrismaProduct } from '@prisma/client'

export interface Product {
  id: string
  slug: string
  name: {
    nl: string
    en: string
  }
  description: {
    nl: string
    en: string
  }
  price: number
  images: string[]
  stock: number
  category: {
    nl: string
    en: string
  }
  variants?: {
    id: string
    name: { nl: string | null, en: string | null }
    color: { nl: string | null, en: string | null }
    size: { nl: string | null, en: string | null }
    price: number
    stock: number
    image: string | null
  }[]
}

function transformProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: { nl: p.nameNl, en: p.nameEn },
    description: { nl: p.descNl, en: p.descEn },
    price: p.price,
    images: (() => {
      try {
        return JSON.parse(p.images);
      } catch (e) {
        console.error("JSON parse error for product images:", p.slug);
        return [];
      }
    })(),
    stock: p.stock,
    category: { nl: p.categoryNl, en: p.categoryEn },
    variants: (p as any).variants?.map((v: any) => ({
      id: v.id,
      name: { nl: v.nameNl, en: v.nameEn },
      color: { nl: v.colorNl, en: v.colorEn },
      size: { nl: v.sizeNl, en: v.sizeEn },
      price: v.price,
      stock: v.stock,
      image: v.image
    }))
  }
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isArchived: false },
    include: { variants: true }
  })
  return product ? transformProduct(product) : null
}

export async function getCategories() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    select: { categoryNl: true, categoryEn: true },
    distinct: ['categoryNl']
  })
  return products.map(p => ({ nl: p.categoryNl, en: p.categoryEn }))
}
