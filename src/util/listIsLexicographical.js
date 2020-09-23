import arraysEqual from './arraysEqual';

/**
 * @summary Returns `true` if the list is in lexicographic order,
 *   or a lexicographic list if not
 * @param {String[]} list Array of strings
 * @return {Object} { isSorted: Bool, sortedList: String[] }
 */
export default function listIsLexicographical(list) {
  const sortedList = list.slice().sort((a, b) => a.localeCompare(b));
  return {
    isSorted: arraysEqual(list, sortedList),
    sortedList,
  };
}
