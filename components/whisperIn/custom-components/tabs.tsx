import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';

export default function mainTabLayout() {
  const activeColor = '#000000';
  
  const commonTabBarStyle = {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: '#666666',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => (
            <View style={commonTabBarStyle} />
          ),
          tabBarStyle: {
            ...commonTabBarStyle,
            ...(Platform.OS === 'ios' ? {
              position: 'absolute',
              bottom: 20,
              left: 12,
              right: 12,
              borderRadius: 16,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            } : {
              elevation: 2,
            }),
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          tabBarIconStyle: {
            marginTop: Platform.OS === 'ios' ? 2 : 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Record',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "mic" : "mic-outline"}
                size={22}
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
                size={22}
                color={color}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
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
    marginBottom: Platform.OS === 'ios' ? 0 : -2,
  },
});