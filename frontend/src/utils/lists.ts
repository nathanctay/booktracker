interface addToListParams { bookId?: number, listId?: number, position?: number, hardcoverId?: number }

export async function addToList({ bookId, listId, position, hardcoverId }: addToListParams) {
    let book = bookId
    if (hardcoverId) {
        const body = { hardcoverId: hardcoverId }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book`, {
            method: 'post',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const result = await response.json()
        book = result[0].id
    }
    const body = { bookId: book, listId, position }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/listitem`, {
        method: 'post',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    const result = await response.json()
    return result

}