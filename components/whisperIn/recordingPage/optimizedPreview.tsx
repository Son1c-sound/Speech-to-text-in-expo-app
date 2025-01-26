import { Feather, Ionicons } from "@expo/vector-icons"
import type React from "react"
import { useState } from "react"
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
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
}

export default function OptimizedPreview({
  setView,
  originalText,
  optimizedText,
  setOptimizedText,
  transcriptionId,
  activeTab,
  setActiveTab,
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
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.recordButton} onPress={() => setView("record")}>
          <Feather name="mic" size={24} color="#2563EB" />
          <Text style={styles.recordText}>Record Again</Text>
        </TouchableOpacity>
      </View>

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
          <TextInput
            style={styles.input}
            value={optimizedText[activeTab] || ""}
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
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
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

