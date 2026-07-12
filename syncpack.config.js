/** @type {import("syncpack").SyncpackConfig} */
module.exports = {
  source: [
    'package.json',
    'packages/*/package.json',
    // Ignore sandbox/template packages - they're not part of the build
    '!packages/website/codesandboxes/**/package.json',
    '!packages/website/src/components/Sandbox/templates/**/package.json',
  ],
  
  versionGroups: [
    {
      label: 'Use workspace protocol for local packages',
      dependencies: ['@samisdat/**'],
      dependencyTypes: ['prod', 'dev'],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Ensure catalog versions are used (except peerDependencies)',
      dependencies: [
        'react',
        'react-dom',
        '@types/react',
        '@types/react-dom',
        'next',
        'eslint-config-next',
        'typescript',
        '@linaria/core',
        '@linaria/react',
        '@wyw-in-js/nextjs',
        '@wyw-in-js/vite',
        'eslint',
        'eslint-config-prettier',
        '@eslint/eslintrc',
        'prettier',
        'prettier-plugin-multiline-arrays',
        'prettier-plugin-organize-imports',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'shiki',
        'normalize.css',
        'fs-extra',
        '@types/node',
      ],
      // Only check prod and dev deps - peerDeps can have ranges
      dependencyTypes: ['prod', 'dev'],
      isIgnored: false,
    },
  ],
  
  semverGroups: [
    {
      label: 'Allow caret ranges for non-catalog dependencies',
      range: '^',
      dependencies: ['**'],
      packages: ['**'],
    },
  ],
};
