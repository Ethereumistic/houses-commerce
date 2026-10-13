import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/.well-known/echoray-storefront")({
  server: {
    handlers: {
      GET: () => domainChallengeResponse(),
      HEAD: () => domainChallengeResponse(true),
    },
  },
})

function domainChallengeResponse(head = false) {
  const challenge = process.env.STOREFRONT_DOMAIN_CHALLENGE

  return new Response(
    head ? null : challenge || "Storefront domain verification pending.",
    {
      status: challenge ? 200 : 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  )
}
