import type { Auth0Profile } from 'remix-auth-auth0';

import * as schema from '@nwlnexus/db-schema/schema';
import { profiles } from '@nwlnexus/db-schema/schema';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

type UserProfile = typeof profiles.$inferSelect;
const findOrCreateProfile = async ({
  d1DB,
  profile,
  tenantId
}: {
  d1DB: D1Database;
  profile: Auth0Profile;
  tenantId: string;
}): Promise<typeof schema.profiles.$inferInsert> => {
  const db = drizzle(d1DB, { schema });
  const dbUser = await db.query.profiles.findFirst({
    with: {
      profilesToTenants: true
    }
  });

  if (!dbUser) {
    const [new_profile] = await db
      .insert(profiles)
      .values({
        // @ts-ignore
        email: profile._json?.email?.toLowerCase(),
        emailVerified: profile._json?.email_verified,
        authId: profile.id?.split('|')[1],
        authTenantId: tenantId,
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
