import * as React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';


export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [showPreview, setShowPreview] = React.useState(true);
  const [emailAddress, setEmailAddress] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err:any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err:any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.buttonText}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Continue with Email"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <Link href="/sign-in">
          <Text style={styles.signupLink}>Sign in</Text>
        </Link>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {pendingVerification ? <VerificationForm /> : <SignUpForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  dividerText: {
    color: '#64748B',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  signupText: {
    color: '#64748B',
    fontSize: 14,
  },
  signupLink: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 14,
  },
});