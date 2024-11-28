import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (server) => {
  server.post(
    '/auth/login',
    {
      schema: {
        description: 'Login via credentials',
        tags: ['auth'],
        response: {
          201: {
            description: 'An authentication session is created',
            type: 'object',
            properties: {
              data: {
                token: 'string',
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async function (_, reply) {
      return reply.status(401).send({ message: 'Unauthorized' });
    },
  );
};

export default auth;
