import { accounts } from '~/db/schema/db';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';

const findOrCreateAccount = async ({
  userId,
  db,
  profile,
  accessToken
}: {
  userId: string;
  accessToken: string;
  db: D1Database;
  profile: Auth0Profile;
}): Promise<typeof accounts.$inferInsert> => {
  const DB = drizzle(db);
  const account = await DB.select().from(accounts).where(eq(accounts.userId, userId)).get();

  const acct: typeof accounts.$inferInsert = {
    access_token: accessToken,
    provider: profile.provider,
    providerAccountId: profile.id!.split('|')[1],
    userId: typeof account == 'undefined' ? userId : account.userId
  };

  await DB.insert(accounts)
    .values(acct)
    .onConflictDoUpdate({
      target: accounts.userId,
      set: acct
    })
    .returning();

  return acct;
};

export { findOrCreateAccount };
