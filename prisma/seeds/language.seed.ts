import { Prisma } from '@prisma/client';
import { TransactionClient } from './common.interface';

export const korean = {
  name: '한국어',
  certifications: [
    { name: 'TOPIK 1' },
    { name: 'TOPIK 2' },
    { name: 'TOPIK 3' },
    { name: 'TOPIK 4' },
    { name: 'TOPIK 5' },
    { name: 'TOPIK 6' },
  ],
};

export const english = {
  name: 'English',
  certifications: [
    { name: 'TOEIC 900' },
    { name: 'TOEIC 800' },
    { name: 'TOEIC 700' },
    { name: 'TOEIC 600' },
    { name: 'TOEIC 500' },
  ],
};

export const japanese = {
  name: '日本語',
  certifications: [
    { name: 'JLPT N1' },
    { name: 'JLPT N2' },
    { name: 'JLPT N3' },
    { name: 'JLPT N4' },
    { name: 'JLPT N5' },
  ],
};

const languageDatas: Prisma.LanguageCreateInput[] = [
  {
    name: korean.name,
    certifications: {
      createMany: {
        data: korean.certifications,
      },
    },
  },
  {
    name: english.name,
    certifications: {
      createMany: {
        data: english.certifications,
      },
    },
  },
  {
    name: japanese.name,
    certifications: {
      createMany: {
        data: japanese.certifications,
      },
    },
  },
];

export async function languageSeed(client: TransactionClient) {
  await Promise.all(
    languageDatas.map((language) =>
      client.language.create({
        data: language,
      }),
    ),
  );
}
