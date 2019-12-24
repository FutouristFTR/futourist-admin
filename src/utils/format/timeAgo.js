export default function makeTimeAgo(timestamp) {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const diffSeconds = currentTime - timestamp.getTime() / 1000;

  if (diffSeconds < 60)
    // less than 1 min
    return "Now";
  else if (diffSeconds < 60 * 60)
    // less than 1 hour
    return Math.floor(diffSeconds / 60).toString() + "m";
  else if (diffSeconds < 60 * 60 * 24)
    // less than 1 day
    return Math.floor(diffSeconds / 60 / 60).toString() + "h";
  else if (diffSeconds < 60 * 60 * 24 * 7)
    // less than 1 week
    return Math.floor(diffSeconds / 60 / 60 / 24).toString() + "d";
  // more than 1 week
  else return Math.floor(diffSeconds / 60 / 60 / 24 / 7).toString() + "w";
}
