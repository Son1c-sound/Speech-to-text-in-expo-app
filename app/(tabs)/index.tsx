import React from 'react';
import { View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter, useRootNavigationState } from 'expo-router';
import WhisperIn from '@/components/whisperIn/recordingPage/main';


export default function HomeScreen() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (isLoaded && !isSignedIn) {
      router.push('/(auth)/sign-in');
    }
  }, [isLoaded, isSignedIn, rootNavigationState?.key]);

  if (!isLoaded || !rootNavigationState?.key) {
    return 
  }

  return isSignedIn ? <WhisperIn /> : null;
}