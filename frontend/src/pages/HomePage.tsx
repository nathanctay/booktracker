import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useEffect, useRef, useState } from 'react';
import { CompleteListItem, SortableListItem } from '../components/ListItem';
import type { ListItemBook } from '../types/ListItem';
import { markBookComplete } from '../utils/books';
import { rearrangeList } from '../utils/lists';

function HomePage() {
    const [books, setBooks] = useState<ListItemBook[]>([]);
    const incompleteBooks = books.filter(b => !b.book.complete)
    const completeBooks = books.filter(b => b.book.complete)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>()
    const completeBookTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        async function getList() {
            setLoading(true)
            try {
                const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list`, { credentials: 'include' })
                const list = await result.json()
                setBooks(list.listItems)
            } catch (e) {
                setError("Unable to fetch your books")
            } finally {
                setLoading(false)
            }
        }
        getList()
    }, [])


    function completeBook(book: ListItemBook) {
        if (completeBookTimeoutRef.current) {
            clearTimeout(completeBookTimeoutRef.current)
        }
        completeBookTimeoutRef.current = setTimeout(() => {
            console.log(book.book)
            const nowComplete = !book.book.complete
            console.log(nowComplete)

            const updatedList = books!.map(b => {
                if (b.book.id == book.book.id) {
                    return { ...b, book: { ...b.book, complete: nowComplete } }
                }
                return b
            })
            console.log(updatedList)

            if (nowComplete) {
                const index = updatedList.findIndex(b => b.book.id === book.book.id)
                const [item] = updatedList.splice(index, 1)
                updatedList.push(item)
            }

            if (!nowComplete) {
                const completeIndex = updatedList.findIndex(book => book.book.complete === true)
                const index = updatedList.findIndex(b => b.book.id === book.book.id)
                const [item] = updatedList.splice(index, 1)
                updatedList.splice(completeIndex, 0, item);
                console.log(item)
            }

            console.log(updatedList)

            setBooks(updatedList)
            markBookComplete(book.book.id, nowComplete)
            rearrangeList(updatedList)
            completeBookTimeoutRef.current = null
        }, 120) // timeout to allow time for css animation
    }

    return (
        <>
            <h1>Welcome</h1>
            <h2 className="text-[2rem]">What you're reading next</h2>
            {!loading && error && (
                <p className='text-red-500 my-4'>{error}</p>
            )}
            <div className="reading-list my-4">
                <div className="flex border-b px-4 mb-2">
                    <div className='w-6 flex place-items-center'>
                    </div>
                    <div className="flex-4">
                        <span className='font-bold'>Book</span>
                    </div>
                    <div className='flex-1'>Length</div>
                    <div className="w-6 justify-center items-center text-center">Finished</div>
                </div>
                {
                    !loading && incompleteBooks.length > 0 && (
                        <div className='my-2'>
                            <ul className='flex flex-col gap-2'>
                                <DragDropProvider
                                    onDragEnd={(event) => {
                                        if (event.canceled) return;

                                        const { source } = event.operation;

                                        if (isSortable(source)) {
                                            const { initialIndex, index } = source

                                            if (initialIndex !== index) {
                                                const newBooks = [...books];
                                                const [removed] = newBooks.splice(initialIndex, 1);
                                                newBooks.splice(index, 0, removed);
                                                setBooks(newBooks)
                                                rearrangeList(newBooks)
                                            }
                                        }
                                    }}
                                >
                                    {incompleteBooks.map((book, index) => {
                                        return (
                                            <SortableListItem book={book.book} index={index} handleCheck={() => completeBook(book)} key={book.book.id} />
                                        )
                                    })}
                                </DragDropProvider>
                            </ul>
                        </div>
                    )}
                {
                    !loading && completeBooks.length > 0 && (
                        <>
                            <h2 className='mb-2'>Completed books</h2>
                            <ul className='flex flex-col gap-2'>
                                {completeBooks.map((book) => {
                                    return (
                                        <CompleteListItem book={book.book} handleCheck={() => completeBook(book)} key={book.book.id} />
                                    )
                                })}
                            </ul>
                        </>
                    )}
            </div>
        </>
    )
}
export default HomePage