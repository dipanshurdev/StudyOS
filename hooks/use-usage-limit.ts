"use client"

import { useEffect, useState } from "react"

interface UsageData {
  usage: number
  limit: number
}

export function useUsageLimit() {
  const [data, setData] = useState<UsageData>({ usage: 0, limit: 5 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch usage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUsage = () => fetchUsage()

  return { usage: data.usage, limit: data.limit, isLoading, refreshUsage }
}
