export type Database = {
  uuid: string;
  previewDatabaseUuid?: string;
  name: string;
  binding: string;
  internal_env?: string;
  migrationsTableName: string;
  migrationsFolderPath: string;
};

export type Migration = {
  id: string;
  name: string;
  hash: string;
  applied_at: string;
};

export type QueryResult = {
  results: Record<string, string | number | boolean>[];
  success: boolean;
  meta?: {
    duration?: number;
  };
  query?: string;
};
