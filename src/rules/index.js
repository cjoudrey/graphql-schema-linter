import { FieldsAreCamelCased } from './fields_are_camel_cased.js';
import { FieldsHaveDescriptions } from './fields_have_descriptions.js';
import { DeprecationsHaveAReason } from './deprecations_have_a_reason.js';
import { TypesHaveDescriptions } from './types_have_descriptions.js';
import { TypesAreCapitalized } from './types_are_capitalized.js';
import { EnumValuesSortedAlphabetically } from './enum_values_sorted_alphabetically';
import { EnumValuesAllCaps } from './enum_values_all_caps';
import { InputObjectValuesHaveDescriptions } from './input_object_values_have_descriptions';
import { InputObjectValuesAreCamelCased } from './input_object_values_are_camel_cased';
import { EnumValuesHaveDescriptions } from './enum_values_have_descriptions';
import { DefinedTypesAreUsed } from './defined_types_are_used.js';

module.exports = [
  EnumValuesSortedAlphabetically,
  EnumValuesAllCaps,
  FieldsAreCamelCased,
  FieldsHaveDescriptions,
  DeprecationsHaveAReason,
  TypesHaveDescriptions,
  TypesAreCapitalized,
  InputObjectValuesHaveDescriptions,
  InputObjectValuesAreCamelCased,
  EnumValuesHaveDescriptions,
  DefinedTypesAreUsed,
];
