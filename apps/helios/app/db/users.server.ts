import { appConfig } from '~/config/app.config';
import { users } from '~/db/schema/db';
import { ulid } from '~/utils';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';

const findOrCreateUser = async ({
  db,
  profile
}: {
  db: D1Database;
  profile: Auth0Profile;
}): Promise<typeof users.$inferInsert> => {
  const DB = drizzle(db);
  const dbUser = await DB.select().from(users).where(eq(users.email, profile.emails![0].value)).get();

  const user: typeof users.$inferInsert = {
    id: typeof dbUser == 'undefined' ? ulid() : dbUser.id,
    name: profile.displayName ?? '',
    email: profile.emails![0].value,
    emailVerified: profile._json!.email_verified ? profile._json!.email_verified : false,
    photo: profile.photos![0].value,
    preferences: typeof dbUser == 'undefined' ? { theme: appConfig.appDefaultTheme } : dbUser.preferences
  };

  await DB.insert(users)
    .values(user)
    .onConflictDoUpdate({
      target: users.id,
      set: user
    })
    .returning();

  return user;
};

export { findOrCreateUser };
