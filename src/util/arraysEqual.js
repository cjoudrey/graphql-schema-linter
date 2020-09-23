/**
 * @summary Returns `true` if two arrays have the same item values in the same order.
 */
export default function arraysEqual(a, b) {
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
