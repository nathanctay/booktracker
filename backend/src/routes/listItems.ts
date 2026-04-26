import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";

const ListItemIdParams = z.object({
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

const CreateListItemDto = z.object({
    bookId: z
        .coerce
        .number()
        .openapi({
            example: 1234,
        }),
    listId: z
        .coerce
        .number()
        .optional()
        .openapi({
            example: 1234,
            description: "if omitted, defaults to the users default list"
        }),
    position: z
        .coerce
        .number()
        .openapi({
            example: 1,
        }),
})

const UpdateListItemDto = CreateListItemDto.partial()

const GetListItemSchema = z.object({
    id: z.number(),
    bookId: z.number(),
    listId: z.number(),
    position: z.number(),
    addedAt: z.string().nullable(),
    book: z.object({
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
    }).nullable(),
    list: z.object({
        description: z.string().nullable(),
        name: z.string(),
        id: z.number(),
        createdAt: z.string().nullable(),
    }).nullable()

})

const ListItemRowSchema = z.array(
    z.object({
        id: z.number(),
        bookId: z.number(),
        listId: z.number(),
        position: z.number(),
        addedAt: z.string().nullable(),
    })
)

export const getListItemRoute = createRoute({
    method: 'get',
    path: '/listitem/{id}',
    request: {
        params: ListItemIdParams,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetListItemSchema,
                },
            },
            description: 'Get a list item',
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

export const createListItemRoute = createRoute({
    method: 'post',
    path: '/listitem',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateListItemDto
                }
            }
        }
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: ListItemRowSchema,
                },
            },
            description: 'Create a list item to associate a book with a list',
        }, 400: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Returns an error',
        }, 404: {
            content: {
                'application/json': {
                    schema: UpstreamErrorSchema,
                },
            },
            description: 'Record not found',
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

export const updateListItemRoute = createRoute({
    method: 'patch',
    path: '/listitem/{id}',
    request: {
        params: ListItemIdParams,
        body: {
            content: {
                'application/json': {
                    schema: UpdateListItemDto
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ListItemRowSchema,
                },
            },
            description: 'Update a list item',
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

export const deleteListItemRoute = createRoute({
    method: 'delete',
    path: '/listitem/{id}',
    request: {
        params: ListItemIdParams,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ListItemRowSchema,
                },
            },
            description: 'Delete a list item',
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