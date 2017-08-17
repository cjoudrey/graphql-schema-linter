import { FieldsHaveDescriptions } from './fields_have_descriptions.js';
import { DeprecationsHaveAReason } from './deprecations_have_a_reason.js';
import { TypesHaveDescriptions } from './types_have_descriptions.js';
import { TypesAreCapitalized } from './types_are_capitalized.js';
import { EnumValuesSortedAlphabetically } from './enum_values_sorted_alphabetically';
import { EnumValuesAllCaps } from './enum_values_all_caps';

module.exports = [
  EnumValuesSortedAlphabetically,
  EnumValuesAllCaps,
  FieldsHaveDescriptions,
  DeprecationsHaveAReason,
  TypesHaveDescriptions,
  TypesAreCapitalized,
];
