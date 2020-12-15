// This file cannot be written with ECMAScript 2015 because it has to load
// the Babel require hook to enable ECMAScript 2015 features!
require('@babel/register');

// The tests, however, can and should be written with ECMAScript 2015.
require('./configuration');
require('./runner');
require('./schema');
require('./source_map');
require('./validator');
require('./inline_configuration');
require('./find_schema_nodes');
require('./rules/arguments_have_descriptions');
require('./rules/defined_types_are_used');
require('./rules/deprecations_have_a_reason');
require('./rules/descriptions_are_capitalized');
require('./rules/enum_values_all_caps');
require('./rules/enum_values_have_descriptions');
require('./rules/enum_values_sorted_alphabetically');
require('./rules/fields_are_camel_cased.js');
require('./rules/fields_have_descriptions');
require('./rules/input_object_fields_sorted_alphabetically');
require('./rules/input_object_values_are_camel_cased');
require('./rules/input_object_values_have_descriptions');
require('./rules/interface_fields_sorted_alphabetically');
require('./rules/relay_connection_arguments_spec');
require('./rules/relay_connection_types_spec');
require('./rules/relay_page_info_spec');
require('./rules/type_fields_sorted_alphabetically');
require('./rules/types_are_capitalized');
require('./rules/types_have_descriptions');
require('./formatters/json_formatter');
require('./formatters/text_formatter');
require('./formatters/compact_formatter.js');
require('./config/rc_file/test');
require('./config/package_json/test');
require('./config/js_file/test');
