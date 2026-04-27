import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getBookInfo } from "../utils/books"
import type { BookInfoResponse } from "../types/BookInfoResponse"
import { addToList } from "../utils/lists"
import type { ListItemList } from "../types/ListItem"

function BookInfoPage() {
    const params = useParams()
    const bookId = params.id
    const [bookInfo, setBookInfo] = useState<BookInfoResponse>()
    const [lists, setLists] = useState<ListItemList[]>([])
    const [exists, setExists] = useState(false)
    const [loading, setLoading] = useState(true)

    async function addToDefaultList() {
        await addToList({ hardcoverId: parseInt(bookId) })
    }

    useEffect(() => {
        async function getInfo() {
            setLoading(true)

            if (bookId) {
                const results = await getBookInfo(bookId)
                setBookInfo(results)
                if (results.saved && results.saved.length > 0) setExists(true)
            }

            if (exists) {
                const lists: ListItemList[] = []
                bookInfo.saved.map((book) => {
                    book.listItems.forEach(listItem => {
                        lists.push(listItem as ListItemList)
                    })
                })
                setLists(lists)
            }

            setLoading(false)
        }
        getInfo()

    }, [params])

    return (!loading && (
        <>
            <div className="gap-2.5 info-container grid">
                <div className=" info-image">
                    <img className="" src={exists ? bookInfo.saved[0].coverUrl : bookInfo.hardcover.image?.url} alt={`${exists ? bookInfo.saved[0].title : bookInfo.hardcover.title} cover`} />
                </div>
                <div className="bookinfo info-head">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl my-4">{exists ? bookInfo.saved[0].title : bookInfo.hardcover.title}</h1>
                    <p>by {exists ? bookInfo.saved[0].author.map((author, index) => (
                        <span key={author.name}>{index > 0 && '&'} {author.name}</span>
                    )) : bookInfo.hardcover.contributions.map((author, index) => (
                        <span>{index > 0 && ' &'} {author.author.name}</span>
                    ))}</p>
                    <p className="hidden md:block text-md text-gray-500 italic">{bookInfo.hardcover.headline}</p>
                </div>
                <div className="info-main">
                    <div className="flex flex-wrap my-3">
                        <div className="w-full md:w-1/2 lg:w-1/3 p-2">
                            <div className="bg-gray-100 shadow rounded-md px-2 py-2 flex gap-2 items-center h-full">
                                <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h280v-480H160v480Zm360 0h280v-480H520v480Zm-320-80h200v-80H200v80Zm0-120h200v-80H200v80Zm0-120h200v-80H200v80Zm360 240h200v-80H560v80Zm0-120h200v-80H560v80Zm0-120h200v-80H560v80ZM440-240v-480 480Z" /></svg>
                                <p>{exists ? bookInfo.saved[0].pageCount : bookInfo.hardcover.pages} <span className="small">pages</span></p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 p-2">
                            <div className="bg-gray-100 shadow rounded-md px-2 py-2 flex gap-2 items-center h-full">
                                <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-188.5-11.5Q280-423 280-440t11.5-28.5Q303-480 320-480t28.5 11.5Q360-457 360-440t-11.5 28.5Q337-400 320-400t-28.5-11.5ZM640-400q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-188.5-11.5Q280-263 280-280t11.5-28.5Q303-320 320-320t28.5 11.5Q360-297 360-280t-11.5 28.5Q337-240 320-240t-28.5-11.5ZM640-240q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" /></svg>
                                <p>{bookInfo.hardcover.release_year}</p>
                            </div>
                        </div>
                        {bookInfo.hardcover.book_series.length > 0 && (
                            <div className="w-full md:w-1/2 lg:w-1/3 p-2">
                                <div className="bg-gray-100 shadow rounded-md px-2 py-2 flex gap-2 items-center h-full">
                                    <svg className="h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M400-400h160v-80H400v80Zm0-120h320v-80H400v80Zm0-120h320v-80H400v80Zm-80 400q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                                    <div>
                                        <p>{bookInfo.hardcover.book_series[0].series.name}</p>
                                        <p className="small">{bookInfo.hardcover.book_series[0].position} of {bookInfo.hardcover.book_series[0].series.primary_books_count}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="md:hidden text-md text-gray-500 italic mb-4">{bookInfo.hardcover.headline}</p>
                    <p>{bookInfo.hardcover.description}</p>
                </div>
                <div className="info-lists flex flex-col gap-4">
                    <button className="shadow px-1 py-2 rounded-md bg-[var(--primary)] text-white" onClick={() => addToDefaultList()} >
                        Add to List
                    </button>
                    {lists.map((listItem) => {
                        if (listItem.list?.name != 'default') {
                            return (
                                <div key={listItem.id} className="bg-gray-100 shadow rounded-md px-2 py-2 flex flex-col gap-2 ">
                                    <p className="self-center">{listItem.list?.name}</p>
                                    <p className="small"># {listItem.position}</p>
                                </div>

                            )
                        }
                    })}
                </div>
            </div >

        </>
    ))
}
export default BookInfoPage