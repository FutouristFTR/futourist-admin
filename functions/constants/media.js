const collections = require("./collections");
const PHOTO_SIZES = {
  [collections.PLACES + "-photo"]: [{ w: 1920, h: 1080 }, { w: 1280, h: 720 }, { w: 533, h: 300 }],
  [collections.OUTFITS + "-cover"]: [{ w: 1920, h: 680 }],
  [collections.OUTFITS + "-thumb"]: [{ w: 570, h: 343 }],
  [collections.BUNDLES + "-cover"]: [{ w: 1920, h: 750 }],
  [collections.BUNDLES + "-thumb"]: [{ w: 278, h: 420 }],
};

module.exports = {
  PHOTO_SIZES,
};
