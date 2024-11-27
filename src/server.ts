import buildApp from './app.js';

const environment = process.env.NODE_ENV || 'development';
const host = process.env.APP_HOST || '0.0.0.0';
const port = Number(process.env.APP_PORT) || 8080;

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const server = await buildApp({
  logger: envToLogger[environment] ?? true,
});

server.listen({ host, port }, (err, address) => {
  if (err) {
    server.log.error(err);

    process.exit(1);
  }

  server.log.info(`Server listening at ${address}`);
});
