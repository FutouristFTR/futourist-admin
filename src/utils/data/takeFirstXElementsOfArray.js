export default function takeFirstXElementsOfArray(array, x) {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.slice(0, x);
}
