import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
    code: z.number().openapi({
        example: 400,
    }),
    message: z.string().openapi({
        example: 'Bad Request',
    }),
})

export const UpstreamErrorSchema = z.object({
    error: z.string().openapi({
        example: 'Failed to fetch data from upstream service',
    }),
})   