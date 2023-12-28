import type { Config } from '../config';
import type { Database } from './types';

import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE } from './constants';

export function getDatabaseInfoFromConfig(config: Config, name: string): Database | null {
  for (const d1Database of config.d1_databases) {
    if (d1Database.database_id && (name === d1Database.database_name || name === d1Database.binding)) {
      return {
        uuid: d1Database.database_id,
        previewDatabaseUuid: d1Database.preview_database_id,
        binding: d1Database.binding,
        name: d1Database.database_name,
        migrationsTableName: d1Database.migrations_table || DEFAULT_MIGRATION_TABLE,
        migrationsFolderPath: d1Database.migrations_dir || DEFAULT_MIGRATION_PATH,
        internal_env: d1Database.database_internal_env
      };
    }
  }
  return null;
}
