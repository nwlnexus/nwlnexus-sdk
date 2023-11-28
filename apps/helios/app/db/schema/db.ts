import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { AppConfig } from '~/config/app.config';

type UserPrefs = {
  theme?: AppConfig['appThemes'];
  loc?: string;
};

export const accounts = sqliteTable('accounts', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique()
});

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  photo: text('photo'),
  preferences: text('preferences', { mode: 'json' }).$type<UserPrefs | {}>(),
  accountId: text('accountId')
    .notNull()
    .references(() => accounts.id)
});
export const usersInsertSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const authAccounts = sqliteTable(
  'auth_accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  (authAccount) => ({
    compoundKey: primaryKey({ name: 'id', columns: [authAccount.provider, authAccount.providerAccountId] })
  })
);

export const verificationTokens = sqliteTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
  })
);
