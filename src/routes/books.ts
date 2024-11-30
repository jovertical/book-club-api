import { books as table } from '@/db/schema.js';
import { FastifyTypebox, SortOrder } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { asc, desc } from 'drizzle-orm';

const books = async (server: FastifyTypebox) => {
  server.get(
    '/books',
    {
      // onRequest: [server.authenticate],
      schema: {
        querystring: Type.Object({
          page: Type.Optional(Type.Number()),
          limit: Type.Optional(Type.Number()),
          sort_by: Type.Optional(Type.String()),
          sort_order: Type.Optional(Type.Enum(SortOrder)),
        }),
      },
    },
    async function (request) {
      const {
        page = 1,
        limit = 10,
        sort_by = 'createdAt',
        sort_order = SortOrder.desc,
      } = request.query;

      // eslint-disable-next-line unicorn/prevent-abbreviations
      const orderFn = sort_order === SortOrder.desc ? desc : asc;

      const data = await server.db.query.books.findMany({
        columns: {
          id: true,
          title: true,
          info: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          genres: {
            columns: {
              bookId: true,
              genreId: true,
            },
            with: {
              genre: {
                columns: {
                  name: true,
                  description: true,
                },
              },
            },
          },
          author: {
            columns: {
              name: true,
              bio: true,
            },
          },
        },
        orderBy: orderFn(table[sort_by]),
        limit,
        offset: (page - 1) * limit,
      });

      return {
        data,
        meta: {
          page,
          limit,
          total: await server.db.$count(table),
        },
      };
    },
  );
};

export default books;
