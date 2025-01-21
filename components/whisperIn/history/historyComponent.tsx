import type React from "react"
import { useCallback, useState } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useHandleEdit } from "@/app/actions/useHandleEdit"
import EditModal from "./edit"
import { useFocusEffect } from "expo-router"
import handleDelete from "./delete"

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
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => {
              setEditingItem(item)
              setEditedText(item.optimizedText)
            }}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={20} color="#0A66C2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handleDelete({
                id: item._id,
                onSuccess: () => setHistory((prevHistory) => prevHistory.filter((hist) => hist._id !== item._id)),
              })
            }
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={20} color="#B74134" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.historyTexts}>
        <View style={styles.historyTextSection}>
          <Text style={styles.historyLabel}>Original:</Text>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
        <View style={styles.historyTextSection}>
          <Text style={styles.historyLabel}>Optimized:</Text>
          <Text style={styles.cardText}>{item.optimizedText}</Text>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Optimization History</Text>
      </View>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#0A66C2" />
          <Text style={styles.emptyText}>No history found</Text>
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
    backgroundColor: "#F3F2EF",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusContainer: {
    backgroundColor: "#E7F3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#0A66C2",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#F3F2EF",
    borderRadius: 20,
  },
  cardText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F2EF",
  },
  loadingText: {
    marginTop: 16,
    color: "#666666",
    fontSize: 18,
  },
  historyTexts: {
    gap: 20,
  },
  historyTextSection: {
    gap: 8,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 4,
  },
})

export default HistoryComponent

