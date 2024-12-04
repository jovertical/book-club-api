import * as handlers from '@/routes/handlers/authors/index.js';
import {
  CreateAuthorFormSchema,
  WithRequiredParamSchema,
  UpdateAuthorFormSchema,
} from '@/schemas/authors.js';
import { ResourceCollectionQuerySchema } from '@/schemas/common.js';
import { FastifyTypebox } from '@/types/index.js';

const authors = async (server: FastifyTypebox) => {
  server.route({
    method: 'GET',
    url: '/authors',
    schema: { querystring: ResourceCollectionQuerySchema },
    preHandler: [server.authenticate],
    handler: handlers.getHandler,
  });

  server.route({
    method: 'POST',
    url: '/authors',
    schema: { body: CreateAuthorFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.createHandler,
  });

  server.route({
    method: 'GET',
    url: '/authors/:id',
    schema: { params: WithRequiredParamSchema },
    preHandler: [server.authenticate],
    handler: handlers.findHandler,
  });

  server.route({
    method: 'PUT',
    url: '/authors/:id',
    schema: { params: WithRequiredParamSchema, body: UpdateAuthorFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.updateHandler,
  });

  server.route({
    method: 'DELETE',
    url: '/authors/:id',
    schema: { params: WithRequiredParamSchema },
    preHandler: [server.authenticate],
    handler: handlers.deleteHandler,
  });
};

export default authors;
