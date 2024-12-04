import { Type } from '@sinclair/typebox';

export const CreateAuthorFormSchema = Type.Object({
  name: Type.String({ maxLength: 255 }),
  bio: Type.Optional(Type.String({ maxLength: 255 })),
});

export const WithRequiredParamSchema = Type.Object({
  id: Type.Number(),
});

export const UpdateAuthorFormSchema = Type.Object({
  name: Type.String({ maxLength: 255 }),
  bio: Type.Optional(Type.String({ maxLength: 255 })),
});
