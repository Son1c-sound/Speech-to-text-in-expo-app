import React, { useEffect } from "react";
import MainTabLayout from "@/components/whisperIn/custom-components/tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import Purchases from 'react-native-purchases';

const initializeRevenueCat = async (userId: string) => {
  try {
    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY,
      android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY,
    });

    if (!apiKey) {
      console.error('RevenueCat API key not found for platform:', Platform.OS);
      return;
    }

    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG)
    await Purchases.configure({ 
      apiKey,
      appUserID: userId
    });

    const customerInfo = await Purchases.getCustomerInfo();
    console.log('RevenueCat Customer Info:', customerInfo);

  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
  }
};

export default function TabLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();

  
  useEffect(() => {
    if (isSignedIn && userId) {
      initializeRevenueCat(userId);
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