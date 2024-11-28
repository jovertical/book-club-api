import { books as schema } from '@/db/schema.js';
import { FastifyPluginAsync } from 'fastify';

const books: FastifyPluginAsync = async (server) => {
  server.get(
    '/books',
    {
      schema: {
        description: 'List all books',
        tags: ['books'],
        response: {
          200: {
            description: 'A collection of books is fetched',
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    author: { type: 'string' },
                    genre: { type: 'string' },
                    isbn: { type: 'string' },
                    price: { type: 'number' },
                  },
                },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                },
              },
            },
          },
        },
      },
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
