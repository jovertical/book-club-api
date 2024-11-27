import fastify from 'fastify';

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

const server = fastify({
  logger: envToLogger[environment] ?? true,
});

server.get('/', async (request, reply) => {
  return {
    message: 'Welcome to the Book Club API',
  };
});

server.listen({ host, port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
