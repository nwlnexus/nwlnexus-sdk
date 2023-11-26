import { Options } from 'yargs';

export const CFAssetOptions: Record<string, Options> = {
  all: {
    description: 'All CF assets',
    requiresArg: false,
    default: true,
    type: 'boolean',
    conflicts: ['d1', 'kv', 'r2']
  },
  d1: {
    description: 'D1 Databases',
    requiresArg: false,
    type: 'boolean',
    conflicts: ['all']
  },
  kv: {
    description: 'KV Namespaces',
    requiresArg: false,
    type: 'boolean',
    conflicts: ['all']
  },
  r2: {
    description: 'R2 Buckets',
    requiresArg: false,
    type: 'boolean',
    conflicts: ['all']
  }
};
