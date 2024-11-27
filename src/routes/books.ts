import { FastifyPluginAsync } from 'fastify';

const books: FastifyPluginAsync = async (server) => {
  server.get('/books', {}, async function () {
    return { data: [] };
  });
};

export default books;
