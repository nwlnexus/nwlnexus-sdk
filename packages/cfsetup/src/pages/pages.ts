// import YAML from 'yaml';
//
// import { green, red, yellow } from '../colors';
// import { CF_URL } from '../constants';
// import { StrictYargsOptionsToInterface } from '../root-arguments';
// import { sleep } from '../utils/sleep';
// import { projectOptions } from './index';
// import { CFPagesProject, CFPagesReturn } from './project-types';
//
// export async function pagesProject(opts: StrictYargsOptionsToInterface<typeof projectOptions>) {
//   if (opts.debug) {
//     console.log(JSON.stringify(opts, null, 2));
//   }
//
//   let headers;
//   if (opts.apiToken) {
//     headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer: ${opts.apiToken}`
//     };
//   }
//   if (opts.apiEmail && opts.apiKey) {
//     headers = {
//       'Content-Type': 'application/json',
//       'X-Auth-Email': opts.apiEmail,
//       'X-Auth-Key': opts.apiKey
//     };
//   }
//
//   const body = Object.assign({
//     name: opts.name,
//     production_branch: 'main',
//     canonical_deployment: {},
//     latest_deployment: {},
//     source: {
//       type: 'adhoc'
//     },
//     build_config: {
//       build_command: null,
//       destination_dir: null,
//       build_caching: null,
//       root_dir: null,
//       web_analytics_tag: null,
//       web_analytics_token: null
//     },
//     deployment_configs: {
//       preview: {
//         ai_bindings: {},
//         build_config: {
//           build_command: null,
//           destination_dir: null,
//           build_caching: null,
//           root_dir: null,
//           web_analytics_tag: null,
//           web_analytics_token: null
//         },
//         fail_open: true,
//         always_use_latest_compatibility_date: true,
//         build_image_major_version: 2,
//         usage_model: 'standard',
//         compatibility_date: '2023-12-01',
//         compatibility_flags: [' nodejs_compat'],
//         placement: {
//           mode: 'smart'
//         }
//       },
//       production: {
//         ai_bindings: {},
//         build_config: {
//           build_command: null,
//           destination_dir: null,
//           build_caching: null,
//           root_dir: null,
//           web_analytics_tag: null,
//           web_analytics_token: null
//         },
//         fail_open: true,
//         always_use_latest_compatibility_date: true,
//         build_image_major_version: 2,
//         usage_model: 'standard',
//         compatibility_date: '2023-12-01',
//         compatibility_flags: [' nodejs_compat'],
//         placement: {
//           mode: 'smart'
//         }
//       }
//     },
//     usage_model: 'standard'
//   });
//
//   switch (opts.operation) {
//     case 'create': {
//       const url = `${CF_URL}/accounts/${opts.accountId}/pages/projects`;
//       const options = {
//         method: 'POST',
//         headers,
//         body
//       };
//       if (opts.debug) {
//         console.info('Fetch URL:', yellow(url));
//         console.info('CREATE Options:', yellow(JSON.stringify(options, null, 2)));
//       }
//
//       const res = await fetch(url, options);
//       const { success, errors, messages } = (await res.json()) as unknown as CFPagesReturn;
//
//       if (success) {
//         console.log(green(`Project created`));
//       } else {
//         if (errors.length > 0) {
//           console.log('Error occurred...\n');
//           for (const err of errors) {
//             console.error(red(`${err.code}: ${err.message}`));
//           }
//         }
//         if (messages.length > 0) console.log('Messages:\n', JSON.stringify(messages, null, 2));
//       }
//       break;
//     }
//     case 'list': {
//       const url = `${CF_URL}/accounts/${opts.accountId}/pages/projects/${
//         typeof opts.name == 'undefined' ? '' : '/' + opts.name
//       }`;
//       const options = {
//         method: 'GET',
//         headers
//       };
//       if (opts.debug) {
//         console.info('Fetch URL:', yellow(url));
//         console.info('LIST Options:', yellow(JSON.stringify(options, null, 2)));
//       }
//
//       const res = await fetch(url, options);
//       const { result, errors, messages } = (await res.json()) as unknown as CFPagesReturn;
//
//       if (result && opts.yaml) {
//         const yamlData = YAML.stringify(result);
//         console.log(yamlData);
//       } else if (result) {
//         console.log(JSON.stringify(result, null, 2));
//       } else {
//         if (errors.length > 0) {
//           console.log('Error occurred...\n');
//           for (const err of errors) {
//             console.error(red(`${err.code}: ${err.message}`));
//           }
//         }
//         if (messages.length > 0) console.log('Messages:\n', JSON.stringify(messages, null, 2));
//       }
//       break;
//     }
//     case 'delete': {
//       const url = `${CF_URL}/accounts/${opts.accountId}/pages/projects/${opts.name}`;
//       const options = {
//         method: 'GET',
//         headers
//       };
//       const deleteOptions = {
//         method: 'DELETE',
//         headers
//       };
//       if (opts.debug) {
//         console.info('Fetch URL:', yellow(url));
//         console.info('LIST Options:', yellow(JSON.stringify(options, null, 2)));
//         console.info('DELETE Options:', yellow(JSON.stringify(deleteOptions, null, 2)));
//       }
//
//       const res = await fetch(url, options);
//       const { result, errors, messages } = (await res.json()) as unknown as CFPagesReturn;
//
//       if (result) {
//         console.log('Preparing to delete project:', (result as CFPagesProject).name);
//         const project_domain = (result as CFPagesProject).subdomain;
//         console.info('Project subdomain:', project_domain);
//         const domains = (result as CFPagesProject).domains;
//         console.info('Project domains:', domains);
//         const domainsToDelete = domains.filter((el) => el !== project_domain);
//         console.info('Domains to be removed:', domainsToDelete);
//
//         for (const domain of domainsToDelete) {
//           console.info('Custom domain found:', domain);
//           fetch(`${CF_URL}/accounts/${opts.accountId}/pages/projects/${opts.name}/domains/${domain}`, deleteOptions)
//             .then((response) => response.json())
//             .catch((err) => console.error(`Error while trying to delete ${domain}\n`, err));
//         }
//
//         await sleep(5000);
//
//         fetch(`${CF_URL}/accounts/${opts.accountId}/pages/projects/${opts.name}`, deleteOptions)
//           .then((response) => response.json())
//           .then((response) => console.log(response))
//           .catch((err) => console.error(`Error while trying to pages project ${opts.name}\n`, err));
//       } else {
//         if (errors.length > 0) {
//           console.log('Error occurred...\n');
//           for (const err of errors) {
//             console.error(`${err.code}: ${err.message}`);
//           }
//         }
//         if (messages.length > 0) console.log('Messages:\n', JSON.stringify(messages, null, 2));
//       }
//
//       break;
//     }
//   }
// }
