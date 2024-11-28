import autoLoad from '@fastify/autoload';
import fastify, { FastifyServerOptions } from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'url';

import configPlugin from './plugins/config.js';
import dbPlugin from './plugins/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (opts: FastifyServerOptions) => {
  const app = fastify(
    Object.assign(opts, {
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
  await app.register(dbPlugin);

  await app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
  });

  return app;
};
