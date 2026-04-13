import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import type { Book } from '../types/Book';
import { useEffect, useState } from 'react';
import { SortableListItem } from '../components/ListItem';

const bookList: Book[] = [
    {
        id: 1,
        title: "Cats Cradle",
        pageCount: 234,
        author: "Kurt Vonnegut",
        complete: true
    },
    {
        id: 2,
        title: "Dune",
        pageCount: 10000,
        author: "Frank Herbert",
        complete: false
    },
    {
        id: 3,
        title: "The Invention of Hugo Cabret",
        pageCount: 534,
        author: "Brian Selznick",
        complete: false
    }
]



function HomePage() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        setBooks(bookList)
    }, [])

    function completeBook(book: Book) {
        let updatedList = books!.map(b => {
            if (b.id == book.id) {
                b.complete = book.complete ? !book.complete : true
            }
            return b
        })
        setBooks(updatedList)
        console.log(books)
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
                                    console.log(source)

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
                                        <SortableListItem book={book} index={index} handleCheck={() => completeBook(book)} key={book.id} />
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