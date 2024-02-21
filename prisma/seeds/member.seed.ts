import { MemberStatus, Role, PrismaClient } from '@prisma/client';
import { AuthHelpers } from '../../src/shared/helpers/auth.helpers';

const members = [
  {
    email: 'admin@test.com',
    password: 'admin',
    nickname: 'admin',
    status: MemberStatus.ACTIVE,
    role: Role.ADMIN,
  },
  {
    email: 'user1@test.com',
    password: 'user1',
    nickname: 'user1',
    status: MemberStatus.ACTIVE,
    role: Role.USER,
  },
  {
    email: 'user2@test.com',
    password: 'user2',
    nickname: 'user2',
    status: MemberStatus.INACTIVE,
    role: Role.USER,
  },
  {
    email: 'user3@test.com',
    password: 'user3',
    nickname: 'user3',
    status: MemberStatus.DELETED,
    role: Role.USER,
  },
  {
    email: 'guide1@test.com',
    password: 'guide1',
    nickname: 'guide1',
    status: MemberStatus.ACTIVE,
    role: Role.GUIDE,
  },
  {
    email: 'guide2@test.com',
    password: 'guide2',
    nickname: 'guide2',
    status: MemberStatus.INACTIVE,
    role: Role.GUIDE,
  },
  {
    email: 'guide3@test.com',
    password: 'guide3',
    nickname: 'guide3',
    status: MemberStatus.DELETED,
    role: Role.GUIDE,
  },
];

export async function memberSeed(client: PrismaClient) {
  const memberData = await Promise.all(
    members.map(async (member) => ({
      ...member,
      password: await AuthHelpers.hash(member.password),
    })),
  );

  await client.member.createMany({
    data: memberData,
    skipDuplicates: true,
  });
}
