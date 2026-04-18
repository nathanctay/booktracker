import { sql } from "drizzle-orm";
import { boolean, date, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    hardcoverId: integer("hardcover_id").notNull(),
    title: text().notNull(),
    pageCount: integer("page_count").notNull(),
    author: text().notNull(),
    coverUrl: text("cover_url").notNull(),
    progress: integer(),
    complete: boolean(),
    dataStarted: date("date_started"),
    dateFinished: date("date_finished"),
    lastRead: date("last_read")
});

/*
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
    lastRead?: Date;
}
*/

export const lists = pgTable("lists", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp({ withTimezone: true }).default(sql`now()`)
});

export const listItems = pgTable("list_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    book: integer().references(() => books.id, { onDelete: "cascade" }),
    list: integer().references(() => lists.id, { onDelete: "cascade" }),
    position: integer(),
    addedAt: timestamp({ withTimezone: true }).default(sql`now()`)
})

