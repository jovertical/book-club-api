import * as schema from '@/db/schema.js';
import { WithRequiredParamSchema } from '@/schemas/books.js';
import { Static } from '@sinclair/typebox';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const deleteHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;

  await request.existsOrAbort(schema.books, 'id', id);

  await db.delete(schema.books).where(eq(schema.books.id, id));

  return { message: 'Book deleted' };
};
