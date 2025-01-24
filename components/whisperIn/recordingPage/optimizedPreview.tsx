import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import Copy from '../history/copy'

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
  transcriptionId
}: OptimizedPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => setView("record")}
        >
          <Ionicons name="mic-outline" size={20} color="#2563EB" />
          <Text style={styles.recordText}>Record Again</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#6366F1" />
            <Text style={styles.sectionTitle}>Original Recording</Text>
          </View>
          <Text style={styles.text}>{originalText}</Text>
        </View>

        <View style={[styles.section, styles.optimizedSection]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={20} color="#6366F1" />
            <Text style={styles.sectionTitle}>LinkedIn Optimized</Text>
            <Copy text={optimizedText} id={transcriptionId} />
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
    backgroundColor: '#F9FAFB',
  },
  toolbar: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  recordText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optimizedSection: {
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    padding: 12,
  },
  input: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    padding: 12,
    minHeight: 180,
    textAlignVertical: 'top',
  },
})

export default OptimizedPreview