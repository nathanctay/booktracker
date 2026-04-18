import { Hono } from "hono";
import { cors } from 'hono/cors'
import { getBookInfo, getBooks, getSeries } from "./utils/books";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = new Hono()
const db = drizzle(process.env.DATABASE_URL!);

app.get('/', (c) => c.text("Hello World!"))

app.use('/*', cors({ origin: 'http://localhost:5173' }))

app.get('/book/:id', async (c) => {
    const bookId = parseInt(c.req.param('id'))
    const result = await getBookInfo(bookId)

    return c.json(result)

})

app.get('/series/:id', async (c) => {
    const bookId = parseInt(c.req.param('id'))
    const result = await getSeries(bookId)

    return c.json(result)

})

app.get('/books/:q', async (c) => {
    const searchQuery = c.req.param('q')
    const result = await getBooks(searchQuery)
    const bookList = result.search.results.hits.map((book) => {
        return {
            id: book.document.id,
            title: book.document.title,
            pageCount: book.document.pages,
            author: book.document.author_names.map((author, index) => {
                if (book.document.contribution_types[index] == 'Author') {
                    return author
                }
            }),
            coverUrl: book.document.image.url
        }
        /*
        interface Book {
            id: number | string;
            title: string;
            pageCount: number;
            author: string;
            coverUrl: string;
        }
        */
    })
    return c.json(bookList)
})

export default app