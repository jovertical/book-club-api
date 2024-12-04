import { eq, getTableName } from 'drizzle-orm';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { NotFoundError } from 'http-errors-enhanced';

const requestUtilsPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('getBearerToken', function () {
    const authorization = this.headers.authorization;

    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
  });

  fastify.decorateRequest(
    'existsOrAbort',
    async function (table, column, subject) {
      const values = Array.isArray(subject) ? subject : [subject];

      for (const value of values) {
        const results = await fastify.db
          .select({ [column]: table[column] })
          .from(table)
          .where(eq(table[column], value));

        if (results.length === 0) {
          throw new NotFoundError(
            `No ${getTableName(table)} with ${column} = ${value}`,
            {
              header: { 'X-Req-Id': this.id },
              code: 'NOT_FOUND',
            },
          );
        }
      }
    },
  );
};

declare module 'fastify' {
  interface FastifyRequest {
    getBearerToken: () => string | undefined;
    existsOrAbort: <T extends TableConfig>(
      table: PgTableWithColumns<T>,
      column: keyof T['columns'],
      value: unknown,
    ) => Promise<void>;
  }
}

export default fp(requestUtilsPlugin);
