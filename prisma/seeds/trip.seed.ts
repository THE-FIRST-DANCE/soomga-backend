import { Prisma, BoardType } from '@prisma/client';

import { TransactionClient } from './common.interface';
import { faker } from '@faker-js/faker';

function createTrip({
  memberCount,
}: {
  memberCount: number;
}): Prisma.BoardCreateInput {
  const title = faker.lorem.words(5);
  const authorId = faker.number.int({ min: 1, max: memberCount - 1 });
  const overview = faker.lorem.sentences({ min: 1, max: 4 });
  const content = faker.lorem.paragraph();
  const lat = faker.location.latitude();
  const lng = faker.location.longitude();
  const areaId = faker.number.int({ min: 1, max: 16 });
  const type = BoardType.TRIP;
  return {
    title,
    author: {
      connect: { id: authorId },
    },
    area: {
      connect: { id: areaId },
    },
    overview,
    content,
    lat,
    lng,
    type,
  };
}

export async function tripSeed(client: TransactionClient) {
  const memberCount = await client.member.count();

  const fakerTrips = Array.from({ length: 200 }, () =>
    createTrip({ memberCount }),
  );

  await Promise.all(
    fakerTrips.map((trip) =>
      client.board.create({
        data: trip,
      }),
    ),
  );
}
