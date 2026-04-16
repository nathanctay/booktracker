export async function getBookInfo(bookId: number) {
    const query = `
    {
        books(where: {id: {_eq: ${bookId}}}) {
            book_series {
                series{
                    books_count
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
    return result
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
    return result
}

async function fetchHardcoverGraphQL(query: string) {
    try {
        const response = await fetch('https://api.hardcover.app/v1/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': process.env.HARDCOVER_KEY!
            },
            body: JSON.stringify({ query: query })
        })

        const result = await response.json()
        if (result.errors) {
            throw new Error(result.errors[0].message)
        }
        console.log(result)
        return result.data
    } catch (e) {
        throw e
    }

}



