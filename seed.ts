import authorsData from './seed_data/authors.json' assert { type: 'json' };
import booksData from './seed_data/books.json' assert { type: 'json' };
import genresData from './seed_data/genres.json' assert { type: 'json' };
import * as schema from './src/db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed, reset } from 'drizzle-seed';

const database = drizzle(process.env.DATABASE_URL ?? '', { schema });

console.log('\x1b[33m%s\x1b[0m', 'Seeding database...');

await reset(database, schema);

await seed(database, { users: schema.users }).refine((fn) => ({
  users: {
    columns: {
      name: fn.fullName(),
      password: fn.default({
        defaultValue: '$2b$10$J5KPKXjXPCAeu3ZXTCWSH.D/0YS3f45jrZT1yHZAdRvAwTFxSAGeq' // 'password'
      })
    },
    count: 10,
  },
}));

// Seed realistic data
await (async () => {
  // Genres & authors
  await database.insert(schema.genres).values(genresData);
  await database.insert(schema.authors).values(authorsData);

  // Books: with authors and genres attached to them.
  for (const bookData of booksData) {
    await database.transaction(async (tx) => {
      const author = await tx.query.authors.findFirst({
        where: eq(schema.authors.name, bookData.author),
        columns: { id: true },
      });

      if (!author) return;

      const book = await tx
        .insert(schema.books)
        .values({
          authorId: author.id,
          title: bookData.title,
          info: bookData.info,
        })
        .returning({ id: schema.books.id });

      const genres = await tx.query.genres.findMany({
        where: inArray(schema.genres.name, bookData.genres),
        columns: { id: true },
      });

      const insertBookGenresPivotPromises = genres.map((genre) => {
        return tx.insert(schema.booksGenresPivot).values({
          bookId: book[0].id,
          genreId: genre.id,
        });
      });

      await Promise.all(insertBookGenresPivotPromises);

      return true;
    });
  }
})();

console.log('\x1b[32m%s\x1b[0m', 'Seeding complete!');
