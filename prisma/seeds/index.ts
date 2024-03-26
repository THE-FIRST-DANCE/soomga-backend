// export all seeds from here
import { PrismaClient } from '@prisma/client';
import { memberSeed } from './member.seed';
import { languageSeed } from './language.seed';
import { areaSeed } from './area.seed';
import { guideSeed } from './guide.seed';
import { defaultMemberSeed } from './default-member.seed';
import { tagSeed } from './tag.seed';

const prisma = new PrismaClient();

async function main() {
  prisma.$transaction(async (prisma) => {
    await defaultMemberSeed(prisma);
    await areaSeed(prisma);
    await languageSeed(prisma);
    await memberSeed(prisma);
    await guideSeed(prisma);
    await tagSeed(prisma);
  });
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
