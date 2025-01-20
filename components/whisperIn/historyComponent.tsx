import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native"

interface HistoryItem {
  id: string
  original: string
  optimized: string
  date: string
}

const HistoryComponent: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const mockHistory = [
        {
          id: "1",
          original: "Just had a great meeting with the team discussing future plans",
          optimized: "Excited to share: Just concluded a strategic planning session with my talented team. We mapped out innovative approaches to drive growth and enhance collaboration. #Leadership #Innovation #TeamSuccess",
          date: "2024-01-19"
        },
        {
          id: "2",
          original: "Working on a new project about AI",
          optimized: "Thrilled to be spearheading a groundbreaking AI initiative that's set to transform how we approach data-driven solutions. Looking forward to sharing insights from this journey. #ArtificialIntelligence #Innovation #TechLeadership",
          date: "2024-01-18"
        }
      ]
      setHistory(mockHistory)
    } catch (err) {
      console.error('Error fetching history:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <ScrollView style={styles.historyContainer}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.historyTexts}>
              <View style={styles.historyTextSection}>
                <Text style={styles.historyLabel}>Original:</Text>
                <Text style={styles.cardText}>{item.original}</Text>
              </View>
              <View style={styles.historyTextSection}>
                <Text style={styles.historyLabel}>Optimized:</Text>
                <Text style={styles.cardText}>{item.optimized}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  historyContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 16,
  },
  historyTexts: {
    gap: 16,
  },
  historyTextSection: {
    gap: 4,
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
})

export default HistoryComponent