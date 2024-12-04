import { findBookQueryOptions } from '@/constants/index.js';
import * as schema from '@/db/schema.js';
import { BookDto } from '@/dtos/book.js';
import { WithRequiredParamSchema } from '@/schemas/books.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const findHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;

  await request.existsOrAbort(schema.books, 'id', id);

  const newBook = await db.query.books.findFirst({
    where: eq(schema.books.id, id),
    ...findBookQueryOptions,
  });

  return { data: plainToInstance(BookDto, newBook) };
};
