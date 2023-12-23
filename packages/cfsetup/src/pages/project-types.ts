type PagesBuildConfig = {
  build_command: string | null;
  destination_dir: string | null;
  build_caching: boolean | null;
  root_dir: string | null;
  web_analytics_tag: string | null;
  web_analytics_token: string | null;
};

type PagesDeploymentConfig = {
  ai_bindings?:
    | {
        [key: string]: {
          project_id: string;
        };
      }
    | {};
  analytics_engine_datasets?: {
    [key: string]: {
      dataset: string;
    };
  };
  env_vars?: {
    [key: string]: {
      type?: 'plain_text' | 'secret_text';
      value: string;
    };
  };
  kv_namespaces?: {
    [key: string]: {
      namespace_id: string;
    };
  };
  d1_databases?: {
    [key: string]: {
      id: string;
    };
  };
  durable_object_namespaces?: {
    [key: string]: {
      namespace_id: string;
    };
  };
  queue_producers?: {
    [key: string]: {
      name: string;
    };
  };
  r2_buckets?: {
    [key: string]: {
      name: string;
    };
  };
  service_bindings?: {
    [key: string]: {
      environment: string;
      service: string;
    };
  };
  fail_open: boolean;
  always_use_latest_compatibility_date: boolean;
  compatibility_date: string;
  compatibility_flags: string[];
  build_image_major_version: number;
  usage_model: string;
  placement?: {
    mode: string;
  };
};

type PagesDeployment = {
  aliases: string[];
  build_config: PagesBuildConfig | null;
  created_on: string;
  modified_on?: string;
  env_vars?: {
    [key: string]: {
      type?: 'plain_text' | 'secret_text';
      value: string;
    };
  };
  environment: 'preview' | 'production';
  id: string;
  is_skipped: boolean;
  project_id: string;
  project_name: string;
  source: unknown | null;
  short_id: string;
  deployment_trigger: {
    type: string;
    metadata: {
      branch: string;
      commit_hash: string;
      commit_message: string;
      commit_dirty: boolean;
    };
  };
  latest_stage: {
    name: string;
    started_on: string | null;
    ended_on: string | null;
    status: string;
  } | null;
  stages: {
    name: string;
    started_on: string | null;
    ended_on: string | null;
    status: string;
  }[];
  url: string;
};

type CFPagesProject = {
  id: string;
  name: string;
  subdomain: string;
  domains: string[];
  build_config: PagesBuildConfig;
  deployment_configs: {
    preview: PagesDeploymentConfig;
    production: PagesDeploymentConfig;
  };
  latest_deployment?: PagesDeployment;
  canonical_deployment?: PagesDeployment;
  production_branch: string;
  created_on: string;
  source: unknown | null;
  production_script_name?: string;
  preview_script_name?: string;
};

type CFPagesReturn = {
  errors:
    | {
        code: number;
        message: string;
      }[]
    | [];
  messages:
    | {
        code: number;
        message: string;
      }[]
    | [];
  result: CFPagesProject[] | CFPagesProject | {} | null;
  result_info?: {
    count: number;
    page: number;
    per_page: number;
    total_count: number;
  };
  success: boolean;
};

export type { CFPagesProject, CFPagesReturn, PagesDeployment, PagesDeploymentConfig, PagesBuildConfig };
