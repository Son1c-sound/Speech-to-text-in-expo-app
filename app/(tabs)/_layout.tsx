import React, { useEffect } from "react";
import MainTabLayout from "@/components/whisperIn/custom-components/tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import { usePostUserData } from "@/hooks/server/usePostUserData";
import { adapty } from 'react-native-adapty';


const initAdapty = async (userId:any) => {
  try {
    await adapty.activate('public_live_TsjDOhoK.kxTfJBCswaDGXMA4WeGJ');
    // Identify user in Adapty using Clerk's userId
    if (userId) {
      await adapty.identify(userId);
    }
    console.log('Adapty initialized and user identified');
  } catch (error) {
    console.error('Adapty initialization failed:', error);
  }
};

export default function TabLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { postUserData } = usePostUserData();

  useEffect(() => {
    if (isSignedIn && userId) {
      postUserData();
      initAdapty(userId); // Initialize Adapty with userId when user is signed in
    }
  }, [isSignedIn, userId]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A66C2" />
      </View>
    );
  }

  if(!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
        <MainTabLayout />
    </>
  );
}