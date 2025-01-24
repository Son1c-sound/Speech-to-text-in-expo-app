import type React from "react"
import { useCallback, useState } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useHandleEdit } from "@/hooks/useHandleEdit"
import EditModal from "./edit"
import { useFocusEffect } from "expo-router"
import handleDelete from "./delete"
import Copy from "./copy"
import { useFetchHistory } from "@/hooks/useFetchHistory"

interface HistoryItem {
  _id: string
  text: string
  status: string
  optimizedText: string
}

const HistoryComponent: React.FC = () => {
  const { history, setHistory, isLoading, fetchHistory } = useFetchHistory()
  const { editingItem, editedText, setEditedText, setEditingItem, handleEdit } = useHandleEdit(history, setHistory)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [])
  )

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <Ionicons name="document-text-outline" size={20} color="#6B7280" />
          <Text style={styles.headerText}>Post</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setActiveMenu(activeMenu === item._id ? null : item._id)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        {activeMenu === item._id && (
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                Copy({ text: item.optimizedText, id: item._id })
                setActiveMenu(null)
              }}
            >
              <Ionicons name="copy-outline" size={18} color="#6B7280" />
              <Text style={styles.dropdownText}>Copy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setEditingItem(item)
                setEditedText(item.optimizedText)
                setActiveMenu(null)
              }}
            >
              <Ionicons name="create-outline" size={18} color="#6B7280" />
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                handleDelete({
                  id: item._id,
                  onSuccess: () => setHistory(prev => prev.filter(hist => hist._id !== item._id)),
                })
                setActiveMenu(null)
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={[styles.dropdownText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.contentSection}>
        <View style={styles.textSection}>
          <Text style={styles.sectionLabel}>Original</Text>
          <Text style={styles.originalText} numberOfLines={2}>{item.text}</Text>
        </View>
        
        <View style={styles.textSection}>
          <Text style={styles.sectionLabel}>Optimized</Text>
          <Text style={styles.optimizedText}>{item.optimizedText}</Text>
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
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>Your optimized posts will appear here</Text>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: 'relative',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#6B7280",
  },
  menuButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  deleteText: {
    color: "#EF4444",
  },
  contentSection: {
    padding: 16,
    gap: 16,
  },
  textSection: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: "#6B7280",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  originalText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  optimizedText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
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