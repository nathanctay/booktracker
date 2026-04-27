export type BookInfoResponse = {
    hardcover: {
        book_series: {
            position: number,
            series: {
                primary_books_count: number,
                id: number,
                name: string
            }
        }[],
        contributions: {
            author: {
                name: string
            },
            contribution?: string,
            contributable_type: "Book" | "Edition"
        }[],
        description?: string,
        headline?: string,
        image?: {
            url: string
        },
        pages?: number,
        release_year?: number,
        title: string
    }
    saved: {
        id: number | string;
        hardcoverId: number;
        title: string;
        pageCount: number;
        author: {
            name: string
        }[];
        coverUrl: string;
        progress?: number;
        complete?: boolean;
        date_started?: Date;
        date_finished?: Date;
        lastRead?: Date,
        listItems: {
            id: number,
            position?: number,
            bookId?: number,
            listId?: number,
            addedAt?: Date,
            list?:
            {
                description?: string,
                name: string,
                id: number,
                createdAt?: Date,
            }
        }[]
    }[]
}