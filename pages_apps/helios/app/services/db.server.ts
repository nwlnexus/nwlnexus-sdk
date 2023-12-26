import { drizzle } from 'drizzle-orm/d1';
import type { Auth0Profile } from 'remix-auth-auth0';
import * as schema from '@nwlnexus/db-schema/schema';
import { profiles } from '@nwlnexus/db-schema/schema';
import { sql } from 'drizzle-orm';

type UserProfile = typeof profiles.$inferSelect;
const findOrCreateProfile = async ({
  d1DB,
  profile
}: {
  d1DB: D1Database;
  profile: Auth0Profile;
}): Promise<typeof schema.profiles.$inferInsert> => {
  const db = drizzle(d1DB, { schema });
  const dbUser = await db.query.profiles.findFirst({
    with: {
      tenants: true
    }
  });

  if (!dbUser) {
    const [new_profile] = await db
      .insert(profiles)
      .values({
        email: profile.emails![0]!.value.toLowerCase(),
        authId: profile.id,
        authTenantId: profile.organizationId,
        authProvider: profile.provider,
        displayName: profile.displayName,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .returning();

    if (!new_profile) throw new Response('Something went wrong', { status: 500 });

    return new_profile;
  } else {
    const [upd_profile] = await db.update(profiles).set({}).returning();

    if (!upd_profile) throw new Response('Something went wrong', { status: 500 });
    return upd_profile;
  }
};

//   const user: typeof profiles.$inferInsert = {
//     displayName: profile.displayName ?? '',
//     email: profile.emails![0].value,
//     emailVerified: profile._json!.email_verified ? profile._json!.email_verified : false
//   };
//
//   await DB.insert(profiles)
//     .values(user)
//     .onConflictDoUpdate({
//       target: profiles.id,
//       set: user
//     })
//     .returning();
//
//   return user;
// };

export { findOrCreateProfile, type UserProfile };
