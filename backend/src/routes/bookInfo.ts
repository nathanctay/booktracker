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
    hardcover: z.object({
        book_series: z.array(z.object({
            position: z.number(),
            series: z.object({
                primary_books_count: z.number(),
                id: z.number(),
                name: z.string()
            })
        })),
        contributions: z.array(z.object({
            author: z.object({
                name: z.string()
            }),
            contribution: z.string().optional(),
            contributable_type: z.enum(["Book", "Edition"])
        })),
        description: z.string().optional(),
        headline: z.string().optional(),
        image: z.object({
            url: z.url()
        }).optional(),
        pages: z.number().optional(),
        release_year: z.number().optional(),
        title: z.string()
    }),
    saved: z.array(
        z.object({
            title: z.string(),
            id: z.number(),
            author: z.array(
                z.object({
                    name: z.string()
                })
            ),
            hardcoverId: z.number(),
            pageCount: z.number(),
            coverUrl: z.url(),
            progress: z.number().nullable(),
            complete: z.boolean().nullable(),
            dateStarted: z.string().nullable(),
            dateFinished: z.string().nullable(),
            lastRead: z.string().nullable(),
            listItems: z.array(
                z.object({
                    id: z.number(),
                    position: z.number().nullable(),
                    bookId: z.number().nullable(),
                    listId: z.number().nullable(),
                    addedAt: z.string().nullable(),
                    list:
                        z.object({
                            description: z.string().nullable(),
                            name: z.string(),
                            id: z.number(),
                            createdAt: z.string().nullable(),
                        }).nullable()
                })
            )
        })
    ).nullable()
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