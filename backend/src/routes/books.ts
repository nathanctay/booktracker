import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const GetBookParams = z.object({
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

const AddBookParams = z.object({
    hardcoverId: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'hardcoverId',
                in: 'path',
            },
            example: 1234,
        }),
    title: z
        .string()
        .openapi({
            param: {
                name: 'title',
                in: 'path'
            },
            example: "The Lord of the Rings"
        }),
    pageCount: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'pageCount',
                in: 'path',
            },
            example: 700,
        }),
    author: z
        .string()
        .openapi({
            param: {
                name: 'author',
                in: 'path'
            },
            example: "Frank Herbert"
        }),
    coverUrl: z
        .url()
        .openapi({
            param: {
                name: 'coverUrl',
                in: 'path'
            },
            example: "https://assets.hardcover.app/editions/abc123.jpg"
        }),
})

const GetBookSchema = z.object({
    title: z.string(),
    id: z.number(),
    author: z.string(),
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
            addedAt: z.date().nullable(),
            list:
                z.object({
                    description: z.string().nullable(),
                    name: z.string(),
                    id: z.number(),
                    createdAt: z.date().nullable(),
                }).nullable()
        })
    )
})

const AddBookSchema = z.array(
    z.object({
        title: z.string(),
        id: z.number(),
        author: z.string(),
        pageCount: z.number(),
        hardcoverId: z.number(),
        progress: z.number().nullable(),
        complete: z.boolean().nullable(),
        dateStarted: z.string().nullable(),
        dateFinished: z.string().nullable(),
        lastRead: z.string().nullable(),
    })
)

export const getBookRoute = createRoute({
    method: 'get',
    path: '/book/{id}',
    request: {
        params: GetBookParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetBookSchema,
                },
            },
            description: 'Retrieve book from database',
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
        }, 404: {
            content: {
                'application/json': {
                    schema: UpstreamErrorSchema,
                },
            },
            description: 'Record not found',
        }
    },
})

export const addBookRoute = createRoute({
    method: 'post',
    path: '/add-book',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: AddBookParams
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: AddBookSchema,
                },
            },
            description: 'Add a book to the database',
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
        }
    },
})