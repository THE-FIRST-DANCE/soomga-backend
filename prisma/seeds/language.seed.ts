import { PrismaClient } from '@prisma/client';

const languages = [
  {
    name: '한국어',
    certifications: [
      { name: 'TOPIK 1' },
      { name: 'TOPIK 2' },
      { name: 'TOPIK 3' },
      { name: 'TOPIK 4' },
      { name: 'TOPIK 5' },
      { name: 'TOPIK 6' },
    ],
  },
  {
    name: 'English',
    certifications: [
      { name: 'TOEIC 900' },
      { name: 'TOEIC 800' },
      { name: 'TOEIC 700' },
      { name: 'TOEIC 600' },
      { name: 'TOEIC 500' },
    ],
  },
  {
    name: '日本語',
    certifications: [
      { name: 'JLPT N1' },
      { name: 'JLPT N2' },
      { name: 'JLPT N3' },
      { name: 'JLPT N4' },
      { name: 'JLPT N5' },
    ],
  },
];

export async function languageSeed(client: PrismaClient) {
  languages.forEach(async (language) => {
    await client.language.create({
      data: {
        name: language.name,
        certifications: {
          create: language.certifications,
        },
      },
    });
  });
}
