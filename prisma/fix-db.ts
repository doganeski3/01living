import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adding locale column to Order table...')
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "locale" TEXT DEFAULT 'nl';`)
    console.log('Successfully added locale column.')
  } catch (error) {
    console.error('Error adding column:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
