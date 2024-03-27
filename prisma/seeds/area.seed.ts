import { Prisma } from '@prisma/client';
import { TransactionClient } from './common.interface';

export const areas: Prisma.AreaCreateInput[] = [
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

export async function areaSeed(client: TransactionClient) {
  await Promise.all(
    areas.map(async (area) => {
      return client.area.create({
        data: area,
      });
    }),
  );
}
