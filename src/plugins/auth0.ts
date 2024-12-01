import { Auth0Service } from '@/services/auth0.service.js';
import { FastifyPluginAsync } from 'fastify';
import fastifyAuth0Verify from 'fastify-auth0-verify';
import fp from 'fastify-plugin';

const auth0Plugin: FastifyPluginAsync = async (fastify) => {
  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } =
    fastify.config;

  fastify.register(fastifyAuth0Verify, {
    domain: AUTH0_DOMAIN,
    secret: AUTH0_CLIENT_SECRET,
    audience: AUTH0_AUDIENCE,
  });

  fastify.decorate(
    'auth0',
    new Auth0Service(
      AUTH0_DOMAIN,
      AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET,
      AUTH0_AUDIENCE,
    ),
  );
};

declare module 'fastify' {
  interface FastifyInstance {
    auth0: Auth0Service;
  }
}

export default fp(auth0Plugin);
