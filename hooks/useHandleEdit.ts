import { useState } from 'react'
import { useAuth } from "@clerk/clerk-expo"

interface Optimizations {
  twitter?: string;
  linkedin?: string;
  reddit?: string;
}

interface HistoryItem {
  _id: string;
  optimizations: Optimizations;
  originalText: string;
  userId: string;
}

interface HandleEditReturn {
  isEditing: boolean;
  editingItem: HistoryItem | null;
  editedOptimizations: Optimizations;
  setEditedOptimizations: (optimizations: Optimizations) => void;
  setEditingItem: (item: HistoryItem | null) => void;
  handleEdit: () => Promise<boolean>;
}

export const useHandleEdit = (history: any[], setHistory: (history: any[]) => void) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editedOptimizations, setEditedOptimizations] = useState<any>({})
  const { userId } = useAuth()

  const handleEdit = async () => {
    if (!editingItem || !userId) return false
    setIsEditing(true)

    try {
      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/editText', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcriptionId: editingItem._id,
          updatedOptimizations: editedOptimizations,
          userId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        //@ts-ignore
        setHistory(prev => prev.map(item => 
          item._id === editingItem._id 
            ? { ...item, optimizations: editedOptimizations }
            : item
        ))
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating:', err)
      return false
    } finally {
      setIsEditing(false)
    }
  }

  return {
    isEditing,
    editingItem,
    editedOptimizations,
    setEditedOptimizations,
    setEditingItem,
    handleEdit
  }
}