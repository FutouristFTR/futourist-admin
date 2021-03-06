export default function hasScrolledToBottom() {
  const windowHeight =
    "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
  const body = document.body;
  const html = document.documentElement;
  const docHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  const windowBottom = windowHeight + window.pageYOffset + 200;
  if (windowBottom >= docHeight) {
    return true;
  }
  return false;
}
