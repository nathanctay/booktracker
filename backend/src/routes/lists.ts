import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";
import { authMiddleware } from "@middleware/auth";

const ListIdParams = z.object({
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

const CreateListDto = z.object({
    name: z
        .string()
        .openapi({
            example: "Books to read"
        }),
    description: z
        .string()
        .optional()
        .openapi({
            example: "A list of books I want to read"
        }),
})

const UpdateListDto = CreateListDto.partial()

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
            addedAt: z.string().nullable(),
            book:
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
                }).nullable()
        })
    )
})
const GetListsSchema = z.array(
    z.object({
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
                addedAt: z.string().nullable(),
                book:
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
                    }).nullable()
            })
        )
    })
)

const ListRowSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        createdAt: z.string().nullable(),
    })
)

export const getListRoute = createRoute({
    method: 'get',
    path: '/list/{id}',
    request: {
        params: ListIdParams
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

export const getListsRoute = createRoute({
    method: 'get',
    path: '/lists',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetListsSchema,
                },
            },
            description: 'Retrieve lists from database',
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

export const getDefaultListRoute = createRoute({
    method: 'get',
    path: '/list',
    middleware: authMiddleware,
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetListSchema,
                },
            },
            description: 'Retrieve default list from database',
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

export const createListRoute = createRoute({
    method: 'post',
    path: '/list',
    middleware: authMiddleware,
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateListDto
                }
            }
        }
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: ListRowSchema,
                },
            },
            description: 'Create a list in the database',
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

export const updateListRoute = createRoute({
    method: 'patch',
    path: '/list/{id}',
    request: {
        params: ListIdParams,
        body: {
            content: {
                'application/json': {
                    schema: UpdateListDto
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ListRowSchema,
                },
            },
            description: 'Update a list in the database',
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

export const deleteListRoute = createRoute({
    method: 'delete',
    path: '/list/{id}',
    request: {
        params: ListIdParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ListRowSchema,
                },
            },
            description: 'Delete list from database',
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
