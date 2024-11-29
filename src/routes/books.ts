import { books as schema } from '@/db/schema.js';
import { FastifyPluginAsync } from 'fastify';

const books: FastifyPluginAsync = async (server) => {
  server.get(
    '/books',
    {
      onRequest: [server.authenticate],
    },
    async function () {
      const total = await server.db.$count(schema);

      return {
        data: [],
        meta: {
          total,
        },
      };
    },
  );
};

export default books;
