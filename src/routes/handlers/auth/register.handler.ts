import { users } from '@/db/schema.js';
import { UserDto } from '@/dtos/user.js';
import { RegisterFormSchema } from '@/schemas/auth.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { UnprocessableEntityError } from 'http-errors-enhanced';

export const registerHandler: RouteHandler<{
  Body: Static<typeof RegisterFormSchema>;
}> = async (request, reply) => {
  const input = request.body;

  if (
    await request.server.db.query.users.findFirst({
      where: eq(users.email, input.email),
    })
  ) {
    throw new UnprocessableEntityError(
      'An account with this email already exists.',
      {
        header: { 'X-Req-Id': request.id },
        code: 'UNPROCESSABLE_ENTITY',
      },
    );
  }

  const createUserResponse = await request.server.auth0.createUser(input);

  const [newUser] = await request.server.db
    .insert(users)
    .values({
      ...input,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - the auth0 SDK contains `_id` instead of `id`
      auth0Id: createUserResponse.data._id,
    })
    .returning();

  return reply.status(createUserResponse.status).send({
    data: plainToInstance(UserDto, newUser, {
      excludeExtraneousValues: true,
    }),
  });
};
