import { pgTable, serial, text, uuid, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
});

export const nodes = pgTable("nodes", {
    id: serial("id").primaryKey(),
    parentId: integer("parent_id"),
    operation: text("operation"),   // '+', '-', '*', '/'
    leftValue: integer("left_value").notNull(),
    rightValue: integer("right_value"),
    result: integer("result").notNull(),
    userId: uuid("user_id").references(() => users.id),
});
