import { Feather, Ionicons } from "@expo/vector-icons"
import type React from "react"
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import Copy from "../history/copy"

interface OptimizedPreviewProps {
  setView: React.Dispatch<React.SetStateAction<"record" | "preview">>
  originalText: string
  optimizedText: {
    twitter?: string
    linkedin?: string
    reddit?: string
  }
  setOptimizedText: React.Dispatch<
    React.SetStateAction<{
      twitter?: string
      linkedin?: string
      reddit?: string
    }>
  >
  transcriptionId: string
  activeTab: "twitter" | "linkedin" | "reddit"
  setActiveTab: React.Dispatch<React.SetStateAction<"twitter" | "linkedin" | "reddit">>
  isOptimizing: boolean
}

export default function OptimizedPreview({ 
  setView, 
  originalText, 
  optimizedText, 
  setOptimizedText, 
  transcriptionId, 
  activeTab, 
  setActiveTab,
  isOptimizing
}: OptimizedPreviewProps) {
  const handleTextChange = (text: string) => {
    setOptimizedText({
      ...optimizedText,
      [activeTab]: text,
    })
  }

  const getPlatformColor = (platform: "twitter" | "linkedin" | "reddit") => {
    switch (platform) {
      case "twitter":
        return "#1DA1F2"
      case "linkedin":
        return "#0077B5"
      case "reddit":
        return "#FF4500"
      default:
        return "#000"
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text>Original Recording</Text>
            <Copy text={optimizedText[activeTab] || ""} id={transcriptionId} />
          </View>
          <Text style={styles.text}>{originalText}</Text>
        </View>

        <View style={styles.tabs}>
          {(["twitter", "linkedin", "reddit"] as const).map((platform) => (
            <TouchableOpacity
              key={platform}
              style={[
                styles.tab,
                activeTab === platform && styles.activeTab,
                { borderColor: getPlatformColor(platform) },
              ]}
              onPress={() => setActiveTab(platform)}
            >
              <Ionicons
                name={
                  platform === "twitter" ? "logo-twitter" : platform === "linkedin" ? "logo-linkedin" : "logo-reddit"
                }
                size={20}
                color={activeTab === platform ? "#fff" : getPlatformColor(platform)}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: getPlatformColor(platform) },
                  activeTab === platform && styles.activeTabText,
                ]}
              >
                {platform === "twitter" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text>Optimized</Text>
            <Copy text={optimizedText[activeTab] || ""} id={transcriptionId} />
          </View>
          {isOptimizing && !optimizedText[activeTab] ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0A66C2" />
              <Text style={styles.loadingText}>
                Optimizing for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}...
              </Text>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={optimizedText[activeTab] || ""}
              onChangeText={handleTextChange}
              multiline
              placeholder="Your optimized content will appear here..."
              placeholderTextColor="#94A3B8"
            />
          )}
        </View>
        <TouchableOpacity style={styles.recordButton} onPress={() => setView("record")}>
          <Text style={styles.buttonText}>+ Record Again</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
  
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
  container: {
    flex: 1,
    marginTop: 37,
    backgroundColor: "#F3F4F6",
  },
  toolbar: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  recordButton: {
    backgroundColor: "#0A66C2", 
    padding: 12,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    marginBottom: 130,
  },
  newRecordingButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 36,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recordText: {
    color: "#black",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",

  },
  activeTab: {
    backgroundColor: "#0A66C2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#f5f5f5",
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
    justifyContent: "space-between",
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
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  platformBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
})

