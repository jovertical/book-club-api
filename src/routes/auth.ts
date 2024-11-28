import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (server) => {
  server.get('/auth/login', async function () {
    return {
      data: [],
    };
  });
};

export default auth;
