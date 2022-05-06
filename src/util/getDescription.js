import { getDescription as legacyGetDescription } from 'graphql/utilities/extendSchema';

export function getDescription(node, options) {
  return legacyGetDescription
    ? legacyGetDescription(node, options)
    : node.description?.value;
}
