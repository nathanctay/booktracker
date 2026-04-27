import { useSortable } from "@dnd-kit/react/sortable"
import type { Book } from "../types/Book";
import Checkbox from "./Checkbox";
import { forwardRef } from "react";

interface ListItemProps {
    book: Book;
    handleCheck: () => void;
    handleRef?: React.Ref<HTMLDivElement>
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
    ({ book, handleCheck, handleRef }, ref) => {
        return (
            <li ref={ref}>
                <div className="flex border rounded-md pl-2 pr-4 py-2 gap-2">
                    {
                        handleRef && (
                            <div ref={handleRef} className='w-[1.5rem] flex place-items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                            </div>
                        )}
                    <div className="flex-4">
                        <a href={`/book/${book.hardcoverId}`}><span className='font-bold'>{book.title}</span></a> <span className='text-sm'>by {book.author && book.author.map((author, index) => (
                            <span>{index > 0 && '&'} {author.name}</span>
                        ))}</span>
                    </div>
                    <div className='flex-1'>{book.progress ? book.progress : 0}/{book.pageCount} <span className='small'>pages</span></div>
                    <div className="w-[1.5rem] justify-center items-center text-center"><Checkbox checked={book.complete} onChange={() => handleCheck()} /></div>
                </div>
            </li >
        )
    }
)

interface SortableListItemProps {
    book: Book;
    index: number;
    handleCheck: () => void;
}

export function SortableListItem({ book, index, handleCheck }: SortableListItemProps) {
    const { ref, handleRef } = useSortable({ id: book.id, index })
    return (
        <ListItem
            ref={ref}
            book={book}
            handleCheck={handleCheck}
            handleRef={handleRef}
        />
    )

}