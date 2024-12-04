import * as handlers from '@/routes/handlers/books/index.js';
import {
  CreateBookFormSchema,
  WithRequiredParamSchema,
  UpdateBookFormSchema,
} from '@/schemas/books.js';
import { ResourceCollectionQuerySchema } from '@/schemas/common.js';
import { FastifyTypebox } from '@/types/index.js';

const books = async (server: FastifyTypebox) => {
  server.route({
    method: 'GET',
    url: '/books',
    schema: { querystring: ResourceCollectionQuerySchema },
    preHandler: [server.authenticate],
    handler: handlers.getHandler,
  });

  server.route({
    method: 'POST',
    url: '/books',
    schema: { body: CreateBookFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.createHandler,
  });

  server.route({
    method: 'GET',
    url: '/books/:id',
    schema: { params: WithRequiredParamSchema },
    preHandler: [server.authenticate],
    handler: handlers.findHandler,
  });

  server.route({
    method: 'PUT',
    url: '/books/:id',
    schema: { params: WithRequiredParamSchema, body: UpdateBookFormSchema },
    preHandler: [server.authenticate],
    handler: handlers.updateHandler,
  });

  server.route({
    method: 'DELETE',
    url: '/books/:id',
    schema: { params: WithRequiredParamSchema },
    // preHandler: [server.authenticate],
    handler: handlers.deleteHandler,
  });
};

export default books;
