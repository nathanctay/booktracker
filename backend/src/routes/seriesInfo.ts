import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const SeriesInfoParams = z.object({
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

const SeriesInfoSchema = z.object({
    author: z.object({
        name: z.string()
    }),
    book_series: z.array(z.object({
        book: z.object({
            description: z.string().nullable(),
            headline: z.string().nullable(),
            image: z.object({
                url: z.url()
            }).nullable(),
            pages: z.number().nullable(),
            release_year: z.number().nullable(),
            title: z.string()
        }),
        position: z.number()
    })),
    books_count: z.number(),
    description: z.string().nullable(),
    name: z.string(),
    primary_books_count: z.number()
})



export const seriesInfoRoute = createRoute({
    method: 'get',
    path: '/series-info/{id}',
    request: {
        params: SeriesInfoParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: SeriesInfoSchema,
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