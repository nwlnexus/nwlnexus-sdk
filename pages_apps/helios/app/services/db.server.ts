import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';
import * as schema from '@nwlnexus/db-schema/schema';

const findOrCreateProfile = async ({
  db,
  profile
}: {
  db: D1Database;
  profile: Auth0Profile;
}): Promise<typeof schema.profiles.$inferInsert> => {
  const DB = drizzle(db, { schema });
  const dbUser = await DB.query.profiles.findFirst({
    with: {
      tenants: true
    }
  });

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

export { findOrCreateProfile };
