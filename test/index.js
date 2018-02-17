// This file cannot be written with ECMAScript 2015 because it has to load
// the Babel require hook to enable ECMAScript 2015 features!
require('babel-core/register');
require('babel-core').transform('code', {
  plugins: ['transform-runtime'],
});

// The tests, however, can and should be written with ECMAScript 2015.
require('./configuration');
require('./runner');
require('./source_map');
require('./validator');
require('./rules/fields_have_descriptions');
require('./rules/fields_are_camel_cased.js');
require('./rules/types_have_descriptions');
require('./rules/deprecations_have_a_reason');
require('./rules/enum_values_sorted_alphabetically');
require('./rules/enum_values_all_caps');
require('./rules/types_are_capitalized');
require('./rules/defined_types_are_used');
require('./rules/input_object_values_have_descriptions');
require('./rules/input_object_values_are_camel_cased');
require('./rules/enum_values_have_descriptions');
require('./rules/relay_connection_types_spec');
require('./formatters/json_formatter');
require('./formatters/text_formatter');
require('./config/rc_file/test');
require('./config/package_json/test');
require('./config/js_file/test');
