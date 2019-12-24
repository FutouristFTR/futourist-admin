import store from "redux/store";
import { imageWidths } from "constants/media";

export default makeImageUrl;

function makeImageUrl(mediaId, documentId, collectionName, width, type) {
  let { imgWidth, imgHeight } = getImageDimensions(collectionName, width, type);
  let projectId = store.getState().project.projectId;

  let typeId = type ? collectionName.charAt(0) + type.charAt(0) + "-" : "";
  let imagePath = `${collectionName}/${documentId}/photos/${documentId}-${typeId}${
    mediaId ? mediaId + "-" : ""
  }${imgWidth}x${imgHeight}.jpg`;
  return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
    imagePath
  )}?alt=media`;
}

function getImageDimensions(collection, width, type) {
  const possibleDimensions = imageWidths[collection][type];
  const possibleWidths = Object.keys(possibleDimensions);
  const imgWidth = closestNumber(possibleWidths, width);
  return { imgWidth, imgHeight: possibleDimensions[imgWidth] };
}

function closestNumber(array, value) {
  let selectedValue = array[0];
  array.forEach(el => {
    if (Math.abs(el - value) < Math.abs(el - selectedValue)) selectedValue = el;
  });
  return selectedValue;
}
