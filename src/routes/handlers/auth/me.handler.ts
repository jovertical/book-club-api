import { users } from '@/db/schema.js';
import { UserDto } from '@/dtos/user.js';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';

export const meHandler: RouteHandler = async (request, reply) => {
  const { server } = request;

  const auth0User = await server.auth0.getUserInfo(
    request.getBearerToken() ?? '',
  );

  const auth0Id = auth0User.data.sub.replace('auth0|', '');

  await request.existsOrAbort(users, 'auth0Id', auth0Id);

  const user = await server.db.query.users.findFirst({
    where: eq(users.auth0Id, auth0Id),
  });

  return reply.status(200).send({
    data: plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    }),
  });
};
