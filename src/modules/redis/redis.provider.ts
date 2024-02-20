import { Provider } from '@nestjs/common';
import { createClient } from 'redis';

export const redisProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      });

      await client
        .connect()
        .then(() => {
          console.log('Redis connected');
        })
        .catch((error) => console.error('Redis connection error', error));
      return client;
    },
  },
];
