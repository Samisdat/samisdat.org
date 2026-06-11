module.exports = {
  evaluate: true,
  displayName: true,
  classNameSlug: '[title]-[hash]',
  importOverrides: {
    '@fortawesome/react-fontawesome': require.resolve(
      './packages/ui-components/src/__mocks__/@fortawesome/react-fontawesome.ts'
    ),
  },
};
