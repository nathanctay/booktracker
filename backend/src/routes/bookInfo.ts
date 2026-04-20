import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const BookInfoParams = z.object({
    id: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'id',
                in: 'path',
            },
            example: 1234,
        })
})

const BookInfoSchema = z.object({
    book_series: z.array(z.object({
        position: z.number(),
        series: z.object({
            books_count: z.number(),
            id: z.number(),
            name: z.string()
        })
    })),
    contributions: z.array(z.object({
        author: z.object({
            name: z.string()
        }),
        contribution: z.string().nullable(),
        contributable_type: z.enum(["Book", "Edition"])
    })),
    headline: z.string().nullable(),
    image: z.object({
        url: z.url()
    }).nullable(),
    pages: z.number().nullable(),
    release_year: z.number().nullable(),
    title: z.string()
})

export const bookInfoRoute = createRoute({
    method: 'get',
    path: '/book-info/{id}',
    request: {
        params: BookInfoParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: BookInfoSchema,
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