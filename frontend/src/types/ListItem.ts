export type ListItemBook = {
    book: {
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
    }
    position: number;
}

export type ListItemList = {
    id: number;
    bookId: number;
    listId: number;
    position: number;
    addedAt: Date;
    list: {
        id: number;
        name: string;
        description?: string;
        isDefault: boolean;
        createdAt: Date;
    }
}