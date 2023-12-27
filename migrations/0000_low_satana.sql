CREATE TABLE `locations` (
	`address_city` text,
	`address_email` text,
	`address_line1` text,
	`address_line2` text,
	`address_name` text,
	`address_state` text,
	`address_type_id` integer,
	`address_zip_code` text,
	`cdp_loc_id` text,
	`mwan_site_id` text,
	`cf_gateway_id` text,
	`cf_tunnel_id` text,
	`chain` text,
	`channel` text,
	`code` text NOT NULL,
	`country_id` integer,
	`district` text,
	`id` text PRIMARY KEY NOT NULL,
	`ip_primary_cidr` text,
	`ip_schema` text,
	`it_ops_status` text,
	`kind` text,
	`latitude` real,
	`location_type_label` text,
	`longitude` real,
	`main_flag` text,
	`name` text NOT NULL,
	`parent_type` integer,
	`region` text,
	`status` text,
	`tenant_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`first_seen` integer,
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`last_seen` integer,
	`location_id` text,
	`mac` text NOT NULL,
	`manufacturer` text,
	`model` text,
	`name` text NOT NULL,
	`serial` text NOT NULL,
	`status` integer,
	`tenant_id` text,
	`xiq_node_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_id` text NOT NULL,
	`auth_tenant_id` text NOT NULL,
	`auth_provider` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`photo` text,
	`idp_groups` text,
	`display_name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `profiles_tenants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` text NOT NULL,
	`tenant_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sanitized_name` text NOT NULL,
	`status` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_code_unique` ON `locations` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `locations_id_unique` ON `locations` (`id`);--> statement-breakpoint
CREATE INDEX `location_name_idx` ON `locations` (`name`);--> statement-breakpoint
CREATE INDEX `location_district_idx` ON `locations` (`district`);--> statement-breakpoint
CREATE INDEX `location_region_idx` ON `locations` (`region`);--> statement-breakpoint
CREATE UNIQUE INDEX `location_code_idx` ON `locations` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `nodes_id_unique` ON `nodes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `nodes_mac_unique` ON `nodes` (`mac`);--> statement-breakpoint
CREATE UNIQUE INDEX `nodes_serial_unique` ON `nodes` (`serial`);--> statement-breakpoint
CREATE UNIQUE INDEX `node_name_idx` ON `nodes` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `serial_idx` ON `nodes` (`serial`);--> statement-breakpoint
CREATE INDEX `manu_idx` ON `nodes` (`manufacturer`);--> statement-breakpoint
CREATE INDEX `model_idx` ON `nodes` (`model`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_email_unique` ON `profiles` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `profiles` (`email`);--> statement-breakpoint
CREATE INDEX `provider_idx` ON `profiles` (`auth_provider`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_id_unique` ON `tenants` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenant_name_idx` ON `tenants` (`sanitized_name`);