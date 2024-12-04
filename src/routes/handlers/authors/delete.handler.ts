import * as schema from '@/db/schema.js';
import { WithRequiredParamSchema } from '@/schemas/authors.js';
import { Static } from '@sinclair/typebox';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const deleteHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;

  await request.existsOrAbort(schema.authors, 'id', id);

  await db.delete(schema.authors).where(eq(schema.authors.id, id));

  return { message: 'Author deleted' };
};
