export default function searchInObject(searchText, object, caseSensitive=false){
  if (!object || !Object.keys(object) || Object.keys(object).length === 0){
    return {};
  }
  let searchResults = {};
  Object.keys(object).forEach((key) => {
    let objectElement = object[key];
    let searchString = "";
    Object.keys(objectElement).forEach((field)=>{
      searchString+=""+objectElement[field];
      if (!caseSensitive){
        searchString = searchString.toLowerCase();
        searchText = searchText.toLowerCase();
      }
      if (searchString.indexOf(searchText) !== -1){
        searchResults[key] = objectElement;
      }
    })
  });
  return searchResults;
}
