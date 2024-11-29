import { FastifyPluginAsync } from 'fastify';
import fastifyAuth0Verify from 'fastify-auth0-verify';
import fp from 'fastify-plugin';

const auth0Plugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyAuth0Verify, {
    domain: fastify.config.AUTH0_DOMAIN,
    secret: fastify.config.AUTH0_CLIENT_SECRET,
    audience: fastify.config.AUTH0_AUDIENCE,
  });
};

export default fp(auth0Plugin);
