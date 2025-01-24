import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import AppPreview from '@/components/whisperIn/custom-components/appPreview';
import * as WebBrowser from 'expo-web-browser';
import SignInWithOAuth from './oauth';

export const useWarmUpBrowser = () => {
 React.useEffect(() => {
   void WebBrowser.warmUpAsync()
   return () => {
     void WebBrowser.coolDownAsync()
   }
 }, [])
}

WebBrowser.maybeCompleteAuthSession()

interface VerificationFormProps {
  code: string;
  setCode: (code: string) => void;
  error: string;
  isLoading: boolean;
  onVerifyPress: () => Promise<void>;
 }
 

interface SignInFormProps {
  emailAddress: string;
  setEmailAddress: (email: string) => void;
  error: string;
  isLoading: boolean;
  onSignInPress: () => Promise<void>;
 }
 

const VerificationForm: React.FC<VerificationFormProps> = ({ code, setCode, error, isLoading, onVerifyPress }) => (
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

const SignInForm: React.FC<SignInFormProps> = ({ emailAddress, setEmailAddress, error, isLoading, onSignInPress }) => (
 <View style={styles.formContainer}>
   <Text style={styles.title}>Welcome to WhisperIn</Text>
   <Text style={styles.subtitle}>Sign in to continue</Text>
   
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
     onChangeText={setEmailAddress}
     keyboardType="email-address"
   />

   <TouchableOpacity 
     style={[styles.button, (!emailAddress || isLoading) && styles.buttonDisabled]}
     onPress={onSignInPress}
     disabled={isLoading || !emailAddress}
   >
     <Text style={styles.buttonText}>
       {isLoading ? "Sending link..." : "Continue with Email"}
     </Text>
   </TouchableOpacity>

   <View style={styles.divider}>
     <View style={styles.line} />
     <Text style={styles.dividerText}>or continue with</Text>
     <View style={styles.line} />
   </View>

   <SignInWithOAuth />

   <View style={styles.signupContainer}>
     <Text style={styles.signupText}>Don't have an account?</Text>
     <Link href="/sign-up">
       <Text style={styles.signupLink}>Sign up</Text>
     </Link>
   </View>
 </View>
);

export default function Page() {
 const { signIn, setActive, isLoaded } = useSignIn();
 const router = useRouter();
 const [emailAddress, setEmailAddress] = React.useState('');
 const [error, setError] = React.useState('');
 const [isLoading, setIsLoading] = React.useState(false);
 const [showPreview, setShowPreview] = React.useState(true);
 const [pendingVerification, setPendingVerification] = React.useState(false);
 const [code, setCode] = React.useState('');
 
 const onVerifyPress = async () => {
   if (!isLoaded) return;
   setIsLoading(true);
 
   try {
     const signInAttempt = await signIn.attemptFirstFactor({
       strategy: "email_code",
       code
     });
 
     if (signInAttempt.status === "complete") {
       await setActive({ session: signInAttempt.createdSessionId });
       router.replace("/");
     }
   } catch (err:any) {
     setError(err.message || 'Verification failed');
   } finally {
     setIsLoading(false);
   }
 };
 
 const onSignInPress = React.useCallback(async () => {
   if (!isLoaded) return;
   setIsLoading(true);
   setError('');
 
   try {
     await signIn.create({
       identifier: emailAddress,
       strategy: "email_code"
     });
 
     setPendingVerification(true);
   } catch (err:any) {
     setError(err.message || 'An error occurred');
   } finally {
     setIsLoading(false);
   }
 }, [isLoaded, emailAddress]);

 const handlePreviewComplete = () => setShowPreview(false);

 if (showPreview) return <AppPreview onComplete={handlePreviewComplete} />;

 return (
   <View style={styles.container}>
     {pendingVerification ? (
       <VerificationForm
         code={code}
         setCode={setCode}
         error={error}
         isLoading={isLoading}
         onVerifyPress={onVerifyPress}
       />
     ) : (
       <SignInForm 
         emailAddress={emailAddress}
         setEmailAddress={setEmailAddress}
         error={error}
         isLoading={isLoading}
         onSignInPress={onSignInPress}
       />
     )}
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
   color: '#2563EB',
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