import { relations, sql } from "drizzle-orm";
import { boolean, check, date, index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    hardcoverId: integer("hardcover_id").notNull(),
    title: text().notNull(),
    pageCount: integer("page_count").notNull(),
    author: text().notNull(),
    coverUrl: text("cover_url").notNull(),
    progress: integer(),
    complete: boolean().default(false),
    dateStarted: date("date_started"),
    dateFinished: date("date_finished"),
    lastRead: date("last_read")
}, (table) => [
    check("progress_check1", sql`${table.progress} >= 0`),
    check("progress_check2", sql`${table.progress} <= ${table.pageCount}`),
    index("hardcover_id_idx").on(table.hardcoverId),
]);

export const lists = pgTable("lists", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp({ withTimezone: true }).default(sql`now()`)
});

export const listItems = pgTable("list_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    bookId: integer().references(() => books.id, { onDelete: "cascade" }),
    listId: integer().references(() => lists.id, { onDelete: "cascade" }),
    position: integer(),
    addedAt: timestamp({ withTimezone: true }).default(sql`now()`)
}, (table) => [
    index("list_items_book_id_idx").on(table.bookId),
    index("list_items_list_id_idx").on(table.listId),
])

