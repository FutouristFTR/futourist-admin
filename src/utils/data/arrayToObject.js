export default function arrayToObject(array, fieldForKey){
  if (!array || array.length < 1){
    return {}
  }
  let object = {};
  array.forEach((arrayElement) => {
    if (arrayElement && arrayElement[fieldForKey] && arrayElement[fieldForKey].length)
      object[arrayElement[fieldForKey]] = arrayElement;
  })
  return object;
}
