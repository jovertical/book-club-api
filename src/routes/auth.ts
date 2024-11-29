import { FastifyTypebox } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (server: FastifyTypebox) => {
  server.post(
    '/auth/login',
    {
      onRequest: [server.authenticate],
      schema: {
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async function (_, reply) {
      return reply.status(401).send({ message: 'Unauthorized' });
    },
  );
};

export default auth;
