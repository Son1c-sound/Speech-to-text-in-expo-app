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

  useEffect(() => { 
    const initializeRevenueCat = async () => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      
      if (Platform.OS === 'ios') {
        console.log('Initializing RevenueCat for iOS...');
          await Purchases.configure({ apiKey: 'your_ios_api_key' });
          console.log('RevenueCat iOS initialization successful');
      } else if (Platform.OS === 'android') {
        console.log('Initializing RevenueCat for Android...');
          await Purchases.configure({ apiKey: 'goog_VmLXrXBYXkwwEMkyMrANCtYbNNp' });
        console.log('RevenueCat Android initialization successful');
      }
    };

    initializeRevenueCat();
  }, []);

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