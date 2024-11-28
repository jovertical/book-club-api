import { createApp } from '@/app.js';
import GracefulServer from '@gquittet/graceful-server';

const fastify = await createApp({
  logger: {
    level: 'info',
    redact: ['req.headers.authorization'],
  },
});

const gracefulServer = GracefulServer(fastify.server, {
  closePromises: [], // e.g. close database connection
});

gracefulServer.on(GracefulServer.READY, () => {
  fastify.log.info('Server is ready');
});

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  fastify.log.info('Server is shutting down');
});

gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
  fastify.log.info('Server is down', error.message);
});

try {
  await fastify.listen({
    host: fastify.config.APP_HOST,
    port: +fastify.config.APP_PORT,
  });

  gracefulServer.setReady();
} catch (error) {
  fastify.log.error(error);

  // eslint-disable-next-line n/no-process-exit,unicorn/no-process-exit
  process.exit(1);
}
