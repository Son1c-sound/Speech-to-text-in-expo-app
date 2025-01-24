import { useState } from 'react'
import { useAuth } from "@clerk/clerk-expo"

interface HistoryItem {
  _id: string
  text: string
  status: string
  optimizedText: string
}
export const useFetchHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://linkedin-voice-backend.vercel.app/api/history")
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        const userHistory = result.data.filter((item: any) => item.userId === userId)
        const simplifiedData = userHistory.map((item: any) => ({
          _id: item._id,
          text: item.text,
          status: item.status,
          optimizedText: item.optimizedText,
        }))
        setHistory(simplifiedData)
      } else {
        setHistory([])
      }
    } catch (err) {
      console.error("Error:", err)
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  return { history, setHistory, isLoading, fetchHistory }
}