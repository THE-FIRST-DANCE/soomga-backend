import { Provider } from '@nestjs/common';
import { createClient } from 'redis';

export const redisProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      console.log('REDIS_HOST', process.env.REDIS_HOST);
      console.log('REDIS_PORT', process.env.REDIS_PORT);
      const client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      });

      client.on('error', (error) => {
        console.error('Redis error', error);
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
