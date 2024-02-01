import { PrismaClient } from '@prisma/client';

export async function memberSeed(client: PrismaClient) {
  await client.member.create({
    data: {
      email: 'admin@test.com',
      password: 'admin',
      nickname: 'admin',
      status: 'ACTIVE',
      role: 'ADMIN',
    },
  });

  await client.member.create({
    data: {
      email: 'user1@test.com',
      password: 'user1',
      nickname: 'user1',
      status: 'ACTIVE',
      role: 'USER',
    },
  });

  await client.member.create({
    data: {
      email: 'user2@test.com',
      password: 'user2',
      nickname: 'user2',
      status: 'INACTIVE',
      role: 'USER',
    },
  });

  await client.member.create({
    data: {
      email: 'user3@test.com',
      password: 'user3',
      nickname: 'user3',
      status: 'DELETED',
      role: 'USER',
    },
  });

  await client.member.create({
    data: {
      email: 'guide1@test.com',
      password: 'guide1',
      nickname: 'guide1',
      status: 'ACTIVE',
      role: 'GUIDE',
    },
  });

  await client.member.create({
    data: {
      email: 'guide2@test.com',
      password: 'guide2',
      nickname: 'guide2',
      status: 'INACTIVE',
      role: 'GUIDE',
    },
  });

  await client.member.create({
    data: {
      email: 'guide3@test.com',
      password: 'guide3',
      nickname: 'guide3',
      status: 'DELETED',
      role: 'GUIDE',
    },
  });
}
