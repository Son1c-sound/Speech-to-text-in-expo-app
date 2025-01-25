import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, StatusBar, TouchableWithoutFeedback } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useHandleEdit } from "@/hooks/useHandleEdit"
import { useFocusEffect } from "expo-router"
import handleDelete from "./delete"
import { useFetchHistory } from "@/hooks/useFetchHistory"
import Copy from "./copy"
import EditModal from "./edit"
import Navbar from "../custom-components/navbar"

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
  const [touchedOutside, setTouchedOutside] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  useEffect(() => {
    setTouchedOutside(false);
  }, [activeMenu]);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableWithoutFeedback onPress={() => setTouchedOutside(true)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="document-text-outline" size={20} color="#333" />
            <Text style={styles.headerText}>Post</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setActiveMenu(activeMenu === item._id ? null : item._id);
              setTouchedOutside(false);
            }}
          >
            <Ionicons name="menu" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {activeMenu === item._id && !touchedOutside && (
          <View style={styles.dropdown}>
            <Copy text={item.optimizedText} id={item._id} />
            <TouchableOpacity style={styles.dropdownItem} onPress={() => {
              setEditingItem(item);
              setEditedText(item.optimizedText);
              setActiveMenu(null);
            }}>
              <Ionicons name="create-outline" size={18} color="#333" />
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => {
              handleDelete({
                id: item._id,
                onSuccess: () => setHistory((prev) => prev.filter((hist) => hist._id !== item._id)),
              });
              setActiveMenu(null);
            }}>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              <Text style={[styles.dropdownText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.divider} />
        <View style={styles.cardContent}>
          <View style={styles.textSection}>
            <Text style={styles.sectionLabel}>Original</Text>
            <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.sectionLabel}>Optimized</Text>
            <Text style={styles.text}>{item.optimizedText}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
       <Navbar />
      <StatusBar barStyle="dark-content" />
      {history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={64} color="#333" />
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
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  menuButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  cardContent: {
    padding: 16,
    gap: 16,
  },
  textSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  deleteText: {
    color: "#FF3B30",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
})

export default HistoryComponent
