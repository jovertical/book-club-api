import { Type } from '@sinclair/typebox';

export const LoginFormSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export const RegisterFormSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});
