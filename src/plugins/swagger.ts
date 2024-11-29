import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    mode: 'static',
    specification: {
      path: path.join(__dirname, '..', '..', 'docs', 'api.yaml'),
      baseDir: '.',
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });

  fastify.log.info(
    `Swagger documentation is available at http://${fastify.config.APP_HOST}:${fastify.config.APP_PORT}/api-docs`,
  );
}

export default fp(swaggerGeneratorPlugin, {
  name: 'swaggerGenerator',
});
