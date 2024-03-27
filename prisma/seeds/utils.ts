import { Prisma } from '@prisma/client';
import { AuthHelpers } from '../../src/shared/helpers/auth.helpers';

export async function hashMembersPassword(members: Prisma.MemberCreateInput[]) {
  return Promise.all(
    members.map(async (member) => {
      return {
        ...member,
        password: await AuthHelpers.hash(member.password),
      };
    }),
  );
}
