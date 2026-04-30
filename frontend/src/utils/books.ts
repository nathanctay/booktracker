export async function getBookInfo(bookId: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book-info/${bookId}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        return results
    } catch (err) {
        console.error(err.message)
    }
}

export async function searchBooks(searchQuery: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book-search/${searchQuery}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        return results
    } catch (err) {
        console.error(err.message)
    }
}

// date_started, last_read, and date_finished are managed by DB triggers
// based on changes to progress and complete columns  
export async function markBookComplete(bookId: number, complete: boolean) {
    const body = {
        complete,
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book/${bookId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const results = await response.json()

        return results
    } catch (err) {
        console.error(err.message)
    }
}

export async function updateBooksPosition(listItemId: number, position: number) {
    const body = {
        position
    }
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/listitem/${listItemId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const results = await response.json()

        return results
    } catch (err) {
        console.error(err.message)
    }
}