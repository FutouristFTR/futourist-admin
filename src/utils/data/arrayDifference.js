export default function arrayDifference(array, stringValuesToRemove) {
  if (!array || !Array.isArray(stringValuesToRemove)){
    throw new Error("Cannot remove elements from a non-array construct");
  }
  if (!stringValuesToRemove || !Array.isArray(stringValuesToRemove) || stringValuesToRemove.length <= 0){
    return array;
  }
  let arrayToReturn = [];
  array.forEach(arrayElement => {
    if (stringValuesToRemove.indexOf(arrayElement) < 0){
      arrayToReturn.push(arrayElement)
    }
  })

  return arrayToReturn;
}
