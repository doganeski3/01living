import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating a premium product with 5 variants...');

  const product = await prisma.product.create({
    data: {
      slug: 'the-editorial-oak-dining-chair',
      nameNl: 'The Editorial Oak Dining Chair',
      nameEn: 'The Editorial Oak Dining Chair',
      descNl: 'Een meesterwerk van vakmanschap. Deze stoel combineert minimalistisch design met het hoogste comfort, vervaardigd uit massief eikenhout.',
      descEn: 'A masterpiece of craftsmanship. This chair combines minimalist design with the highest comfort, crafted from solid oak wood.',
      price: 450,
      stock: 50,
      images: JSON.stringify(['/uploads/test-chair-1.webp']), // Placeholder image path
      categoryNl: 'Stoelen',
      categoryEn: 'Chairs',
      isArchived: false,
      variants: {
        create: [
          {
            nameNl: 'Natural Oak - Small',
            nameEn: 'Natural Oak - Small',
            colorNl: 'Natuurlijk Eiken',
            colorEn: 'Natural Oak',
            sizeNl: 'Small',
            sizeEn: 'Small',
            price: 450,
            stock: 10,
          },
          {
            nameNl: 'Natural Oak - Medium',
            nameEn: 'Natural Oak - Medium',
            colorNl: 'Natuurlijk Eiken',
            colorEn: 'Natural Oak',
            sizeNl: 'Medium',
            sizeEn: 'Medium',
            price: 475,
            stock: 15,
          },
          {
            nameNl: 'Smoked Oak - Small',
            nameEn: 'Smoked Oak - Small',
            colorNl: 'Gerookt Eiken',
            colorEn: 'Smoked Oak',
            sizeNl: 'Small',
            sizeEn: 'Small',
            price: 490,
            stock: 8,
          },
          {
            nameNl: 'Smoked Oak - Medium',
            nameEn: 'Smoked Oak - Medium',
            colorNl: 'Gerookt Eiken',
            colorEn: 'Smoked Oak',
            sizeNl: 'Medium',
            sizeEn: 'Medium',
            price: 515,
            stock: 12,
          },
          {
            nameNl: 'Black Ash - Standard',
            nameEn: 'Black Ash - Standard',
            colorNl: 'Zwart Essen',
            colorEn: 'Black Ash',
            sizeNl: 'Standard',
            sizeEn: 'Standard',
            price: 530,
            stock: 5,
          },
        ],
      },
    },
  });

  console.log('Product created successfully with 5 variants:', product.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
