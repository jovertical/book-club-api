import * as schema from '@/db/schema.js';
import { AuthorDto } from '@/dtos/author.js';
import { CreateAuthorFormSchema } from '@/schemas/authors.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { RouteHandler } from 'fastify';

export const createHandler: RouteHandler<{
  Body: Static<typeof CreateAuthorFormSchema>;
}> = async (request) => {
  const db = request.server.db;

  const input = request.body;

  const newAuthor = await db.insert(schema.authors).values(input).returning();

  return { data: plainToInstance(AuthorDto, newAuthor) };
};
