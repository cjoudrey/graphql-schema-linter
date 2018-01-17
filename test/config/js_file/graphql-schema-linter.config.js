module.exports = {
  rules: ['enum-values-sorted-alphabetically', 'enum-name-cannot-contain-enum'],
  customRulePaths: [`${__dirname}/../../fixtures/custom_rules/*.js`],
};
