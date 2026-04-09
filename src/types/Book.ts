export interface Book {
    id: number;
    title: string;
    pageCount: number;
    author: string;
    progress?: number;
}