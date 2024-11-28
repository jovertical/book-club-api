import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (server) => {
  server.get(
    '/',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health-check'],
        response: {
          200: {
            description: 'Succesful response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async function () {
      return {
        message: 'Welcome to the Book Club API',
      };
    },
  );
};

export default root;
