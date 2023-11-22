import { users } from '~/db/schema/db';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';

const findOrCreateUser = async ({ db, profile }: { db: D1Database; profile: Auth0Profile }) => {
  const DB = drizzle(db);
  const user = await DB.insert(users)
    .values({
      name: profile.displayName ?? null,
      email: profile.emails![0],
      emailVerified: profile._json!.email_verified,
      photo: profile.photos![0],
      preferences: {}
    })
    .returning();
};

export { findOrCreateUser };
