import React, { useCallback, useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import handleDelete from "./delete"
import { useFetchHistory } from "@/hooks/useFetchHistory"
import Copy from "./copy"
import EditModal from "./edit"
import Navbar from "../custom-components/navbar"
import { useHandleEdit } from "@/hooks/useHandleEdit"

interface HistoryItem {
  _id: string
  text: string
  status: string
  optimizations: {
    twitter?: string
    linkedin?: string
    reddit?: string
  }
}

type FilterType = "all" | "twitter" | "linkedin" | "reddit"
const FILTER_STORAGE_KEY = "@history_filter"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const HistoryComponent: React.FC = () => {
  const { history, setHistory, isLoading, fetchHistory } = useFetchHistory()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [touchedOutside, setTouchedOutside] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [selectedItem, setSelectedItem] = useState<{
    item: HistoryItem | null
    tab: "twitter" | "linkedin" | "reddit"
  }>({ item: null, tab: "twitter" })
  const [filterAnimation] = useState(new Animated.Value(1))

  const { editingItem, setEditingItem, handleEdit, setEditedOptimizations } = useHandleEdit(history, setHistory)

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  useEffect(() => {
    const loadFilter = async () => {
      try {
        const savedFilter = await AsyncStorage.getItem(FILTER_STORAGE_KEY)
        if (savedFilter) {
          setActiveFilter(savedFilter as FilterType)
        }
      } catch (error) {
        console.error("Error loading filter:", error)
      }
    }
    loadFilter()
  }, [])

  const handleFilterChange = async (filter: FilterType) => {
    setActiveFilter(filter)
    try {
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, filter)
    } catch (error) {
      console.error("Error saving filter:", error)
    }
  }

  useEffect(() => {
    setTouchedOutside(false)
  }, [activeMenu])

  const filteredHistory = history.filter((item) => {
    if (activeFilter === "all") return true
    return item.optimizations && item.optimizations[activeFilter] && item.optimizations[activeFilter].length > 0
  })

  const getFilterButtonStyles = (platform: FilterType) => {
    switch (platform) {
      case "all":
        return { backgroundColor: "#E0E0E0", borderColor: "#E0E0E0", iconColor: "#000" }
      case "twitter":
        return { backgroundColor: "#1DA1F2", borderColor: "#1DA1F2", iconColor: "#fff" }
      case "linkedin":
        return { backgroundColor: "#0077B5", borderColor: "#0077B5", iconColor: "#fff" }
      case "reddit":
        return { backgroundColor: "#FF4500", borderColor: "#FF4500", iconColor: "#fff" }
      default:
        return { backgroundColor: "#E0E0E0", borderColor: "#E0E0E0", iconColor: "#000" }
    }
  }

  const CardItem = React.memo(({ item }: { item: HistoryItem }) => {
    const handleEditPress = (platform: "twitter" | "linkedin" | "reddit") => {
      setSelectedItem({ item, tab: platform })
      setEditingItem(item)
      setEditedOptimizations(item.optimizations)
      setActiveMenu(null)
    }

    const PlatformCard = ({ platform }: { platform: "twitter" | "linkedin" | "reddit" }) => (
      <View style={styles.platformCard}>
        <View style={styles.platformHeader}>
          <View style={styles.platformIndicator}>
            <Ionicons
              name={platform === "twitter" ? "logo-twitter" : platform === "linkedin" ? "logo-linkedin" : "logo-reddit"}
              size={20}
              color={platform === "twitter" ? "#1DA1F2" : platform === "linkedin" ? "#0077B5" : "#FF4500"}
            />
            <Text style={styles.platformTitle}>
              {platform === "twitter" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setActiveMenu(activeMenu === `${item._id}-${platform}` ? null : `${item._id}-${platform}`)
              setTouchedOutside(false)
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {activeMenu === `${item._id}-${platform}` && !touchedOutside && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleEditPress(platform)}>
              <Ionicons name="create-outline" size={18} color="#333" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
            <Copy text={item.optimizations[platform] || ""} id={item._id} />
          </View>
        )}

        <Text style={styles.platformText}>{item.optimizations[platform] || "No optimization available"}</Text>
      </View>
    )

    return (
      <TouchableWithoutFeedback onPress={() => setTouchedOutside(true)}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Optimized Post</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                handleDelete({
                  id: item._id,
                  onSuccess: () => setHistory((prev) => prev.filter((hist) => hist._id !== item._id)),
                })
                setActiveMenu(null)
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <Text style={styles.originalText}>{item.text}</Text>
          <View style={styles.platformsContainer}>
            {(activeFilter === "all" || activeFilter === "twitter") && <PlatformCard platform="twitter" />}
            {(activeFilter === "all" || activeFilter === "linkedin") && <PlatformCard platform="linkedin" />}
            {(activeFilter === "all" || activeFilter === "reddit") && <PlatformCard platform="reddit" />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  })

  return (
    <View style={styles.container}>
      <Navbar />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(["all", "twitter", "linkedin", "reddit"] as FilterType[]).map((filter) => (
            <AnimatedTouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                {
                  backgroundColor: getFilterButtonStyles(filter).backgroundColor,
                  borderColor: getFilterButtonStyles(filter).borderColor,
                },
                {
                  transform: [{ scale: filterAnimation }],
                },
              ]}
              onPressIn={() => {
                Animated.spring(filterAnimation, {
                  toValue: 0.95,
                  useNativeDriver: true,
                }).start()
              }}
              onPressOut={() => {
                Animated.spring(filterAnimation, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start()
              }}
              onPress={() => handleFilterChange(filter)}
            >
              {filter === "twitter" && (
                <Ionicons name="logo-twitter" size={16} color={getFilterButtonStyles(filter).iconColor} />
              )}
              {filter === "linkedin" && (
                <Ionicons name="logo-linkedin" size={16} color={getFilterButtonStyles(filter).iconColor} />
              )}
              {filter === "reddit" && (
                <Ionicons name="logo-reddit" size={16} color={getFilterButtonStyles(filter).iconColor} />
              )}
              <Text style={[styles.filterText, { color: getFilterButtonStyles(filter).iconColor }]}>
                {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </AnimatedTouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>Your optimized posts will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <EditModal
        visible={!!editingItem}
        editingItem={editingItem}
        activeTab={selectedItem.tab}
        onChangeText={setEditedOptimizations}
        onClose={() => {
          setEditingItem(null)
          setSelectedItem({ item: null, tab: "twitter" })
        }}
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
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  platformCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  platformHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  platformIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  platformTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  platformText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  originalText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    padding: 16,
  },
  platformsContainer: {
    padding: 16,
    gap: 12,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 8,
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
    minWidth: 120,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  menuButton: {
    padding: 4,
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
  filterContainer: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontWeight: "bold",
  },
})

export default HistoryComponent

