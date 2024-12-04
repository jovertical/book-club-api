import { findAuthorQueryOptions } from '@/constants/index.js';
import { authors as table } from '@/db/schema.js';
import { AuthorDto } from '@/dtos/author.js';
import { ResourceCollectionQuerySchema } from '@/schemas/common.js';
import { SortOrder } from '@/types/index.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { asc, desc, lt, gt, or, eq, and } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const getHandler: RouteHandler<{
  Querystring: Static<typeof ResourceCollectionQuerySchema>;
}> = async (request) => {
  const { server } = request;

  const {
    cursor,
    size = 10,
    sort_by = 'id',
    sort_order = SortOrder.asc,
  } = request.query;

  const nextAuthor = cursor
    ? await server.db.query.authors.findFirst({ where: eq(table.id, cursor) })
    : undefined;

  const orderFn = sort_order === SortOrder.desc ? desc : asc;
  const cursorFn = sort_order === SortOrder.asc ? gt : lt;

  const data = await server.db.query.authors.findMany({
    ...findAuthorQueryOptions,
    ...(cursor && {
      where: or(
        cursorFn(table[sort_by], nextAuthor?.[sort_by]),
        and(
          eq(table[sort_by], nextAuthor?.[sort_by]),
          cursorFn(table.id, cursor),
        ),
      ),
    }),
    limit: size,
    orderBy: orderFn(table[sort_by]),
  });

  return {
    data: plainToInstance(AuthorDto, data),
    meta: {
      total: await server.db.$count(table),
      next: data.length === size ? data.at(-1)?.id : undefined,
    },
  };
};
