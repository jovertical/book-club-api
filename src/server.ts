import buildApp from './app.js';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const server = await buildApp({ logger: true });

const host = server.config.APP_HOST;
const port = +server.config.APP_PORT;

await server.listen({ host, port });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () =>
    server.close().then((err) => {
      server.log.warn(`close application on ${signal}`);

      process.exit(err ? 1 : 0);
    }),
  );
}
