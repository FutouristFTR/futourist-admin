import { firebaseCollections } from "./database";

const contentTypes = {
  // REVIEW: "review",
  // PROFILE_PHOTO: "profile_photo",
  // PROFILE_COVER_PHOTO: "profile_cover_photo",
  PLACE_PHOTO: "place_photo",
};

const fileTypes = {
  PHOTO: "photo",
  THUMB: "thumb",
  COVER: "cover",
  // VIDEO: "video",
};

const imageWidths = {
  [firebaseCollections.PLACES]: {
    photo: {
      1920: 1080,
      1280: 720,
      533: 300,
    },
  },
  [firebaseCollections.REVIEWS]: {
    photo: {
      1080: 1920,
      608: 1080,
      405: 720,
      310: 550,
      100: 100,
      50: 50,
    },
  },
  [firebaseCollections.OUTFITS]: {
    thumb: {
      570: 343,
    },
    cover: {
      1920: 680,
    },
  },
  [firebaseCollections.BUNDLES]: {
    thumb: {
      278: 420,
    },
    cover: {
      1920: 750,
    },
  },
};

export { contentTypes, fileTypes, imageWidths };
