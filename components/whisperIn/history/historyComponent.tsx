import type React from "react"
import { useCallback, useState } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useHandleEdit } from "@/app/hooks/useHandleEdit"
import EditModal from "./edit"
import { useFocusEffect } from "expo-router"
import handleDelete from "./delete"
import Copy from "./copy"

interface HistoryItem {
  _id: string
  text: string
  status: string
  optimizedText: string
}


const HistoryComponent: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { editingItem, editedText, setEditedText, setEditingItem, handleEdit } = useHandleEdit(history, setHistory)

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://linkedin-voice-backend.vercel.app/api/history")
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        const simplifiedData = result.data.map((item: any) => ({
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

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.contentSection}>
        <View style={styles.textWrapper}>
          <Text style={styles.originalText} numberOfLines={2}>{item.text}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.optimizedSection}>
          <View style={styles.optimizedHeader}>
          </View>
          <Text style={styles.optimizedText}>{item.optimizedText}</Text>
        </View>
      </View>

      <View style={styles.actionPanel}>
  <TouchableOpacity style={styles.actionItem}>
    <Copy text={item.optimizedText} id={item._id} />
  </TouchableOpacity>

  <View style={styles.actionDivider} />

  <TouchableOpacity 
    style={styles.actionItem} 
    onPress={() => {
      setEditingItem(item)
      setEditedText(item.optimizedText)
    }}
  >
    <Ionicons name="create-outline" size={20} color="#6B7280" />
    <Text style={styles.actionText}>Edit</Text>
  </TouchableOpacity>

  <View style={styles.actionDivider} />

  <TouchableOpacity 
    style={styles.actionItem}
    onPress={() => handleDelete({
      id: item._id,
      onSuccess: () => setHistory(prev => prev.filter(hist => hist._id !== item._id)),
    })}
  >
    <Ionicons name="trash-outline" size={20} color="#6B7280" />
    <Text style={styles.actionText}></Text>
  </TouchableOpacity>
</View>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A66C2" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your optimized posts will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <EditModal
        visible={!!editingItem}
        editedText={editedText}
        onChangeText={setEditedText}
        onClose={() => setEditingItem(null)}
        onSave={handleEdit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contentSection: {
    padding: 16,
  },
  textWrapper: {
    marginBottom: 12,
  },
  originalText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  optimizedSection: {
    gap: 8,
  },
  optimizedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  optimizedText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
  actionPanel: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  actionDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  actionText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
})

export default HistoryComponent