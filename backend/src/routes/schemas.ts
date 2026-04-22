import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
    code: z.number().openapi({
        example: 400,
    }),
    message: z.string().openapi({
        example: 'Bad Request',
    }),
    errors: z.record(z.string(), z.array(z.string())).openapi({
        example: '{"id":["Invalid input: expected number, received NaN"]}'
    }),
    formErrors: z.array(z.string()).optional()
})

export const UpstreamErrorSchema = z.object({
    error: z.string().openapi({
        example: 'Failed to fetch data from upstream service',
    }),
})   