import React, { useEffect } from "react";
import MainTabLayout from "@/components/whisperIn/custom-components/tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import Purchases from 'react-native-purchases';
import { usePostUserData } from "@/hooks/usePostUserData";

export default function TabLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { postUserData } = usePostUserData();

  useEffect(() => {
    const initializePurchases = async () => {
      if (isSignedIn && userId) {
        try {
         
          Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

        
          if (Platform.OS === 'ios') {
            await Purchases.configure({
              apiKey: 'appl_XKolqxLHfCPuNbyFRaBSwPTJAlT',
              appUserID: userId,
            });
          } else if (Platform.OS === 'android') {
            await Purchases.configure({
              apiKey: 'goog_VmLXrXBYXkwwEMkyMrANCtYbNNp',
              appUserID: userId,
            });
          }

          await postUserData();
          
        } catch (error) {
          console.error('RevenueCat initialization error:', error);
        }
      }
    };

    initializePurchases();
  }, [isSignedIn, userId]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A66C2" />
      </View>
    );
  }


  return (
    <>
      <MainTabLayout />
    </>
  );
}