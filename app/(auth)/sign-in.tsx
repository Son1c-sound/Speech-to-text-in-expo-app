import React from "react"
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Animated, 
  Dimensions, 
  Platform,
  TouchableOpacity,
  Linking 
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import SignInWithOAuth from "./oauth"
import AppPreview from "@/components/whisperIn/custom-components/appPreview"
import { StatusBar } from "expo-status-bar"

export default function Page() {
  const insets = useSafeAreaInsets()
  const [showPreview, setShowPreview] = React.useState(true)
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(20)).current

  const handlePreviewComplete = () => {
    setShowPreview(false)
    // Animate content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleTermsPress = () => {
    Linking.openURL('https://your-app.com/terms')
  }

  const handlePrivacyPress = () => {
    Linking.openURL('https://your-app.com/privacy')
  }

  if (showPreview) return <AppPreview onComplete={handlePreviewComplete} />

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: "https://res.cloudinary.com/dzvttwdye/image/upload/v1738020129/imresizer-1737950027407_so1oxs.png" }}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>WhisperIn</Text>
          <Text style={styles.subtitle}>
            Transform your voice into engaging posts
          </Text>
        </View>

        <View style={styles.authContainer}>
          <SignInWithOAuth />
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.terms}>
            By signing in, you agree to our{' '}
            <Text style={styles.termsLink} onPress={handleTermsPress}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={styles.termsLink} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const LOGO_SIZE = SCREEN_WIDTH * 0.2 // 20% of screen width
const MAX_LOGO_SIZE = 80
const MIN_LOGO_SIZE = 64

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 48,
    paddingBottom: 36,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  logoWrapper: {
    width: Math.min(Math.max(LOGO_SIZE, MIN_LOGO_SIZE), MAX_LOGO_SIZE),
    height: Math.min(Math.max(LOGO_SIZE, MIN_LOGO_SIZE), MAX_LOGO_SIZE),
    borderRadius: Math.min(Math.max(LOGO_SIZE, MIN_LOGO_SIZE), MAX_LOGO_SIZE) / 2,
    backgroundColor: '#F5F5F5',
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: Math.min(Math.max(LOGO_SIZE, MIN_LOGO_SIZE), MAX_LOGO_SIZE) / 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#666666",
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 22,
  },
  authContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "500",
  },
  demoButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  termsContainer: {
    paddingHorizontal: 24,
  },
  terms: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
})