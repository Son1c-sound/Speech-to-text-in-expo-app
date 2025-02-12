import React, { useEffect } from "react";
import MainTabLayout from "@/components/whisperIn/custom-components/tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import { usePostUserData } from "@/hooks/server/usePostUserData";
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export default function TabLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { postUserData } = usePostUserData();

  const checkOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current) {
        console.error('No current offering found in RevenueCat dashboard');
        return;
      }
      
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  };

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        
        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: 'appl_OumtDNxlBUHHDWxfQurCzuXzuQe' });
        } else if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: 'goog_VmLXrXBYXkwwEMkyMrANCtYbNNp' });
        }

        if (isSignedIn && userId) {
          try {
            await Purchases.logIn(userId);
            await checkOfferings();
          } catch (loginError) {
            console.error('Error identifying user with RevenueCat:', loginError);
          }
        }
      } catch (initError) {
        console.error('Error initializing RevenueCat:', initError);
      }
    };

    initializeRevenueCat();
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (isSignedIn && userId) {
      postUserData();
    }
  }, [isSignedIn, userId]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A66C2" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <MainTabLayout />
    </>
  );
}