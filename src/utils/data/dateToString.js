export default function dateToString(date) {
  if (!date) return "Not a date!";
  if (!date.toLocaleDateString) date = new Date(date);
  return `${date.toLocaleDateString("sl-SI")}, ${date.getHours()}:${
    date.getMinutes() < 10 ? "0" : ""
  }${date.getMinutes()}`;
}
