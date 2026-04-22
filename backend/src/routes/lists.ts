import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const GetListParams = z.object({
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

const AddListParams = z.object({
    name: z
        .string()
        .openapi({
            param: {
                name: 'name',
                in: 'path'
            },
            example: "Books to read"
        }),
    description: z
        .string()
        .optional()
        .openapi({
            param: {
                name: 'description',
                in: 'path'
            },
            example: "A list of books I want to read"
        }),
})

const AddListItemParams = z.object({
    bookId: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'bookId',
                in: 'path',
            },
            example: 1234,
        }),
    listId: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'listId',
                in: 'path',
            },
            example: 1234,
        }),
    position: z
        .coerce
        .number()
        .openapi({
            param: {
                name: 'position',
                in: 'path',
            },
            example: 1,
        }),
})

const GetListSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.string().nullable(),
    listItems: z.array(
        z.object({
            id: z.number(),
            position: z.number().nullable(),
            bookId: z.number().nullable(),
            listId: z.number().nullable(),
            addedAt: z.date().nullable(),
            book:
                z.object({
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
                }).nullable()
        })
    )
})

const AddListSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        createdAt: z.string().nullable(),
    })
)

const AddListItemSchema = z.array(
    z.object({
        id: z.number(),
        bookId: z.number(),
        listId: z.number(),
        position: z.number(),
        addedAt: z.string().nullable(),
    })
)

export const getListRoute = createRoute({
    method: 'get',
    path: '/list/{id}',
    request: {
        params: GetListParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetListSchema,
                },
            },
            description: 'Retrieve list from database',
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

export const addListRoute = createRoute({
    method: 'post',
    path: '/add-list',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: AddListParams
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: AddListSchema,
                },
            },
            description: 'Add a list to the database',
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

export const addListItemRoute = createRoute({
    method: 'post',
    path: '/add-listitem',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: AddListItemParams
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: AddListItemSchema,
                },
            },
            description: 'Add a book to a list',
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