import { JwtDto } from '@/dtos/jwt.js';
import { FastifyTypebox } from '@/types/index.js';
import { Type } from '@sinclair/typebox';
import { plainToInstance } from 'class-transformer';
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
};

export default auth;
