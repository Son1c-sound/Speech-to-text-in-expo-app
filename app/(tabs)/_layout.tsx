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
      console.log('Fetching RevenueCat offerings...');
      const offerings = await Purchases.getOfferings();
      console.log('Available offerings:', JSON.stringify(offerings, null, 2));
      
      if (!offerings.current) {
        console.error('No current offering found in RevenueCat dashboard');
        return;
      }
      
      // Log the available packages
      offerings.current.availablePackages.forEach(pkg => {
        console.log('Package:', pkg.identifier, 'Product:', pkg.product);
      });
      
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  };

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        
        if (Platform.OS === 'ios') {
          console.log('Initializing RevenueCat for iOS...');
          await Purchases.configure({ apiKey: 'appl_OumtDNxlBUHHDWxfQurCzuXzuQe' });
          console.log('RevenueCat iOS initialization success ful')
        } else if (Platform.OS === 'android') {
          console.log('Initializing RevenueCat for Android...');
          await Purchases.configure({ apiKey: 'goog_VmLXrXBYXkwwEMkyMrANCtYbNNp' });
          console.log('RevenueCat Android initialization successful');
        }

        // Set up error handling for user identification
        if (isSignedIn && userId) {
          try {
            console.log('Attempting to identify user with RevenueCat. User ID:', userId);
            await Purchases.logIn(userId);
            console.log('RevenueCat user identification successful for user:', userId);
            
            // Check offerings after successful login
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