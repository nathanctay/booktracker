import { relations } from 'drizzle-orm';
import { books, listItems, lists } from './schema';

export const bookRelations = relations(books, ({ many }) => ({
    listItems: many(listItems)
}))

export const listsRelations = relations(lists, ({ many }) => ({
    items: many(listItems)
}))

export const listItemRelations = relations(listItems, ({ one }) => ({
    list: one(lists, {
        fields: [listItems.listId],
        references: [lists.id]
    }),
    book: one(books, {
        fields: [listItems.bookId],
        references: [books.id]
    })
}))