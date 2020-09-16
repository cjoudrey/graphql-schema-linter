/**
 * @summary Returns `true` if two arrays have the same item values in the same order.
 */
function arraysEqual(a, b) {
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * @summary Returns `true` if the list is in alphabetical order,
 *   or an alphabetized list if not
 * @param {String[]} list Array of strings
 * @return {Object} { isSorted: Bool, sortedList: String[] }
 */
export default function listIsAlphabetical(list) {
  const sortedList = list.slice().sort((a, b) => a.localeCompare(b));
  return {
    isSorted: arraysEqual(list, sortedList),
    sortedList,
  };
}
