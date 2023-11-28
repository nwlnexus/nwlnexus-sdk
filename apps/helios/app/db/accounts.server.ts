import { authAccounts } from '~/db/schema/db';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';

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

export { findOrCreateAuthAccount };
