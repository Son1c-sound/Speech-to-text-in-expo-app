import * as React from "react"
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native"
import { useSignUp } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import SignInWithOAuth from "./oauth"

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [showPreview, setShowPreview] = React.useState(true)
  const [emailAddress, setEmailAddress] = React.useState("")
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) return
    setIsLoading(true)
    setError("")

    try {
      await signUp.create({
        emailAddress,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true)
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    setIsLoading(true)
    setError("")

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace("/")
      } else {
        setError("Verification failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const VerificationForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>Enter the code sent to your email</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={code}
        placeholder="Verification code"
        placeholderTextColor="#64748B"
        onChangeText={setCode}
        keyboardType="number-pad"
        autoComplete="off"
      />

      <TouchableOpacity
        style={[styles.button, (!code || isLoading) && styles.buttonDisabled]}
        onPress={onVerifyPress}
        disabled={isLoading || !code}
      >
        <Text style={styles.buttonText}>{isLoading ? "Verifying..." : "Verify Email"}</Text>
      </TouchableOpacity>
    </View>
  )

  const SignUpForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join WhisperIn to get started</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email address"
        placeholderTextColor="#64748B"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.button, (!emailAddress || isLoading) && styles.buttonDisabled]}
        onPress={onSignUpPress}
        disabled={isLoading || !emailAddress}
      >
        <Text style={styles.buttonText}>{isLoading ? "Creating Account..." : "Continue with Email"}</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.line} />
      </View>
      <SignInWithOAuth />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <Link href="/sign-in">
          <Text style={styles.signupLink}>Sign in</Text>
        </Link>
      </View>
    </View>
  )

  return <View style={styles.container}>{pendingVerification ? <VerificationForm /> : <SignUpForm />}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  button: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    marginBottom: 16,
  },
  errorText: {
    color: "#B71C1C",
    fontSize: 14,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#666666",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 4,
  },
  signupText: {
    color: "#666666",
    fontSize: 14,
  },
  signupLink: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },
})

