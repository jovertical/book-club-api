import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase, NodePgClient } from 'drizzle-orm/node-postgres';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const databasePlugin: FastifyPluginAsync = async (server) => {
  const database = drizzle(server.config.DATABASE_URL);

  server.decorate('db', database);
};

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase<Record<string, never>> & {
      $client: NodePgClient;
    };
  }
}

export default fp(databasePlugin);