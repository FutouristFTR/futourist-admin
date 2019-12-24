function makeSortedArrayFromObject(object, sortBy = "created", order = "DESC") {
  let array = Object.keys(object).map(key => {
    return { id: key, ...object[key] };
  });
  return sortArray(array, sortBy, order);
}

function sortArray(array, sortBy = "created", order = "DESC") {
  array = array.sort((object1, object2) => {
    if (object1[sortBy] === object2[sortBy]) {
      return 0;
    }
    if (order === "ASC") {
      return object1[sortBy] > object2[sortBy] ? 1 : -1;
    } else {
      return object1[sortBy] < object2[sortBy] ? 1 : -1;
    }
  });
  return array;
}

export { sortArray, makeSortedArrayFromObject };
