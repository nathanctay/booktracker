import { relations } from 'drizzle-orm';
import { account, books, listItems, lists, session, user } from './schema';

export const bookRelations = relations(books, ({ one, many }) => ({
    listItems: many(listItems),
    user: one(user, {
        fields: [books.userId],
        references: [user.id]
    })
}))

export const listsRelations = relations(lists, ({ one, many }) => ({
    listItems: many(listItems),
    user: one(user, {
        fields: [lists.userId],
        references: [user.id]
    })
}))

export const listItemRelations = relations(listItems, ({ one }) => ({
    list: one(lists, {
        fields: [listItems.listId],
        references: [lists.id]
    }),
    book: one(books, {
        fields: [listItems.bookId],
        references: [books.id]
    }),
}))

// AUTH

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    lists: many(lists),
    books: many(books),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));