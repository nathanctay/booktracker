export class HardcoverError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HardcoverError'
    }
}

interface BookInfo {
    book_series: {
        position: number,
        series: {
            primary_books_count: number,
            id: number,
            name: string
        }
    }[],
    contributions: {
        author: {
            name: string
        },
        contribution?: string,
        contributable_type: "Book" | "Edition"
    }[],
    description?: string,
    headline?: string,
    image?: {
        url: string
    },
    pages?: number,
    release_year?: number,
    title: string
}

export async function getBookInfo(bookId: number): Promise<BookInfo> {
    const query = `
    {
        books(where: {id: {_eq: ${bookId}}}) {
            book_series {
                position
                series{
                    primary_books_count
                    id
                    name
                }
            }
            contributions {
                author {
                    name
                }
                contribution
                contributable_type
            }
            description
            headline
            image {
                url
            }
            pages
            release_year
            title
        }
    }
    `
    const result = await fetchHardcoverGraphQL(query)
    return result.books[0]
}

export async function getBooks(search: string, page = 1) {
    const query = `
    {
        search(
            query: "${search}",
            query_type: "Book",
            per_page: 5,
            page: ${page},
            sort: "activities_count:desc"
        ) {
            results
        }
    }
  `

    const result = await fetchHardcoverGraphQL(query)

    const bookList = result.search.results.hits.map((book) => {
        return {
            id: book.document.id,
            title: book.document.title,
            pageCount: book.document.pages,
            author: book.document.author_names.filter((author, index) => {
                return (book.document.contribution_types[index] == 'Author')
            }),
            coverUrl: book.document.image.url
        }
    })

    return bookList
}

export async function getSeries(seriesId: number) {
    const query = `
    {
        series(where: {id: {_eq: ${seriesId}}}) {
            author {
                name
            }
            book_series(order_by: {book: {activities_count: desc}, position: asc}) {
                book {
                    description
                    headline
                    image{
                        url
                    }
                    pages
                    release_year
                    title
                }
                position
            }
            books_count
            description
            name
            primary_books_count
        }
    }
    `
    const result = await fetchHardcoverGraphQL(query)
    return result.series[0]
}

async function fetchHardcoverGraphQL(query: string) {
    const response = await fetch('https://api.hardcover.app/v1/graphql', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': process.env.HARDCOVER_KEY!
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json() as any
    if (result.error) {
        throw new HardcoverError(result.error)
    }
    if (result.errors) {
        throw new HardcoverError(result.errors[0].message)
    }
    return result.data


}



