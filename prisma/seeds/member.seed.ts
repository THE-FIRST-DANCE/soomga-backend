import { MemberStatus, Role, Prisma, Gender } from '@prisma/client';

import { TransactionClient } from './common.interface';
import { faker } from '@faker-js/faker';
import { hashMembersPassword } from './utils';

function createMember(): Prisma.MemberCreateInput {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const nickname = faker.internet.userName();
  const birthdate = faker.date.birthdate({ min: 18, max: 70, mode: 'age' });
  const gender = faker.helpers.enumValue(Gender);
  const status = faker.helpers.enumValue(MemberStatus);
  const role = Role.USER;

  return {
    email,
    password,
    nickname,
    birthdate,
    gender,
    status,
    role,
  };
}

export async function memberSeed(client: TransactionClient) {
  const fakerMembers = Array.from({ length: 200 }, createMember);

  const memberData = await hashMembersPassword(fakerMembers);

  // client.member.createMany({
  //   data: memberData,
  // });

  await Promise.all(
    memberData.map((member) =>
      client.member.create({
        data: member,
      }),
    ),
  );
}
