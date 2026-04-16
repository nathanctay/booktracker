export async function getBookInfo(bookId: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book/${bookId}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        return results
    } catch (err) {
        console.error(err.message)
    }
}

export async function getBooks(searchQuery: string) {
    try {
        console.log(import.meta.env.VITE_BACKEND_URL)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/books/${searchQuery}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        console.log(results)
        return results
    } catch (err) {
        console.error(err.message)
    }
}