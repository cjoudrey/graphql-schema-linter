module.exports = {
  rules: ['enum-values-sorted-alphabetically', 'enum-name-cannot-contain-enum'],
  rulesOptions: {
    'enum-values-sorted-alphabetically': { sortOrder: 'lexicographical' },
  },
  ignore: {
    'fields-have-descriptions': [
      'Obvious',
      'Query.obvious',
      'Query.something.obvious',
    ],
  },
  customRulePaths: [`${__dirname}/../../fixtures/custom_rules/*.js`],
};
