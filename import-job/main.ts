import { PrismaClient } from '@prisma/client';
import { MembersService } from './services/members.service';
import Obj2Csv from './utils/obj2csv';

const prisma = new PrismaClient();

async function main() {
  const membersService = new MembersService(prisma);

  prisma.$transaction(async (prisma) => {
    // Convert members to CSV
    const members = await membersService.getMembers();
    Obj2Csv.convert(
      members,
      ['USER_ID', 'AGE', 'GENDER', 'LANG_KO', 'LANG_EN', 'LANG_JA'],
      'members.csv',
    );

    // Convert guides to CSV
    const guides = await membersService.getGuides();
    Obj2Csv.convert(
      guides,
      ['ITEM_ID', 'AGE', 'GENDER', 'LANG_KO', 'LANG_EN', 'LANG_JA'],
      'guides.csv',
    );

    // Convert interactions to CSV
    const interactions = await membersService.getInteractions();
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();

    console.log('Jobs Done!');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
