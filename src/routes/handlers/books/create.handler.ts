import { findBookQueryOptions } from '@/constants/index.js';
import * as schema from '@/db/schema.js';
import { BookDto } from '@/dtos/book.js';
import { CreateBookFormSchema } from '@/schemas/books.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const createHandler: RouteHandler<{
  Body: Static<typeof CreateBookFormSchema>;
}> = async (request) => {
  const db = request.server.db;

  const input = request.body;

  await request.existsOrAbort(schema.authors, 'id', input.authorId);
  await request.existsOrAbort(schema.genres, 'id', input.genres);

  const newBook = await db.transaction(async (tx) => {
    const [book] = await tx
      .insert(schema.books)
      .values(input)
      .returning({ id: schema.books.id });

    if (!book) return;

    // Batch insert genre <-> book pivots
    await tx
      .insert(schema.booksGenresPivot)
      .values(input.genres.map((genreId) => ({ bookId: book.id, genreId })));

    return await tx.query.books.findFirst({
      where: eq(schema.books.id, book.id),
      ...findBookQueryOptions,
    });
  });

  return { data: plainToInstance(BookDto, newBook) };
};
