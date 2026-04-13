export interface Book {
    id: number | string;
    title: string;
    pageCount: number;
    author: string;
    progress?: number;
    complete?: boolean;
    date_started?: Date;
    date_finished?: Date;
}