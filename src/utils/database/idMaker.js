var md5 = require('md5');

function Fregion(lat,lng) {
  if (lat > 90 || lat < -90 || lng > 180 || lng < -180){
    return false
  }
  var s = '';
  var latdec = (90 + parseFloat(lat)) / 180.0;
  var lngdec = (180 + parseFloat(lng)) / 360.0;
  if (lngdec === 1.0) lngdec = 0.0;
  if (latdec === 1.0) latdec = 0.99999999999999;
  var as = String(latdec) + "00000000";
  var ns = String(lngdec) + "00000000";
  for (var i = 2; i<8; i++) {
    s += as[i] + ns[i];
  }
  return s;
}

function semirandom (placeString){
  if (placeString.length < 1) return false
  return md5(placeString).substring(0,5)
}

// returns false if coordinates are invalid
// returns id string if coordinates are valid
export default function idMaker (lat, lng, uniqueString){
  let fregion = Fregion(lat,lng);
  let sr = semirandom(uniqueString)
  if (fregion !== false && sr !== false){
    return fregion + ":" + sr
  }
  else {
    return false;
  }
}
