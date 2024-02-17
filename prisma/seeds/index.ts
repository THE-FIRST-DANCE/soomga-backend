// export all seeds from here
import { PrismaClient } from '@prisma/client';
import { memberSeed } from './member.seed';
import { languageSeed } from './language.seed';
import { areaSeed } from './area.seed';

const prisma = new PrismaClient();

async function main() {
  await memberSeed(prisma);
  await areaSeed(prisma);
  await languageSeed(prisma);
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
