import { MemberStatus, Prisma, Role } from '@prisma/client';
import { TransactionClient } from './common.interface';
import { hashMembersPassword } from './utils';

const defaultAdmins: Prisma.MemberCreateInput[] = [
  {
    email: 'admin@test.com',
    password: 'admin',
    nickname: 'admin',
    birthdate: new Date('2001-10-27'),
    status: MemberStatus.ACTIVE,
    role: Role.ADMIN,
  },
];

const defaultUsers: Prisma.MemberCreateInput[] = [
  {
    email: 'user1@test.com',
    password: 'user1',
    nickname: 'user1',
    birthdate: new Date('2002-11-22'),
    status: MemberStatus.ACTIVE,
    role: Role.USER,
  },
  {
    email: 'user2@test.com',
    password: 'user2',
    nickname: 'user2',
    birthdate: new Date('2003-12-25'),
    status: MemberStatus.INACTIVE,
    role: Role.USER,
  },
  {
    email: 'user3@test.com',
    password: 'user3',
    nickname: 'user3',
    birthdate: new Date('1999-01-30'),
    status: MemberStatus.DELETED,
    role: Role.USER,
  },
];

const defaultGuides: Prisma.MemberCreateInput[] = [
  {
    email: 'guide1@test.com',
    password: 'guide1',
    nickname: 'guide1',
    birthdate: new Date('1995-02-15'),
    status: MemberStatus.ACTIVE,
    role: Role.GUIDE,
  },
  {
    email: 'guide2@test.com',
    password: 'guide2',
    nickname: 'guide2',
    birthdate: new Date('1996-03-20'),
    status: MemberStatus.INACTIVE,
    role: Role.GUIDE,
  },
  {
    email: 'guide3@test.com',
    password: 'guide3',
    nickname: 'guide3',
    birthdate: new Date('1988-04-25'),
    status: MemberStatus.DELETED,
    role: Role.GUIDE,
  },
];

export async function defaultMemberSeed(client: TransactionClient) {
  const members = [...defaultAdmins, ...defaultUsers, ...defaultGuides];

  const memberData = await hashMembersPassword(members);

  await Promise.all(
    memberData.map((member) => {
      return client.member.create({
        data: member,
      });
    }),
  );
}
