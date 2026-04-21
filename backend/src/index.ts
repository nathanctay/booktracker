import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors'
import { getBookInfo, getBooks, getSeries, HardcoverError } from "./utils/books";
import { bookInfoRoute } from './routes/bookInfo';
import { seriesInfoRoute } from './routes/seriesInfo';
import { bookSearchRoute } from './routes/bookSearch';
import { addBookRoute, getBookRoute } from './routes/books';
import { db } from './db';
import { books } from './db/schema';
import { eq } from 'drizzle-orm';


const app = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            let errorMessage = JSON.parse(result.error.message)[0].message
            return c.json(
                {
                    code: 400,
                    message: errorMessage,
                },
                400
            )
        }
    }
})

app.use('/*', cors({ origin: 'http://localhost:5173' }))

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


app.openapi(addBookRoute, async (c) => {
    const body = c.req.valid('json')
    try {
        const result = await db.insert(books).values({ ...body }).returning()
        return c.json(result, 200)
    } catch (e) {
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
// TODO



// app.post('/createList', async (c) => {
//     const { name, description } = await c.req.json()
//     console.log(name, description)

//     const result = await db.insert(lists).values({ name, description }).returning()
//     return c.json(result)
// })

// app.post('/addBooksToList', async (c) => {
//     const body = await c.req.json()

//     const result = await db.insert(listItems).values({ ...body }).returning()
//     return c.json(result)
// })

// app.get('/getList/:id', async (c) => {
//     const listId = await c.req.param('id')

//     const listInfo = await db.query.lists.findFirst({
//         where: eq(lists.id, parseInt(listId)),
//         with: {
//             listItems: {
//                 with: { book: true }
//             }
//         }
//     })

//     console.log(listInfo)
//     return c.json(listInfo)
// })

export default app