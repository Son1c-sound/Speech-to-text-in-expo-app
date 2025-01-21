import { useState } from 'react';

export const useHandleEdit = (history: any[], setHistory: (history: any[]) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editedText, setEditedText] = useState("");

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
          updatedText: editedText
        }),
      });

      const data = await response.json()
      if (data.success) {
        setHistory(history.map((item) =>item._id === editingItem._id ? { ...item, optimizedText: editedText } : item))
        setEditingItem(null);
      } else {
        throw new Error(data.error || "Failed to update");
      }
    } catch (err) {
      console.error('Error updating:', err);
    } finally {
      setIsEditing(false);
    }
  };

  return { isEditing, editingItem, editedText, setEditedText, setEditingItem, handleEdit }
}