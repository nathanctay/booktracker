import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, UpstreamErrorSchema } from "./schemas";
import { authMiddleware } from "@middleware/auth";

const BookIdParams = z.object({
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

const CreateBookDto = z.object({
    hardcoverId: z
        .coerce
        .number()
        .openapi({
            example: 1234,
        }),
    // title: z
    //     .string()
    //     .openapi({
    //         example: "The Lord of the Rings"
    //     }),
    // pageCount: z
    //     .coerce
    //     .number()
    //     .openapi({
    //         example: 700,
    //     }),
    // author: z
    //     .string()
    //     .openapi({
    //         example: "Frank Herbert"
    //     }),
    // coverUrl: z
    //     .url()
    //     .openapi({
    //         example: "https://assets.hardcover.app/editions/abc123.jpg"
    //     }),
})

const UpdateBookDto = z.object({
    hardcoverId: z
        .coerce
        .number()
        .openapi({
            example: 1234,
        }),
    title: z
        .string()
        .openapi({
            example: "The Lord of the Rings"
        }),
    pageCount: z
        .coerce
        .number()
        .openapi({
            example: 700,
        }),
    author: z
        .string()
        .openapi({
            example: "Frank Herbert"
        }),
    coverUrl: z
        .url()
        .openapi({
            example: "https://assets.hardcover.app/editions/abc123.jpg"
        }),
    progress: z.number().nullable(),
    complete: z.boolean().nullable(),
}).partial()

const GetBookSchema = z.object({
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

const GetBooksSchema = z.array(
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
)

const BookRowSchema = z.array(
    z.object({
        title: z.string(),
        id: z.number(),
        author: z.array(
            z.object({
                name: z.string()
            })
        ),
        pageCount: z.number(),
        coverUrl: z.url(),
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
        params: BookIdParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetBookSchema,
                },
            },
            description: 'Retrieve book from the database',
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

export const getBooksRoute = createRoute({
    method: 'get',
    path: '/books',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GetBooksSchema,
                },
            },
            description: 'Retrieve books from the database',
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

export const createBookRoute = createRoute({
    method: 'post',
    path: '/book',
    middleware: authMiddleware,
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateBookDto
                }
            }
        }
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: BookRowSchema,
                },
            },
            description: 'Create a book in the database',
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

export const updateBookRoute = createRoute({
    method: 'patch',
    path: '/book/{id}',
    request: {
        params: BookIdParams,
        body: {
            content: {
                'application/json': {
                    schema: UpdateBookDto
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: BookRowSchema,
                },
            },
            description: 'Update a book in the database',
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

export const deleteBookRoute = createRoute({
    method: 'delete',
    path: '/book/{id}',
    request: {
        params: BookIdParams
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: BookRowSchema,
                },
            },
            description: 'Delete a book from the database',
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