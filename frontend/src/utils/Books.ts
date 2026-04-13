export async function getBookInfo(bookId: string) {
    try {
        const response = await fetch(`https://openlibrary.org/books/${bookId}.json`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        return results
    } catch (err) {
        console.error(err.message)
    }
}

interface BookCoverProps {
    bookId: string;
    size: "S" | "M" | "L";
}

export async function getBookCover({ bookId, size = "M" }: BookCoverProps) {
    let key = ""
    if (key.startsWith("OL")) key = "OLID"
    else key = "ISBN"
    try {
        const url = `https://covers.openlibrary.org/b/${key}/${bookId}-${size}.jpg`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return url
    } catch (err) {
        console.error(err.message)
    }

}

export async function getBooks(searchQuery: string) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?${searchQuery}&limit=25`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const results = await response.json()
        return results.docs
    } catch (err) {
        console.error(err.message)
    }
}