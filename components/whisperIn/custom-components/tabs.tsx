import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import Navbar from '@/components/whisperIn/custom-components/navbar';

export default function mainTabLayout() {
  const activeColor = '#2563EB';
  
  const commonTabBarStyle = {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
  };

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={commonTabBarStyle} />
        ),
        tabBarStyle: {
          ...commonTabBarStyle,
          ...(Platform.OS === 'ios' ? {
            position: 'absolute',
            bottom: 24,
            left: 16,
            right: 16,
            borderRadius: 24,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          } : {
            elevation: 4,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 4 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "mic" : "mic-outline"}
              size={24}
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "timer" : "timer-outline"}
              size={24}
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
    
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: Platform.OS === 'ios' ? 0 : -4,
  },
});