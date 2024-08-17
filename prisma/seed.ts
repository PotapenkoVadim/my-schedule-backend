import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: 'admin',
      hash: '430db24dcf7d7f6791340ec7ff29d319c6a3154d94ae275711f728d91d2c47409dd7f9056d655f1b96cf018c5e783864790800896e4fcd7ac79e51976b2f91d1',
      salt: '63c4e40a7457dc84bd74813412f52f4a',
      role: 'Admin'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })