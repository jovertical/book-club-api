import { FastifyPluginAsync } from 'fastify';

import { books as schema } from '../db/schema.js';

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
