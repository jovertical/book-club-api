import { books as table } from '@/db/schema.js';
import { BookDto } from '@/dtos/book.js';
import { FastifyTypebox, SortOrder } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { asc, desc, lt, gt, or, eq, and } from 'drizzle-orm';

const books = async (server: FastifyTypebox) => {
  server.get(
    '/books',
    {
      // onRequest: [server.authenticate],
      schema: {
        querystring: Type.Object({
          cursor: Type.Optional(Type.Number()),
          size: Type.Optional(Type.Number()),
          sort_by: Type.Optional(Type.String()),
          sort_order: Type.Optional(Type.Enum(SortOrder)),
        }),
      },
    },
    async function (request) {
      const {
        cursor,
        size = 10,
        sort_by = 'id',
        sort_order = SortOrder.asc,
      } = request.query;

      const nextBook = cursor
        ? await server.db.query.books.findFirst({ where: eq(table.id, cursor) })
        : undefined;

      const orderFn = sort_order === SortOrder.desc ? desc : asc;
      const cursorFn = sort_order === SortOrder.asc ? gt : lt;

      const data = await server.db.query.books.findMany({
        columns: {
          id: true,
          title: true,
          info: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          author: {
            columns: {
              name: true,
              bio: true,
            },
          },
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
        },
        ...(cursor && {
          where: or(
            cursorFn(table[sort_by], nextBook?.[sort_by]),
            and(
              eq(table[sort_by], nextBook?.[sort_by]),
              cursorFn(table.id, cursor),
            ),
          ),
        }),
        limit: size,
        orderBy: orderFn(table[sort_by]),
      });

      return {
        data: plainToInstance(BookDto, data),
        meta: {
          total: await server.db.$count(table),
          next: data.length === size ? data.at(-1)?.id : undefined,
        },
      };
    },
  );
};

export default books;
