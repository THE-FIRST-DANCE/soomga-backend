import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(
    private app,
    private host: string,
    private port: number,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const tlsOptions =
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined;

    const pubClient = new Redis({
      host: this.host,
      port: this.port,
      tls: tlsOptions,
    });
    pubClient.on('error', (err) => {
      console.log('🚀 ~ RedisIoAdapter ~ pubClient.on ~ err:', err);
    });

    const subClient = pubClient.duplicate();
    subClient.on('error', (err) => {
      console.log('🚀 ~ RedisIoAdapter ~ subClient.on ~ err:', err);
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
