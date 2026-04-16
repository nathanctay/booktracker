export interface Book {
    id: number | string;
    hardcoverId: number;
    title: string;
    pageCount: number;
    author: string;
    coverUrl: string;
    progress?: number;
    complete?: boolean;
    date_started?: Date;
    date_finished?: Date;
}