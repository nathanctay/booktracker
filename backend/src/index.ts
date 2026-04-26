import { OpenAPIHono, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors'
import { getBookInfo, getBooks, getSeries, HardcoverError } from "./utils/books";
import { bookInfoRoute } from './routes/bookInfo';
import { seriesInfoRoute } from './routes/seriesInfo';
import { bookSearchRoute } from './routes/bookSearch';
import { createBookRoute, deleteBookRoute, getBookRoute, getBooksRoute, updateBookRoute } from './routes/books';
import { db } from './db';
import { books, listItems, lists, user } from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { createListRoute, deleteListRoute, getDefaultListRoute, getListRoute, getListsRoute, updateListRoute } from './routes/lists';
import { createListItemRoute, deleteListItemRoute, getListItemRoute, updateListItemRoute } from './routes/listItems';
import { auth } from './utils/auth';
import { authMiddleware } from './middleware/auth';


const app = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            const { fieldErrors, formErrors } = result.error.flatten()
            return c.json(
                {
                    code: 400,
                    message: 'Validation failed',
                    errors: fieldErrors,
                    ...(formErrors.length > 0 && { formErrors }),
                },
                400
            )
        }
    }
})

app.use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (session) {
        c.set('user', session.user)
        await db.execute(sql`SELECT set_config('app.current_user_id', ${session.user.id}, false)`)
    }
    const result = await db.execute(sql`SELECT current_setting('app.current_user_id', true) as user_id`)
    await next()
})

app.use(
    "/auth/*",
    cors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

app.on(['POST', 'GET'], '/auth/*', (c) => {
    return auth.handler(c.req.raw)
})

app.use('/*', cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type'],
    credentials: true,
}))

app.get('/', (c) => c.text("Hello World!"))

// app.use('/book/*', authMiddleware)
// app.use('/list/*', authMiddleware)

app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
    },
})

app.openapi(bookInfoRoute, async (c) => {
    const { id: bookId } = c.req.valid('param')

    try {
        const result = await getBookInfo(bookId)

        return c.json(result, 200)
    } catch (e) {
        if (e instanceof HardcoverError) {
            return c.json({ error: e.message }, 502)
        }

        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(seriesInfoRoute, async (c) => {
    const { id: seriesId } = c.req.valid('param')

    try {
        const result = await getSeries(seriesId)

        return c.json(result, 200)
    } catch (e) {
        if (e instanceof HardcoverError) {
            return c.json({ error: e.message }, 502)
        }

        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(bookSearchRoute, async (c) => {
    const { q } = c.req.valid('param')

    try {
        const result = await getBooks(q)

        return c.json(result, 200)
    } catch (e) {
        if (e instanceof HardcoverError) {
            return c.json({ error: e.message }, 502)
        }

        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getBookRoute, async (c) => {
    const { id: bookId } = c.req.valid('param')

    try {
        const bookInfo = await db.query.books.findFirst({
            where: eq(books.id, bookId),
            with: {
                listItems: {
                    with: { list: true }
                }
            }
        })

        if (!bookInfo) {
            return c.json({ error: 'Book not found' }, 404)
        }

        return c.json(bookInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getBooksRoute, async (c) => {
    try {
        const bookInfo = await db.query.books.findMany({
            with: {
                listItems: {
                    with: { list: true }
                }
            }
        })

        return c.json(bookInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(createBookRoute, async (c) => {
    const body = c.req.valid('json')
    const user = c.get('user')
    try {
        const result = await db
            .insert(books)
            .values({ ...body, userId: user.id })
            .returning()

        return c.json(result, 201)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(updateBookRoute, async (c) => {
    const { id: bookId } = c.req.valid('param')
    const body = c.req.valid('json')

    try {
        const bookInfo = await db
            .update(books)
            .set({ ...body })
            .where(eq(books.id, bookId))
            .returning()

        if (bookInfo.length === 0) {
            return c.json({ error: 'Book not found' }, 404)
        }

        return c.json(bookInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(deleteBookRoute, async (c) => {
    const { id: bookId } = c.req.valid('param')

    try {
        const bookInfo = await db
            .delete(books)
            .where(eq(books.id, bookId))
            .returning()

        if ((bookInfo.length === 0)) {
            return c.json({ error: 'Book not found' }, 404)
        }

        return c.json(bookInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getListRoute, async (c) => {
    const { id: listId } = c.req.valid('param')

    try {
        const listInfo = await db.query.lists.findFirst({
            where: eq(lists.id, listId),
            with: {
                listItems: {
                    with: { book: true }
                }
            }
        })

        if (!listInfo) {
            return c.json({ error: 'List not found' }, 404)
        }

        return c.json(listInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getListsRoute, async (c) => {
    try {
        const listInfo = await db.query.lists.findMany({
            with: {
                listItems: {
                    with: { book: true }
                }
            }
        })

        return c.json(listInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getDefaultListRoute, async (c) => {
    const user = c.get('user')

    try {
        const listInfo = await db.query.lists.findFirst({
            where: eq(lists.isDefault, true),
            with: {
                listItems: {
                    with: { book: true }
                }
            }
        })

        if (!listInfo) {
            await db
                .insert(lists)
                .values({ name: "default", userId: user.id, isDefault: true })

            const newList = await db.query.lists.findFirst({
                where: eq(lists.isDefault, true),
                with: {
                    listItems: {
                        with: { book: true }
                    }
                }
            })
            return c.json(newList, 200)
        }

        return c.json(listInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(createListRoute, async (c) => {
    const body = c.req.valid('json')
    const user = c.get('user')

    try {
        const result = await db.insert(lists).values({ ...body, userId: user.id }).returning()

        return c.json(result, 201)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(updateListRoute, async (c) => {
    const { id: listId } = c.req.valid('param')
    const body = c.req.valid('json')

    try {
        const listInfo = await db
            .update(lists)
            .set({ ...body })
            .where(eq(lists.id, listId))
            .returning()

        if (listInfo.length === 0) {
            return c.json({ error: 'List not found' }, 404)
        }

        return c.json(listInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(deleteListRoute, async (c) => {
    const { id: listId } = c.req.valid('param')

    try {
        const listInfo = await db
            .delete(lists)
            .where(eq(lists.id, listId))
            .returning()

        if (listInfo.length === 0) {
            return c.json({ error: 'List not found' }, 404)
        }

        return c.json(listInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(createListItemRoute, async (c) => {
    const body = c.req.valid('json')
    let listId = body.listId
    try {
        if (!body.listId) {
            const listInfo = await db.query.lists.findFirst({
                where: eq(lists.isDefault, true),
            })

            if (!listInfo) {
                return c.json({ error: 'Default list not found' }, 404)
            }

            listId = listInfo.id
        }
        const result = await db.insert(listItems).values({ ...body, listId: listId! }).returning()

        return c.json(result, 201)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(getListItemRoute, async (c) => {
    const { id: listItemId } = c.req.valid('param')

    try {
        const listItemInfo = await db.query.listItems.findFirst({
            where: eq(listItems.id, listItemId),
            with: {
                list: true,
                book: true,
            },
        })

        if (!listItemInfo) {
            return c.json({ error: 'List Item not found' }, 404)
        }

        return c.json(listItemInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(updateListItemRoute, async (c) => {
    const { id: listItemId } = c.req.valid('param')
    const body = c.req.valid('json')

    try {
        const listItemInfo = await db
            .update(listItems)
            .set({ ...body })
            .where(eq(listItems.id, listItemId))
            .returning()

        if (listItemInfo.length === 0) {
            return c.json({ error: 'List Item not found' }, 404)
        }
        return c.json(listItemInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(deleteListItemRoute, async (c) => {
    const { id: listItemId } = c.req.valid('param')
    try {
        const listItemInfo = await db
            .delete(listItems)
            .where(eq(listItems.id, listItemId))
            .returning()

        if (listItemInfo.length === 0) {
            return c.json({ error: 'List Item not found' }, 404)
        }
        return c.json(listItemInfo, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

export default app