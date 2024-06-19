import { Gender, MemberStatus, Prisma, Role } from '@prisma/client';
import { TransactionClient } from './common.interface';
import { faker } from '@faker-js/faker';

import { areas } from './area.seed';
import { english, japanese, korean } from './language.seed';
import { hashMembersPassword } from './utils';

function createGuide(): Prisma.MemberCreateInput {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const nickname = faker.internet.userName();
  const birthdate = faker.date.birthdate();
  const gender = faker.helpers.enumValue(Gender);
  const status = MemberStatus.ACTIVE;
  const role = Role.GUIDE;

  const selectedLanguages = faker.helpers.arrayElements(
    [korean.name, english.name, japanese.name],
    { min: 1, max: 3 },
  );
  const selectedAreas = faker.helpers.arrayElements(
    areas.map((area) => area.name),
    { min: 1, max: 5 },
  );
  const selectedCertifications = faker.helpers.arrayElements(
    [
      ...korean.certifications,
      ...english.certifications,
      ...japanese.certifications,
    ],
    { min: 0, max: 5 },
  );
  const numReviews = faker.number.int({ min: 0, max: 5 });
  const reviews = Array.from({ length: numReviews }, createGuideReview);

  return {
    email,
    password,
    nickname,
    birthdate,
    gender,
    status,
    role,
    languages: {
      create: selectedLanguages.map((name) => ({
        language: { connect: { name } },
      })),
    },
    guideProfile: {
      create: {
        areas: {
          create: selectedAreas.map((name) => ({
            area: { connect: { name } },
          })),
        },
        languageCertifications: {
          create: selectedCertifications.map((certifications) => ({
            languageCertification: { connect: { name: certifications.name } },
          })),
        },
        reviews: {
          create: reviews,
        },
      },
    },
  };
}

function createGuideReview(): Prisma.GuideReviewCreateInput {
  const communicationScore = Math.random() * 5;
  const kindnessScore = Math.random() * 5;
  const locationScore = Math.random() * 5;
  const content = faker.lorem.lines(4);
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();

  return {
    communicationScore,
    content,
    createdAt,
    kindnessScore,
    locationScore,
    updatedAt,
  };
}

export async function guideSeed(client: TransactionClient) {
  const fakerGuides = Array.from({ length: 200 }, createGuide);

  const memberData = await hashMembersPassword(fakerGuides);

  // client.member.createMany({
  //   data: memberData,
  // });
  await Promise.all(
    memberData.map((member) => {
      return client.member.create({
        data: member,
      });
    }),
  );
}
