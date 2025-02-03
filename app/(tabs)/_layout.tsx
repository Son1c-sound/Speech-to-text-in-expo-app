import React, { useEffect } from "react";
import MainTabLayout from "@/components/whisperIn/custom-components/tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import Purchases from 'react-native-purchases';
import { usePostUserData } from "@/hooks/usePostUserData";


export default function TabLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
    const { postUserData } = usePostUserData()
  

  useEffect(() => {
    const initializePurchases = async () => {
      if (isSignedIn && userId) {
        try {
          Purchases.configure({
            apiKey: 'goog_VmLXrXBYXkwwEMkyMrANCtYbNNp',
            appUserID: userId,
          })

          await postUserData();
          
          const purchaserInfo = await Purchases.getCustomerInfo();
          console.log('RevenueCat User ID:', purchaserInfo.originalAppUserId);
        } catch (error) {
          console.error('RevenueCat initialization error:', error);
        }
      }
    }

    initializePurchases();
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