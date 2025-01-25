import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from "react-native"

interface AppPreviewProps {
  onComplete: () => void
}

export default function AppPreview({ onComplete }: AppPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const previewPages = [
    {
      image: "https://i.ibb.co/cLMh7vm/4444444444444444444444-jpg.png",
      title: "Speak & Share",
      description: "Transform your voice into engaging LinkedIn posts",
    },
    {
      image: "https://i.ibb.co/RcWY0YK/55555555555555555555555555555.png",
      title: "AI-Powered Optimization",
      description: "Get professional, engaging posts crafted by AI",
    },
    {
      image:
        "https://media.istockphoto.com/id/1456452524/vector/data-analysis-research-statistics-concept-strategy-business-development-results-of.jpg?s=2048x2048&w=is&k=20&c=-CLVbMpBMqclN7upmp3VafLg9D642PuHZdSYq8X2yzk=",
      title: "Start Growing",
      description: "Boost your LinkedIn presence effortlessly",
    },
  ]

  const PreviewPage = ({ image, title, description }: { image: string; title: string; description: string }) => (
    <View style={styles.pageContainer}>
      <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  )

  const handleNext = () => {
    if (currentPage < previewPages.length) {
      setCurrentPage((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <PreviewPage {...previewPages[currentPage - 1]} />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {previewPages.map((_, index) => (
            <View key={index} style={[styles.dot, currentPage === index + 1 && styles.activeDot]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>{currentPage === previewPages.length ? "Get Started" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  pageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  previewImage: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#000000",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  activeDot: {
    backgroundColor: "#000000",
  },
  button: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

