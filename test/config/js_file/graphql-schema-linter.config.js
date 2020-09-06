module.exports = {
  rules: ['enum-values-sorted-alphabetically', 'enum-name-cannot-contain-enum'],
  ignore: {
    'fields-have-descriptions': [
      'Obvious',
      'Query.obvious',
      'Query.something.obvious',
    ],
  },
  customRulePaths: [`${__dirname}/../../fixtures/custom_rules/*.js`],
};
