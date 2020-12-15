import arraysEqual from './arraysEqual';

/**
 * @summary Returns `true` if the list is in alphabetical order,
 *   or an alphabetized list if not
 * @param {String[]} list Array of strings
 * @return {Object} { isSorted: Bool, sortedList: String[] }
 */
export default function listIsAlphabetical(list, sortOrder = 'alphabetical') {
  let sortFn;
  if (sortOrder === 'lexicographical') {
    sortFn = (a, b) => a.localeCompare(b);
  }

  const sortedList = list.slice().sort(sortFn);
  return {
    isSorted: arraysEqual(list, sortedList),
    sortedList,
  };
}
