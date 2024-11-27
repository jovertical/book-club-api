import autoLoad from '@fastify/autoload';
import fastify, { FastifyServerOptions } from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (opts: FastifyServerOptions) => {
  const app = fastify(opts);

  app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    forceESM: true,
  });

  return app;
};
