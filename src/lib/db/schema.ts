import { PgTable, timestamp, uuid, text, pgTable, unique } from "drizzle-orm/pg-core";
import { table } from "node:console";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name : text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id").notNull().references(() => users.id, {onDelete : 'cascade'}),
});

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export const feedFollows = pgTable("feed_follows", {
    id : uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete : 'cascade'}),
    feedId : uuid("feed_id").notNull().references(() => feeds.id, {onDelete : 'cascade'}),
},
    (table) => [
        unique('unique_user_feed_pair').on(table.userId, table.feedId),
    ]
);