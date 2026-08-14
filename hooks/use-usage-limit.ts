"use client"

import { useEffect, useState } from "react"

interface UsageData {
  usage: number
  limit: number
}

export function useUsageLimit() {
  const [data, setData] = useState<UsageData>({ usage: 0, limit: 10 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage")
      if (!response.ok) {
        setData({ usage: 0, limit: 10 })
        return
      }
      const result = await response.json()
      if (typeof result.usage === "number" && typeof result.limit === "number") {
        setData({ usage: result.usage, limit: result.limit })
      } else {
        setData({ usage: 0, limit: 10 })
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error)
      setData({ usage: 0, limit: 10 })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUsage = () => fetchUsage()

  return { usage: data.usage, limit: data.limit, isLoading, refreshUsage }
}
