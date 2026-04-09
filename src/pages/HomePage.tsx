import { useSortable } from '@dnd-kit/react/sortable';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import Checkbox from '../components/Checkbox';
import type { Book } from '../types/Book';



interface ListItemProps {
    book: Book;
    index: number;
}

function ListItem({ book, index }: ListItemProps) {
    const { ref } = useSortable({ id: book.id, index })

    function handleCheck(book: Book) {
        console.log(`${book.title} completed`)
    }

    return (
        <li ref={ref}>
            <div className="flex border rounded-md pl-2 pr-4 py-2 gap-2">
                <div className='w-[1.5rem] flex place-items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                </div>
                <div className="flex-4">
                    <span className='font-bold'>{book.title}</span> <span className='text-sm'>{book.author && `by ${book.author}`}</span>
                </div>
                <div className='flex-1'>{book.progress ? book.progress : 0}/{book.pageCount} <span className='small'>pages</span></div>
                <div className="w-[1.5rem] justify-center items-center text-center"><Checkbox onChange={() => handleCheck(book)} /></div>
            </div>
        </li >
    )
}

function HomePage() {
    const bookList: Book[] = [
        {
            id: 1,
            title: "Cats Cradle",
            pageCount: 234,
            author: "Kurt Vonnegut"
        },
        {
            id: 2,
            title: "Dune",
            pageCount: 10000,
            author: "Frank Herbert"
        },
        {
            id: 3,
            title: "The Invention of Hugo Cabret",
            pageCount: 534,
            author: "Brian Selznick"
        }
    ]
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
                </div>
                <ul className='flex flex-col gap-2'>
                    <DragDropProvider>
                        {bookList.map((book, index) => {
                            return (
                                <ListItem book={book} index={index} />
                            )
                        })}
                    </DragDropProvider>
                </ul>
            </div>
        </>
    )
}
export default HomePage