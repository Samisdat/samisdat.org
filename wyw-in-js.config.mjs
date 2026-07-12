import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default {
  evaluate: true,
  displayName: true,
  classNameSlug: '[title]-[hash]',
  importOverrides: {
    '@fortawesome/react-fontawesome': require.resolve(
      './packages/ui-components/src/__mocks__/@fortawesome/react-fontawesome.ts',
    ),
  },
};
