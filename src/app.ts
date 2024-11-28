import configPlugin from '@/plugins/config.js';
import databasePlugin from '@/plugins/database.js';
import swaggerPlugin from '@/plugins/swagger.js';
import autoLoadPlugin from '@fastify/autoload';
import fastify, { FastifyServerOptions } from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = async (options: FastifyServerOptions) => {
  const app = fastify(
    Object.assign(options, {
      ajv: {
        customOptions: {
          removeAdditional: 'all',
          coerceTypes: true,
          useDefaults: true,
        },
      },
    }),
  );

  await app.register(configPlugin);
  await app.register(databasePlugin);
  await app.register(swaggerPlugin);

  await app.register(autoLoadPlugin, {
    dir: path.join(__dirname, 'routes'),
  });

  return app;
};
