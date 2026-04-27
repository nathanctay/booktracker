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