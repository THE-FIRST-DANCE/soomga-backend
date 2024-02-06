// export all seeds from here
import { PrismaClient } from '@prisma/client';
import { memberSeed } from './member.seed';

const prisma = new PrismaClient();

async function main() {
  memberSeed(prisma);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
