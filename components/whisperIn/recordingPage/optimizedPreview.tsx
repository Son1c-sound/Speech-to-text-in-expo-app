import { Feather } from "@expo/vector-icons"
import React, { useState } from "react"
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import Copy from "../history/copy"

interface OptimizedPreviewProps {
  setView: React.Dispatch<React.SetStateAction<"record" | "preview">>;
  originalText: string;
  optimizedText: {
    twitter?: string;
    linkedin?: string;
    reddit?: string;
  };
  setOptimizedText: React.Dispatch<React.SetStateAction<{
    twitter?: string;
    linkedin?: string;
    reddit?: string;
  }>>
  transcriptionId: string;
  activeTab: "twitter" | "linkedin" | "reddit";
  setActiveTab: React.Dispatch<React.SetStateAction<"twitter" | "linkedin" | "reddit">>;
}

export default function OptimizedPreview({
  setView,
  originalText,
  optimizedText,
  setOptimizedText,
  transcriptionId,
}: OptimizedPreviewProps) {
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'reddit'>('twitter')

  const handleTextChange = (text: string) => {
    setOptimizedText({
      ...optimizedText,
      [activeTab]: text
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.recordButton} onPress={() => setView("record")}>
          <Feather name="mic" size={24} color="#2563EB" />
          <Text style={styles.recordText}>Record Again</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="file-text" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Original Recording</Text>
            <Copy text={originalText} id={`original-${transcriptionId}`} />
          </View>
          <Text style={styles.text}>{originalText}</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'twitter' && styles.activeTab]}
            onPress={() => setActiveTab('twitter')}
          >
            <Text style={[styles.tabText, activeTab === 'twitter' && styles.activeTabText]}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'linkedin' && styles.activeTab]}
            onPress={() => setActiveTab('linkedin')}
          >
            <Text style={[styles.tabText, activeTab === 'linkedin' && styles.activeTabText]}>LinkedIn</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reddit' && styles.activeTab]}
            onPress={() => setActiveTab('reddit')}
          >
            <Text style={[styles.tabText, activeTab === 'reddit' && styles.activeTabText]}>Reddit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Optimized</Text>
            <Copy text={optimizedText[activeTab] || ''} id={transcriptionId} />
          </View>
          <View style={styles.editableHint}>
            <Feather name="edit-2" size={16} color="#6B7280" />
            <Text style={styles.editableText}>This text is editable</Text>
          </View>
          <TextInput
            style={styles.input}
            value={optimizedText[activeTab] || ''}
            onChangeText={handleTextChange}
            multiline
            placeholder="Your optimized content will appear here..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  toolbar: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
  editableHint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  editableText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    minHeight: 200,
    textAlignVertical: "top",
    padding: 0,
  },
})