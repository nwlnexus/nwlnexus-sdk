import { createId } from '@paralleldrive/cuid2';
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';

import { commonTime } from './common';

export const profiles = sqliteTable(
  'profiles',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    authId: text('auth_id').notNull(),
    authTenantId: text('auth_tenant_id').notNull(),
    authProvider: text('auth_provider').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
    photo: text('photo'),
    idpGroups: text('idp_groups', { mode: 'json' }).$type<string[]>(),
    displayName: text('display_name').notNull(),
    ...commonTime
  },
  profiles => ({
    userEmailIdx: uniqueIndex('users_email_idx').on(profiles.email),
    providerIdx: index('provider_idx').on(profiles.authProvider)
  })
);

export const tenants = sqliteTable(
  'tenants',
  {
    id: text('id').primaryKey().unique(),
    name: text('name').notNull(),
    sanitizedName: text('sanitized_name').notNull(),
    status: integer('status', { mode: 'boolean' }),
    ...commonTime
  },
  tenants => ({
    tenantNameIdx: uniqueIndex('tenant_name_idx').on(tenants.sanitizedName)
  })
);

export const profiles_tenants = sqliteTable('profiles_tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  profileId: text('profile_id').notNull(),
  tenantId: text('tenant_id').notNull()
});

export const locations = sqliteTable(
  'locations',
  {
    addressCity: text('address_city'),
    addressEmail: text('address_email'),
    addressLine1: text('address_line1'),
    addressLine2: text('address_line2'),
    addressName: text('address_name'),
    addressState: text('address_state'),
    addressTypeId: integer('address_type_id'),
    addressZipCode: text('address_zip_code'),
    cdpLocId: text('cdp_loc_id'),
    mwanSiteId: text('mwan_site_id'),
    cfGatewayId: text('cf_gateway_id'),
    cfTunnelId: text('cf_tunnel_id'),
    chain: text('chain'),
    channel: text('channel'),
    code: text('code').notNull().unique(),
    countryId: integer('country_id'),
    district: text('district'),
    id: text('id').primaryKey().unique(),
    ipPrimaryCidr: text('ip_primary_cidr'),
    ipSchema: text('ip_schema'),
    itOpsStatus: text('it_ops_status'),
    kind: text('kind'),
    latitude: real('latitude'),
    locationTypeLabel: text('location_type_label'),
    longitude: real('longitude'),
    mainFlag: text('main_flag'),
    name: text('name').notNull(),
    parentType: integer('parent_type'),
    region: text('region'),
    status: text('status'),
    tenantId: text('tenant_id').references(() => tenants.id, {
      onDelete: 'set null'
    }),
    ...commonTime
  },
  locations => ({
    locNameIdx: index('location_name_idx').on(locations.name),
    locDistrictIdx: index('location_district_idx').on(locations.district),
    locRegionIdx: index('location_region_idx').on(locations.region),
    locCodeIdx: uniqueIndex('location_code_idx').on(locations.code)
  })
);

export const selectLocationSchema = createSelectSchema(locations);

export const nodes = sqliteTable(
  'nodes',
  {
    firstSeen: integer('first_seen', { mode: 'timestamp_ms' }),
    id: text('id').notNull().primaryKey().unique(),
    kind: text('kind').notNull(),
    lastSeen: integer('last_seen', { mode: 'timestamp_ms' }),
    locationId: text('location_id').references(() => locations.id, {
      onUpdate: 'cascade',
      onDelete: 'set null'
    }),
    mac: text('mac').notNull().unique(),
    manufacturer: text('manufacturer'),
    model: text('model'),
    name: text('name').notNull(),
    serial: text('serial').notNull().unique(),
    status: integer('status', { mode: 'boolean' }),
    tenantId: text('tenant_id').references(() => tenants.id, {
      onUpdate: 'cascade',
      onDelete: 'set null'
    }),
    xiq_nodeId: text('xiq_node_id'),
    ...commonTime
  },
  nodes => ({
    nodeNameIdx: uniqueIndex('node_name_idx').on(nodes.name),
    serialIdx: uniqueIndex('serial_idx').on(nodes.serial),
    manufacturerIdx: index('manu_idx').on(nodes.manufacturer),
    modelIdx: index('model_idx').on(nodes.model)
  })
);
