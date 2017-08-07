// This file cannot be written with ECMAScript 2015 because it has to load
// the Babel require hook to enable ECMAScript 2015 features!
require('babel-core/register');
require('babel-core').transform('code', {
  plugins: ['transform-runtime']
});

// The tests, however, can and should be written with ECMAScript 2015.
require('./configuration')
require('./rules/fields_have_descriptions')
require('./rules/types_have_descriptions')
require('./rules/deprecations_have_a_reason')
require('./rules/enum_values_sorted_alphabetically')
require('./rules/types_are_capitalized')
