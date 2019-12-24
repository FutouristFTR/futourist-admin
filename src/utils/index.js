import makeImageUrl from "./media/makeImageUrl";

import arrayToObject from "./data/arrayToObject";
import searchInObject from "./data/searchInObject";
import arrayRemoveDuplicates from "./data/arrayRemoveDuplicates";
import arrayDifference from "./data/arrayDifference";
import { makeSortedArrayFromObject, sortArray } from "./data/arraySorting";
import takeFirstXElementsOfArray from "./data/takeFirstXElementsOfArray";
import objectDeepCompare from "./data/objectDeepCompare";
import timestampToString from "./data/timestampToString";
import dateToString from "./data/dateToString";

import idMaker from "./database/idMaker";

import hasScrolledToBottom from "./window/hasScrolledToBottom";

export {
  // media
  makeImageUrl,
  // data - arrays
  arrayToObject,
  searchInObject,
  arrayRemoveDuplicates,
  arrayDifference,
  sortArray,
  makeSortedArrayFromObject,
  takeFirstXElementsOfArray,
  // data - objects
  objectDeepCompare,
  // data - time and date
  timestampToString,
  dateToString,
  // database
  idMaker,
  // window
  hasScrolledToBottom,
};
