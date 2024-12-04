import { Type } from '@sinclair/typebox';

export const CreateBookFormSchema = Type.Object({
  authorId: Type.Number(),
  title: Type.String({ maxLength: 255 }),
  info: Type.String({ maxLength: 255 }),
  genres: Type.Array(Type.Number()),
});

export const WithRequiredParamSchema = Type.Object({
  id: Type.Number(),
});

export const UpdateBookFormSchema = Type.Object({
  authorId: Type.Number(),
  title: Type.String({ maxLength: 255 }),
  info: Type.String({ maxLength: 255 }),
  genres: Type.Array(Type.Number()),
});
