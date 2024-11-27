import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (server) => {
  server.get('/', {}, async function () {
    return {
      message: 'Welcome to the Book Club API',
    };
  });
};

export default root;
