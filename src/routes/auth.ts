import * as handlers from '@/routes/handlers/auth/index.js';
import { LoginFormSchema, RegisterFormSchema } from '@/schemas/auth.js';
import { FastifyTypebox } from '@/types/index.js';

const auth = async (server: FastifyTypebox) => {
  server.route({
    method: 'POST',
    url: '/auth/register',
    schema: { body: RegisterFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.registerHandler,
  });

  server.route({
    method: 'POST',
    url: '/auth/login',
    schema: { body: LoginFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.loginHandler,
  });

  server.route({
    method: 'GET',
    url: '/auth/me',
    preHandler: [server.authenticate],
    handler: handlers.meHandler,
  });
};

export default auth;
