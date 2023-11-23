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
}) => {
  const DB = drizzle(db);
  let account = await DB.select().from(accounts).where(eq(accounts.userId, userId)).all();

  const acct: typeof accounts.$inferInsert = {
    access_token: accessToken,
    provider: profile.provider,
    providerAccountId: profile.id!.split('|')[1],
    userId: account.length <= 0 ? userId : account[0].userId
  };

  await DB.insert(accounts)
    .values(acct)
    .onConflictDoUpdate({
      target: accounts.userId,
      set: acct
    })
    .returning();
};

export { findOrCreateAccount };
