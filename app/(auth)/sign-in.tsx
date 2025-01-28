import React from "react"
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Platform,
  Linking 
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import SignInWithOAuth from "./oauth"
import { StatusBar } from "expo-status-bar"
import AppPreview from "@/components/whisperIn/custom-components/appPreview"


export default function Page() {
  const insets = useSafeAreaInsets()
  const [showPreview, setShowPreview] = React.useState(true)

  const handleTermsPress = () => {
    Linking.openURL('https://your-app.com/terms')
  }

  const handlePrivacyPress = () => {
    Linking.openURL('https://your-app.com/privacy')
  }

  const handlePreviewComplete = () => {
    setShowPreview(false)
  }
  
  if (showPreview) {
    return <AppPreview onComplete={handlePreviewComplete} />
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: "https://res.cloudinary.com/dzvttwdye/image/upload/v1738020129/imresizer-1737950027407_so1oxs.png" }}
                style={styles.logo}
              />
            </View>
            <Text style={styles.title}>WhisperIn</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              Transform your voice into engaging posts
            </Text>
            <Text style={styles.description}>
              Record once, share everywhere. Optimize your content for every platform.
            </Text>
          </View>
        </View>

        <View style={styles.authSection}>
          <View style={styles.authContainer}>
            <SignInWithOAuth />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink} onPress={handleTermsPress}>
                Terms
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const LOGO_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.18, 56), 72)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    gap: 32,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 20,
  },
  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: '#F8F9FA',
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: LOGO_SIZE / 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.5,
  },
  subtitleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  authSection: {
    width: "100%",
    gap: 24,
  },
  authContainer: {
    width: "100%",
    maxWidth: 320,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: 20,
  },
  terms: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#0A66C2",
    textDecorationLine: "underline",
  },
});