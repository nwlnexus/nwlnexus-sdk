# CF Setup

[![CI](https://github.com/nwlnexus/nwlnexus-sdk/actions/workflows/prereleases.yml/badge.svg)](https://github.com/nwlnexus/cfsetup/actions/workflows/ci.yml)

## Installation

---

Install using favorite package manager

```shell
$ npm install @nwlnexus/cfsetup --save-dev
```

## Available commands

---

```shell
$ cfsetup help
cfsetup

Commands:
  cfsetup init                           ✨  Create local repository project
  cfsetup dump                           ✨  Dump current environment variables and parsed files
  cfsetup prepare <storage> [options..]  🥣  Prepare local development environment
  cfsetup reset <storage> [options..]    💥  Reset local Cloudflare Storage assets
  cfsetup pages [command..]              ⚡️  Manage CF Pages Project
  cfsetup deploy                         🚀  Deploy local project

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
      --yaml                      Output in YAML format  [boolean]
      --debug                     Debug mode  [boolean]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]

```
