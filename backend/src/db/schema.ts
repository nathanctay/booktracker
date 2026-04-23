import { relations, sql } from "drizzle-orm";
import { boolean, check, date, index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    hardcoverId: integer("hardcover_id").notNull(),
    title: text().notNull(),
    pageCount: integer("page_count").notNull(),
    author: text().notNull(),
    coverUrl: text("cover_url").notNull(),
    progress: integer().default(0),
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
    bookId: integer().references(() => books.id, { onDelete: "cascade" }).notNull(),
    listId: integer().references(() => lists.id, { onDelete: "cascade" }).notNull(),
    position: integer().notNull(),
    addedAt: timestamp({ withTimezone: true }).default(sql`now()`)
}, (table) => [
    index("list_items_book_id_idx").on(table.bookId),
    index("list_items_list_id_idx").on(table.listId),
])

// AUTH

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    username: varchar("username", { length: 255 }).unique(),
    displayUsername: text("display_username"),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
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

