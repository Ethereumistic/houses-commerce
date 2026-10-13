import handler from "@tanstack/react-start/server-entry"

// Echoray Commerce (Website and domain) can connect more domains to this Worker and
// sets the shop's address as the STOREFRONT_ORIGIN secret: other hosts redirect there.
function canonical(request: Request) {
  const origin = process.env.STOREFRONT_ORIGIN?.trim()
  if (!origin) return null
  const url = new URL(request.url)
  const target = new URL(origin)
  if (url.host === target.host || url.hostname === "localhost" || url.hostname === "127.0.0.1") return null
  return Response.redirect(`${target.origin}${url.pathname}${url.search}`, 301)
}

export default {
  async fetch(request: Request) {
    const redirect = canonical(request)
    if (redirect) return redirect
    const response = await handler.fetch(request)
    const headers = new Headers(response.headers)
    headers.set("Cache-Control", "no-store")
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}
