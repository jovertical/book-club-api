import { NodeEnvironment } from '@/types/index.js';
import { Static, Type } from '@sinclair/typebox';
import { Ajv } from 'ajv';
import 'dotenv/config';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnvironment),
  APP_HOST: Type.String(),
  APP_PORT: Type.String(),
  DATABASE_URL: Type.String(),
});

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);

  if (!valid) {
    throw new Error(
      '.env file validation failed - ' +
        JSON.stringify(validate.errors, undefined, 2),
    );
  }

  server.decorate('config', process.env as unknown as Config);
};

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin);
