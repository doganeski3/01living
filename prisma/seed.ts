import { PrismaClient } from '@prisma/client'
import { mockProducts } from '../src/data/products'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding products...')
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { slug: product.id },
      update: {
        nameNl: product.name.nl,
        nameEn: product.name.en,
        descNl: product.description.nl,
        descEn: product.description.en,
        price: product.price,
        images: JSON.stringify(product.images),
        stock: product.stock,
        categoryNl: product.category.nl,
        categoryEn: product.category.en,
      },
      create: {
        slug: product.id,
        nameNl: product.name.nl,
        nameEn: product.name.en,
        descNl: product.description.nl,
        descEn: product.description.en,
        price: product.price,
        images: JSON.stringify(product.images),
        stock: product.stock,
        categoryNl: product.category.nl,
        categoryEn: product.category.en,
      },
    })
  }
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
