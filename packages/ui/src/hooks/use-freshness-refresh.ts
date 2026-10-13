import { useEffect, useRef } from "react"

/** Refresh visible data from its original receipt time, coalescing focus/timer events. */
export function useFreshnessRefresh(
  loadedAt: number | undefined,
  maxAgeMs: number,
  refresh: () => Promise<unknown>
) {
  const callback = useRef(refresh)
  callback.current = refresh
  const pending = useRef(false)

  useEffect(() => {
    if (loadedAt === undefined) return
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const check = () => {
      if (disposed || document.visibilityState !== "visible") return
      if (pending.current) {
        clearTimeout(timer)
        timer = setTimeout(check, 250)
        return
      }
      const remaining = loadedAt + maxAgeMs - Date.now()
      if (remaining > 0) {
        clearTimeout(timer)
        timer = setTimeout(check, remaining + 10)
        return
      }
      pending.current = true
      void callback
        .current()
        .catch(() => undefined)
        .finally(() => {
          pending.current = false
        })
    }
    check()
    window.addEventListener("focus", check)
    document.addEventListener("visibilitychange", check)
    return () => {
      disposed = true
      clearTimeout(timer)
      window.removeEventListener("focus", check)
      document.removeEventListener("visibilitychange", check)
    }
  }, [loadedAt, maxAgeMs])
}
