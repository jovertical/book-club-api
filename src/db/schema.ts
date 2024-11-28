import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable as table,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = table('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
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

export const authors = table('authors', {
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
