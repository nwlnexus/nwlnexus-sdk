import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';
import { appConfig } from '@config/app.config';
import { profiles } from '@nwlnexus/db-schema/schema';

const findOrCreateAuthAccount = async ({
  userId,
  db,
  profile,
  accessToken
}: {
  userId: string;
  accessToken: string;
  db: D1Database;
  profile: Auth0Profile;
}) => {
  const DB = drizzle(db);
  let account = await DB.select().from(authAccounts).where(eq(authAccounts.userId, userId)).all();

  const acct: typeof authAccounts.$inferInsert = {
    access_token: accessToken,
    provider: profile.provider,
    providerAccountId: profile.id!.split('|')[1],
    userId: account.length <= 0 ? userId : account[0].userId
  };

  await DB.insert(authAccounts)
    .values(acct)
    .onConflictDoUpdate({
      target: authAccounts.userId,
      set: acct
    })
    .returning();
};

const findOrCreateProfile = async ({
  db,
  profile
}: {
  db: D1Database;
  profile: Auth0Profile;
}): Promise<typeof profiles.$inferInsert> => {
  const DB = drizzle(db);
  const dbUser = await DB.select().from(profiles).where(eq(profiles.email, profile.emails![0].value)).get();

  const user: typeof profiles.$inferInsert = {
    id: typeof dbUser == 'undefined' ? ulid() : dbUser.id,
    displayName: profile.displayName ?? '',
    email: profile.emails![0].value,
    emailVerified: profile._json!.email_verified ? profile._json!.email_verified : false
  };

  await DB.insert(profiles)
    .values(user)
    .onConflictDoUpdate({
      target: profiles.id,
      set: user
    })
    .returning();

  return user;
};

export {};

export { findOrCreateProfile, findOrCreateAuthAccount };
