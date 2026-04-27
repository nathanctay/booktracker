import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useEffect, useState } from 'react';
import { SortableListItem } from '../components/ListItem';
import type { ListItemBook } from '../types/ListItem';

function HomePage() {
    const [books, setBooks] = useState<ListItemBook[]>([]);

    useEffect(() => {
        async function getList() {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list`, { credentials: 'include' })
            const list = await result.json()
            setBooks(list.listItems)
        }
        getList()
    }, [])

    function completeBook(book: ListItemBook) {
        const updatedList = books!.map(b => {
            if (b.book.id == book.book.id) {
                b.book.complete = book.book.complete ? !book.book.complete : true
            }
            return b
        })
        setBooks(updatedList)
    }

    return (
        <>
            <h1>Welcome</h1>
            <h2 className="text-[2rem]">What you're reading next</h2>
            <div className="reading-list my-[16px]">
                <div className="flex border-b px-4 mb-2">
                    <div className='w-[1.5rem] flex place-items-center'>
                    </div>
                    <div className="flex-4">
                        <span className='font-bold'>Book</span>
                    </div>
                    <div className='flex-1'>Length</div>
                    <div className="w-[1.5rem] justify-center items-center text-center">Finished</div>
                </div>{
                    books.length > 0 && (
                        <ul className='flex flex-col gap-2'>
                            <DragDropProvider
                                onDragEnd={(event) => {
                                    if (event.canceled) return;

                                    const { source } = event.operation;

                                    if (isSortable(source)) {
                                        const { initialIndex, index } = source

                                        if (initialIndex !== index) {
                                            setBooks((books) => {
                                                const newBooks = [...books];
                                                const [removed] = newBooks.splice(initialIndex, 1);
                                                newBooks.splice(index, 0, removed);
                                                return newBooks
                                            })
                                        }
                                    }
                                }}
                            >
                                {books.map((book, index) => {
                                    return (
                                        <SortableListItem book={book.book} index={index} handleCheck={() => completeBook(book)} key={book.book.id} />
                                    )
                                })}
                            </DragDropProvider>
                        </ul>
                    )}
            </div>
        </>
    )
}
export default HomePage