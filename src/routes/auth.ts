import { users } from '@/db/schema.js';
import { TokenSet } from '@/dtos/token-set.js';
import { UserDto } from '@/dtos/user.js';
import { LoginFormSchema, RegisterFormSchema } from '@/schemas/auth.js';
import { FastifyTypebox } from '@/types/index.js';
import { plainToClass, plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';

const auth = async (server: FastifyTypebox) => {
  server.post(
    '/auth/register',
    {
      onRequest: [server.authenticate],
      schema: {
        body: RegisterFormSchema,
      },
    },
    async function (request, reply) {
      const input = request.body;

      if (
        await server.db.query.users.findFirst({
          where: eq(users.email, input.email),
        })
      ) {
        return reply.status(400).send({
          error: 'email_already_exists',
          message: 'An account with this email already exists.',
          statusCode: 422,
        });
      }

      const createUserResponse = await server.auth0.createUser(input);

      const [newUser] = await server.db
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
    },
  );

  server.post(
    '/auth/login',
    {
      onRequest: [server.authenticate],
      schema: {
        body: LoginFormSchema,
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
