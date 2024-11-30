import { books as table, authors } from '@/db/schema.js';
import { FastifyTypebox, SortOrder } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { eq, asc, desc } from 'drizzle-orm';

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

      const data = await server.db
        .select({
          id: table.id,
          title: table.title,
          info: table.info,
          createdAt: table.createdAt,
          updatedAt: table.updatedAt,
          author: {
            name: authors.name,
            bio: authors.bio,
          },
        })
        .from(table)
        .fullJoin(authors, eq(authors.id, table.authorId))
        .orderBy(orderFn(table[sort_by]))
        .limit(limit)
        .offset((page - 1) * limit);

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
