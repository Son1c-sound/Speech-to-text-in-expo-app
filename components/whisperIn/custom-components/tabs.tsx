import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';

export default function MainTabLayout() {
  const activeColor = '#0A66C2';
  
  const commonTabBarStyle: ViewStyle = Platform.select({
    ios: {
      height: 88,
      backgroundColor: '#FFFFFF',
      paddingBottom: 34,
      paddingTop: 12,
      borderTopWidth: 0,
    },
    android: {
      height: 64,
      backgroundColor: '#FFFFFF',
      paddingBottom: 12,
      paddingTop: 12,
      elevation: 8,
    }
  }) ?? {};

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarButton: props => <HapticTab {...props} />,
        tabBarBackground: () => (
          <View style={commonTabBarStyle} />
        ),
        tabBarStyle: {
          ...commonTabBarStyle,
          ...(Platform.OS === 'ios' ? {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          } : {}),
        },
        tabBarLabelStyle: Platform.select({
          ios: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
            marginBottom: 2,
          },
          android: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
            marginBottom: 4,
          },
        }),
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 6 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "mic" : "mic-outline"}
              size={Platform.OS === 'ios' ? 22 : 24}
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
              size={Platform.OS === 'ios' ? 22 : 24}
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
              size={Platform.OS === 'ios' ? 22 : 24}
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: Platform.select({
    ios: {
      marginBottom: 0,
    },
    android: {
      marginBottom: -4,
    },
  }) ?? {},
});