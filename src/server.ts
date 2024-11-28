import { createApp } from '@/app.js';

process.on('unhandledRejection', (error) => {
  console.error(error);
  // process.exit(1);
});

const server = await createApp({ logger: true });

const host = server.config.APP_HOST;
const port = +server.config.APP_PORT;

await server.listen({ host, port });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () =>
    server.close().then((error) => {
      server.log.warn(`close application on ${signal}`, error);

      // process.exit(err ? 1 : 0);
      return 0;
    }),
  );
}
