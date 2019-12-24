export default function timestampToString(timestamp) {
  const claimTime = new Date(parseInt(timestamp, 10));
  const hours = claimTime.getHours();
  const minutes = "0" + claimTime.getMinutes();
  const seconds = "0" + claimTime.getSeconds();
  let formattedTime =
    claimTime.toLocaleDateString("sl-SI") +
    ", " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);
  if (parseInt(timestamp, 10) < 10000) {
    formattedTime = "N/A";
  }
  return formattedTime;
}
