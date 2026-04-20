import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const BookSearchParams = z.object({
    q: z
        .string()
        .openapi({
            param: {
                name: 'q',
                in: 'path',
            },
            example: "The Lord of the Rings",
        })
})

const BookSearchSchema = z.array(z.object({
    author: z.array(z.string()),
    coverUrl: z.url(),
    id: z.number(),
    pageCount: z.number().nullable(),
    title: z.string(),
}))

export const bookSearchRoute = createRoute({
    method: 'get',
    path: '/book-search/{q}',
    request: {
        params: BookSearchParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: BookSearchSchema,
                },
            },
            description: 'Retrieve information on a series',
        }, 400: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Returns an error',
        }, 500: {
            content: {
                'application/json': {
                    schema: UpstreamErrorSchema,
                },
            },
            description: 'Internal server error',
        }, 502: {
            content: {
                'application/json': {
                    schema: UpstreamErrorSchema,
                },
            },
            description: 'Upstream API error',
        }
    },
})