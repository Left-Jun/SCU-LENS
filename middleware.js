export function middleware(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "sculens.cn" || url.hostname === "www.sculens.cn") {
    url.protocol = "https:";
    url.hostname = "sculens.com";
    url.port = "";
    return context.redirect(url.toString(), 301);
  }

  return context.next();
}
