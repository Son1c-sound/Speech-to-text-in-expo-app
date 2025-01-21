import { Alert } from "react-native"

interface DeleteProps {
  id: string;
  onSuccess: () => void;
}

const handleDelete = async ({ id, onSuccess }: DeleteProps) => {
  try {
    const response = await fetch(
      'https://linkedin-voice-backend.vercel.app/api/history',
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ transcriptionId: id })
      }
    )
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      console.log("Delete successful");
      onSuccess();
    } else {
      console.log("Delete failed:", data.error);
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
}

export default handleDelete;