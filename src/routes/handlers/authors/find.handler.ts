import * as schema from '@/db/schema.js';
import { AuthorDto } from '@/dtos/author.js';
import { WithRequiredParamSchema } from '@/schemas/authors.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const findHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;

  await request.existsOrAbort(schema.authors, 'id', id);

  const author = await db.query.authors.findFirst({
    where: eq(schema.authors.id, id),
  });

  return { data: plainToInstance(AuthorDto, author) };
};
