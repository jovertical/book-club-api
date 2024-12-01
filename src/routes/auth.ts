import { users } from '@/db/schema.js';
import { JwtDto } from '@/dtos/jwt.js';
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

      if (response.isLeft()) {
        return reply.status(response.value.status_code).send({
          error: response.value.error,
          message: response.value.error_description,
          statusCode: response.value.status_code,
        });
      }

      return reply.status(201).send({
        data: plainToInstance(JwtDto, response.value, {
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

      if (auth0User.isLeft()) {
        return reply.status(auth0User.value.status_code).send({
          error: auth0User.value.error,
          message: auth0User.value.error_description,
          statusCode: auth0User.value.status_code,
        });
      }

      const user = await server.db.query.users.findFirst({
        where: eq(users.auth0Id, auth0User.value.sub),
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
