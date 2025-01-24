import * as React from 'react';
import { Text, TextInput, Button, View, StyleSheet } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
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
        emailAddress,
        password,
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
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        value={code}
        placeholder="Enter verification code"
        placeholderTextColor="#666"
        onChangeText={setCode}
        keyboardType="number-pad"
        autoComplete="off"
      />
      <Button
        title={isLoading ? "Verifying..." : "Verify Email"}
        onPress={onVerifyPress}
        disabled={isLoading || !code}
      />
    </View>
  );

  const SignUpForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Welcome to WhisperIn</Text>
      <Link href='/sign-in'>go back to sign in </Link>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button
        title={isLoading ? "Creating Account..." : "Sign Up"}
        onPress={onSignUpPress}
        disabled={isLoading || !emailAddress || !password}
      />
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
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  }
});