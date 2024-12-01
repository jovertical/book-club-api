import { relations } from 'drizzle-orm';
import {
  primaryKey,
  integer,
  pgTable as table,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = table('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  auth0Id: varchar('auth0_id', { length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const books = table('books', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer('author_id'),
  title: varchar({ length: 255 }).notNull(),
  info: text('info'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const genres = table('genres', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const authors = table('authors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const booksGenresPivot = table(
  'book_genre',
  {
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genres.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.genreId] }),
  }),
);

export const bookRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),

  genres: many(booksGenresPivot),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  booksGenresPivot: many(booksGenresPivot),
}));

export const booksGenresPivotRelations = relations(
  booksGenresPivot,
  ({ one }) => ({
    book: one(books, {
      fields: [booksGenresPivot.bookId],
      references: [books.id],
    }),
    genre: one(genres, {
      fields: [booksGenresPivot.genreId],
      references: [genres.id],
    }),
  }),
);
