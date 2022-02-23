import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  await prisma.user.deleteMany({})
  await prisma.user.create({
    data: {
      name: `John ${Date.now()}`,
      email: `john${Date.now()}@example.com`,
      posts: {
        create: [
          { title: 'How to make an omelette', content: "Let's do it!" },
          { title: 'How to eat an omelette', content: 'Yummy' },
        ],
      },
    },
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
