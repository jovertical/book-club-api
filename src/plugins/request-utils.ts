import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const requestUtilsPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('getBearerToken', function () {
    const authorization = this.headers.authorization;

    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
  });
};

declare module 'fastify' {
  interface FastifyRequest {
    getBearerToken: () => string | undefined;
  }
}

export default fp(requestUtilsPlugin);
