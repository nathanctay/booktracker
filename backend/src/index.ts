import { OpenAPIHono, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors'
import { getBookInfo, getBooks, getSeries, HardcoverError } from "./utils/books";
import { bookInfoRoute } from './routes/bookInfo';
import { seriesInfoRoute } from './routes/seriesInfo';
import { bookSearchRoute } from './routes/bookSearch';
import { addBookRoute, getBookRoute } from './routes/books';
import { db } from './db';
import { books, listItems, lists } from './db/schema';
import { eq } from 'drizzle-orm';
import { addListItemRoute, addListRoute, getListRoute } from './routes/lists';


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

app.use('/*', cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH', 'PUT'],
    allowHeaders: ['Content-Type']
}))

app.get('/', (c) => c.text("Hello World!"))

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
        return c.json(result)
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
        return c.json(result)
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

app.openapi(addBookRoute, async (c) => {
    const body = c.req.valid('json')
    try {
        const result = await db.insert(books).values({ ...body }).returning()
        return c.json(result, 200)
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

app.openapi(addListRoute, async (c) => {
    const body = c.req.valid('json')
    try {
        const result = await db.insert(lists).values({ ...body }).returning()
        return c.json(result, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.openapi(addListItemRoute, async (c) => {
    const body = c.req.valid('json')

    try {
        const result = await db.insert(listItems).values({ ...body }).returning()
        return c.json(result, 200)
    } catch (e) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})



export default app