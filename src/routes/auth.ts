import { users } from '@/db/schema.js';
import { TokenSet } from '@/dtos/token-set.js';
import { UserDto } from '@/dtos/user.js';
import { FastifyTypebox } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { plainToClass, plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (server: FastifyTypebox) => {
  server.post(
    '/auth/login',
    {
      onRequest: [server.authenticate],
      schema: {
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async function (request, reply) {
      const { email, password } = request.body;

      const response = await server.auth0.authenticateUser(email, password);

      return reply.status(response.status).send({
        data: plainToInstance(TokenSet, response.data, {
          excludeExtraneousValues: true,
        }),
      });
    },
  );

  server.get(
    '/auth/me',
    {
      onRequest: [server.authenticate],
    },
    async function (request, reply) {
      const auth0User = await server.auth0.getUserInfo(
        request.getBearerToken() ?? '',
      );

      const user = await server.db.query.users.findFirst({
        where: eq(users.auth0Id, auth0User.data.sub),
      });

      if (user === null) {
        return reply.status(404).send({
          error: 'resource_not_found',
          message: 'User not found',
          statusCode: 404,
        });
      }

      return reply.status(200).send({
        data: plainToClass(UserDto, user, {
          excludeExtraneousValues: true,
        }),
      });
    },
  );
};

export default auth;
