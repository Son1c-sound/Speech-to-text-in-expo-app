import { Feather } from "@expo/vector-icons"
import React from "react"
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import Copy from "../history/copy"

interface OptimizedPreviewProps {
  setView: any
  originalText: string
  optimizedText: string
  setOptimizedText: (text: string) => void
  transcriptionId: string
}

function OptimizedPreview({
  setView,
  originalText,
  optimizedText,
  setOptimizedText,
  transcriptionId,
}: OptimizedPreviewProps) {
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

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>LinkedIn Optimized</Text>
            <Copy text={optimizedText} id={transcriptionId} />
          </View>
          <View style={styles.editableHint}>
            <Feather name="edit-2" size={16} color="#6B7280" />
            <Text style={styles.editableText}>This text is editable</Text>
          </View>
          <TextInput
            style={styles.input}
            value={optimizedText}
            onChangeText={setOptimizedText}
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

export default OptimizedPreview