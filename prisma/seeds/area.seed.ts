import { PrismaClient } from '@prisma/client';

const areas = [
  '서울',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '경기',
  '강원',
  '충남',
  '충북',
  '경북',
  '경남',
  '전북',
  '전남',
  '제주',
].map((name) => ({ name }));

export async function areaSeed(client: PrismaClient) {
  await client.area.createMany({
    data: areas,
    skipDuplicates: true,
  });
}
