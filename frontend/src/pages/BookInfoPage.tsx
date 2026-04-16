import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getBookInfo } from "../utils/books"

function BookInfoPage() {
    const params = useParams()
    const bookId = params.id
    const [bookInfo, setBookInfo] = useState({})

    useEffect(() => {
        async function getInfo() {
            if (bookId) {
                const results = await getBookInfo(bookId)
                setBookInfo(results)
                console.log(results)
            }
        }

        getInfo()
    }, [params])

    return (
        <div>BookInfoPage</div>
    )
}
export default BookInfoPage