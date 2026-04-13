import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"
import { getBookInfo, getBooks } from "../utils/OpenLibrary";

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || "");
    const [books, setBooks] = useState([])

    useEffect(() => {
        console.log(books)
    }, [books])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setSearchParams(`?q=${search}`)
        }, 500)
        console.log(search)
        return () => clearTimeout(debounceTimer)
    }, [search])

    useEffect(() => {
        if (searchParams.get('q') != '') {
            console.log(searchParams.toString())
            // getBookResults()
        }
    }, [searchParams])

    async function getBookResults() {
        console.log(searchParams.toString())
        let books = await getBooks(searchParams.toString())
        setBooks(books)
    }



    return (
        <>
            <div>SearchPage</div>
            <input value={search} type="text" className="border rounded-sm w-full px-4 py-2 outline-[#ff0000]" onChange={(event) => setSearch(event.target.value)} />
            {
                books.length > 0 && (
                    <ul className="flex flex-col gap-2 mt-4">
                        {books.map((book, index) => {
                            return (
                                <li onClick={() => console.log(book)}>
                                    <div className="flex border rounded-md pl-2 pr-4 py-2 gap-2">
                                        <div>
                                            <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt={`${book.title} cover`} />
                                        </div>
                                        <div className="flex-4">
                                            <span className='font-bold'>{book.title}</span> <span className='text-sm'>{book.author && `by ${book.author}`}</span>
                                        </div>
                                        <div className='flex-1'>{book.pageCount} <span className='small'>pages</span></div>
                                    </div>
                                </li >
                            )
                        })}
                    </ul>
                )
            }
        </>
    )
}
export default SearchPage