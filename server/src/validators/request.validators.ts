
import { z } from "zod";

export const createRequestSchema = z
  .object({
    title: z.string().trim().min(5).max(150),
    description: z.string().trim().min(10).max(5000),
    context: z.string().trim().max(3000).optional(),
    categoryId: z.uuid(),
    tagIds: z.array(z.uuid()).max(10).refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate tag IDs are not allowed",
    ).optional(),
  })
  .strict();

export const requestIdParamSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export const requestListQuerySchema = z
  .object({
    status: z.enum(["open", "accepted", "closed"]).default("open"),
    categoryId: z.uuid().optional(),
    tagIds: z
      .string()
      .optional()
      .transform((value) => value?.split(",").filter(Boolean))
      .pipe(
        z.array(z.uuid()).max(10).optional(),
      ),
    q: z.string().trim().min(1).max(100).optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type RequestListQuery = z.infer<typeof requestListQuerySchema>;
