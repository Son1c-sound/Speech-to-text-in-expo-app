import React, { useState } from "react"
import { View, StyleSheet, Image, Text, Dimensions } from "react-native"
import SignInWithOAuth from "./oauth"
import AppPreview from "@/components/whisperIn/custom-components/appPreview"
import { useRouter } from "expo-router"

export default function Page() {
  const [previewCompleted, setPreviewCompleted] = useState(false)
  
  const handlePreviewComplete = () => {
    setPreviewCompleted(true)
  }
  
  if (previewCompleted) {
    return (
      <View style={styles.signInContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dzvttwdye/image/upload/v1738020129/imresizer-1737950027407_so1oxs.png" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Log into WhisperIn</Text>
        <View style={styles.authContainer}>
          <SignInWithOAuth />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.previewContainer}>
      <AppPreview onComplete={handlePreviewComplete} />
    </View>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const LOGO_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.18, 56), 72)

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginTop: 20,
  },
  authContainer: {
    width: "100%",
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 30,
  },
})