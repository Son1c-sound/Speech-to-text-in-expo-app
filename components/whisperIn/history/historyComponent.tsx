import React, { useCallback, useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, StatusBar, TouchableWithoutFeedback, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage'
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

type FilterType = 'all' | 'twitter' | 'linkedin' | 'reddit'
const FILTER_STORAGE_KEY = '@history_filter'

const HistoryComponent: React.FC = () => {
  const { history, setHistory, isLoading, fetchHistory } = useFetchHistory()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [touchedOutside, setTouchedOutside] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<{
    item: HistoryItem | null,
    tab: 'twitter' | 'linkedin' | 'reddit'
  }>({ item: null, tab: 'twitter' })

  const { editingItem, setEditingItem, handleEdit,  setEditedOptimizations } = useHandleEdit(
    history, 
    setHistory
  )

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [])
  )

  useEffect(() => {
    const loadFilter = async () => {
      try {
        const savedFilter = await AsyncStorage.getItem(FILTER_STORAGE_KEY)
        if (savedFilter) {
          setActiveFilter(savedFilter as FilterType)
        }
      } catch (error) {
        console.error('Error loading filter:', error)
      }
    }
    loadFilter()
  }, [])

  const handleFilterChange = async (filter: FilterType) => {
    setActiveFilter(filter)
    try {
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, filter)
    } catch (error) {
      console.error('Error saving filter:', error)
    }
  }

  useEffect(() => {
    setTouchedOutside(false)
  }, [activeMenu])

  const filteredHistory = history.filter(item => {
    if (activeFilter === 'all') return true
    return item.optimizations && 
           item.optimizations[activeFilter] && 
           item.optimizations[activeFilter].length > 0
  })

  const CardItem = React.memo(({ item }: { item: HistoryItem }) => {
    const handleEditPress = (platform: 'twitter' | 'linkedin' | 'reddit') => {
      setSelectedItem({ item, tab: platform })
      setEditingItem(item)
      setEditedOptimizations(item.optimizations)
      setActiveMenu(null)
    }

    const PlatformCard = ({ platform }: { platform: 'twitter' | 'linkedin' | 'reddit' }) => (
      <View style={styles.platformCard}>
        <View style={styles.platformHeader}>
          <View style={styles.platformLeft}>
            <Ionicons 
              name={platform === 'twitter' ? 'logo-twitter' : platform === 'linkedin' ? 'logo-linkedin' : 'logo-reddit'} 
              size={20} 
              color="#666"
            />
            <Text style={styles.platformTitle}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
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
            <Copy text={item.optimizations[platform] || ''} id={item._id} />
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleEditPress(platform)}>
              <Ionicons name="create-outline" size={18} color="#333" />
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.platformText}>{item.optimizations[platform] || 'No optimization available'}</Text>
      </View>
    )

    return (
      <TouchableWithoutFeedback onPress={() => setTouchedOutside(true)}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text-outline" size={20} color="#333" />
              <Text style={styles.headerText}>Original Post</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.originalText}>{item.text}</Text>
          <View style={styles.platformsContainer}>
            {(activeFilter === 'all' || activeFilter === 'twitter') && <PlatformCard platform="twitter" />}
            {(activeFilter === 'all' || activeFilter === 'linkedin') && <PlatformCard platform="linkedin" />}
            {(activeFilter === 'all' || activeFilter === 'reddit') && <PlatformCard platform="reddit" />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  })

  return (
    <View style={styles.container}>
      <Navbar />
      <StatusBar barStyle="dark-content" />
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Show only:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.filterActive]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterActiveText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'twitter' && styles.filterActive]}
            onPress={() => handleFilterChange('twitter')}
          >
            <Ionicons name="logo-twitter" size={16} color={activeFilter === 'twitter' ? '#fff' : '#666'} />
            <Text style={[styles.filterText, activeFilter === 'twitter' && styles.filterActiveText]}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'linkedin' && styles.filterActive]}
            onPress={() => handleFilterChange('linkedin')}
          >
            <Ionicons name="logo-linkedin" size={16} color={activeFilter === 'linkedin' ? '#fff' : '#666'} />
            <Text style={[styles.filterText, activeFilter === 'linkedin' && styles.filterActiveText]}>LinkedIn</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'reddit' && styles.filterActive]}
            onPress={() => handleFilterChange('reddit')}
          >
            <Ionicons name="logo-reddit" size={16} color={activeFilter === 'reddit' ? '#fff' : '#666'} />
            <Text style={[styles.filterText, activeFilter === 'reddit' && styles.filterActiveText]}>Reddit</Text>
          </TouchableOpacity>
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
          setSelectedItem({ item: null, tab: 'twitter' })
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
  platformCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  platformText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  originalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    padding: 16,
  },
  platformsContainer: {
    padding: 16,
    gap: 12,
  },
  dropdown: {
    position: "absolute",
    top: 32,
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
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: "500",
  },
  filterActiveText: {
    color: '#fff',
  },
})

export default HistoryComponent