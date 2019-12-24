function prepareForUpload(object) {
  // recursive function that goes through an object, prepares any null values to be deleted on Firebase
  Object.keys(object).forEach(key => {
    if (object[key] === null) {
      // null field values should be deleted from database (we delete data in this way)
      object[key] = admin.firestore.FieldValue.delete();
    } else if (key.includes("Timestamp")) {
      // Timestamps must be converted to Date objects before saving to Firebase
      object[key] = new Date(object[key]);
    }
  });
  return object;
}
module.exports = prepareForUpload;
