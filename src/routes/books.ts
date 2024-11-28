import { books as schema } from '@/db/schema/public.js';
import { FastifyPluginAsync } from 'fastify';

const books: FastifyPluginAsync = async (server) => {
  server.get('/books', async function () {
    const total = await server.db.$count(schema);

    return {
      data: [],
      total,
    };
  });
};

export default books;
