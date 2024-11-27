import fastify from 'fastify';

const server = fastify();

const host = process.env.APP_HOST || '0.0.0.0';
const port = Number(process.env.APP_PORT) || 8080;

server.get('/', async (request, reply) => {
  return {
    message: 'Ok',
  };
});

server.listen({ host, port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
