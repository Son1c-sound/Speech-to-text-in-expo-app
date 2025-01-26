import { useState } from 'react';
import { useAuth } from "@clerk/clerk-expo"

export const useHandleEdit = (history: any[], setHistory: (history: any[]) => void, activeTab: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editedOptimizations, setEditedOptimizations] = useState<any>({});
  const { userId } = useAuth();

  const handleEdit = async () => {
    if (!editingItem) return;
    setIsEditing(true);

    try {
      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/editText', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcriptionId: editingItem._id,
          updatedOptimizations: editedOptimizations,
          userId
        }),
      });

      const data = await response.json()
      if (data.success) {
        setHistory(history.map((item) => 
          item._id === editingItem._id ? { ...item, optimizations: editedOptimizations } : item
        ))
        setEditingItem(null);
      } else {
        throw new Error(data.error || "Failed to update");
      }
    } catch (err) {
      console.error('Error updating:', err);
    } finally {
      setIsEditing(false);
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