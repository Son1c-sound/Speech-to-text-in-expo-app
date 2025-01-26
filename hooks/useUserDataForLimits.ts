import { useState } from 'react'

interface UserData {
  userId: string
  tokens: number
  isPremium: boolean
  createdAt: string
}

export const useFetchUserData = (authUserId: any) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://linkedin-voice-backend-production.up.railway.app/api/getUserData`)
      const result = await response.json()

      if (result.success && result.data) {
        const user = result.data.find((user: any) => user.userId === authUserId)
        
        if (user) {
          setUserData({
            userId: user.userId,
            tokens: user.tokens,
            isPremium: user.isPremium,
            createdAt: user.createdAt,
          })
        } else {
          setUserData(null) 
        }
      } else {
        setUserData(null)
      }
    } catch (err) {
      console.error("Error:", err)
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return { userData, isLoading, fetchUserData }
}
