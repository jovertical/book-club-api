import { SortOrder } from '@/types/index.js';
import { Type } from '@sinclair/typebox';

export const ResourceCollectionQuerySchema = Type.Object({
  cursor: Type.Optional(Type.Number()),
  size: Type.Optional(Type.Number()),
  sort_by: Type.Optional(Type.String()),
  sort_order: Type.Optional(Type.Enum(SortOrder)),
});
