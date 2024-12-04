import { findBookQueryOptions } from '@/constants/index.js';
import * as schema from '@/db/schema.js';
import { BookDto } from '@/dtos/book.js';
import {
  WithRequiredParamSchema,
  UpdateBookFormSchema,
} from '@/schemas/books.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const updateHandler: RouteHandler<{
  Params: Static<typeof WithRequiredParamSchema>;
  Body: Static<typeof UpdateBookFormSchema>;
}> = async (request) => {
  const db = request.server.db;

  const { id } = request.params;
  const input = request.body;

  await request.existsOrAbort(schema.books, 'id', id);
  await request.existsOrAbort(schema.authors, 'id', input.authorId);
  await request.existsOrAbort(schema.genres, 'id', input.genres);

  const updatedBook = await db.transaction(async (tx) => {
    const [book] = await tx
      .update(schema.books)
      .set({
        title: input.title,
        info: input.info,
        authorId: input.authorId,
        updatedAt: new Date(),
      })
      .where(eq(schema.books.id, id))
      .returning({ id: schema.books.id });

    if (!book) return;

    // Detach genre <-> book pivots
    await tx
      .delete(schema.booksGenresPivot)
      .where(eq(schema.booksGenresPivot.bookId, book.id));

    // Batch insert genre <-> book pivots
    await tx
      .insert(schema.booksGenresPivot)
      .values(input.genres.map((genreId) => ({ bookId: book.id, genreId })));

    return await tx.query.books.findFirst({
      where: eq(schema.books.id, book.id),
      ...findBookQueryOptions,
    });
  });

  return { data: plainToInstance(BookDto, updatedBook) };
};
