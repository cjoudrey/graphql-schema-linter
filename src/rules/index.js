import { FieldsHaveDescriptions } from './fields_have_descriptions.js';
import { DeprecationsHaveAReason } from './deprecations_have_a_reason.js';
import { TypesHaveDescriptions } from './types_have_descriptions.js';
import { TypesAreCapitalized } from './types_are_capitalized.js';
import { EnumValuesSortedAlphabetically } from './enum_values_sorted_alphabetically';

module.exports = [
  EnumValuesSortedAlphabetically,
  FieldsHaveDescriptions,
  DeprecationsHaveAReason,
  TypesHaveDescriptions,
  TypesAreCapitalized,
];
