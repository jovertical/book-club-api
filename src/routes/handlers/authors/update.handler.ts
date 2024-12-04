import * as schema from '@/db/schema.js';
import { AuthorDto } from '@/dtos/author.js';
import {
  WithRequiredParamSchema,
  UpdateAuthorFormSchema,
} from '@/schemas/authors.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const updateHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
  Body: Static<typeof UpdateAuthorFormSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;
  const input = request.body;

  await request.existsOrAbort(schema.authors, 'id', id);

  const [updatedAuthor] = await db
    .update(schema.authors)
    .set({
      name: input.name,
      bio: input.bio,
      updatedAt: new Date(),
    })
    .where(eq(schema.books.id, id))
    .returning();

  return { data: plainToInstance(AuthorDto, updatedAuthor) };
};
