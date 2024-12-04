import { TokenSet } from '@/dtos/token-set.js';
import { LoginFormSchema } from '@/schemas/auth.js';
import { Static } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
import { RouteHandler } from 'fastify';

export const loginHandler: RouteHandler<{
  Body: Static<typeof LoginFormSchema>;
}> = async (request, reply) => {
  const { email, password } = request.body;

  const response = await request.server.auth0.authenticateUser(email, password);

  return reply.status(response.status).send({
    data: plainToInstance(TokenSet, response.data, {
      excludeExtraneousValues: true,
    }),
  });
};
