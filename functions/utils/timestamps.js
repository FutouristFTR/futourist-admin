function timestampsToDates(object) {
  if (!object) return object;
  let objectKeys = Object.keys(object);
  if (objectKeys.length) {
    objectKeys.forEach(key => {
      if (
        object[key] &&
        object[key].constructor &&
        object[key].constructor.name === "Timestamp" &&
        object[key].toDate
      )
        object[key] = object[key].toDate();
    });
  }
  return object;
}

module.exports = timestampsToDates;
