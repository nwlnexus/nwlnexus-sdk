/** @type {import('@remix-run/dev').AppConfig} */
export default {
  browserNodeBuiltinsPolyfill: {
    modules: {
      process: true,
      fs: 'empty',
      path: true,
      url: true,
      tty: true
    }
  },
  ignoredRouteFiles: ['**/.*'],
  server: './server.ts',
  serverBuildPath: 'functions/[[path]].js',
  serverNodeBuiltinsPolyfill: {
    modules: {
      fs: 'empty',
      path: true,
      url: true,
      tty: true
    }
  },
  serverConditions: ['workerd', 'worker', 'browser'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  postcss: true,
  tailwind: true,
  dev: true
};
