import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer('author_id'),
  title: varchar({ length: 255 }).notNull(),
  info: text('info'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const authors = pgTable('authors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const bookRelations = relations(books, ({ one }) => ({
  authorId: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
}));
