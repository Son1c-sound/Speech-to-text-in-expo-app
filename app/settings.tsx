import React from 'react';
import { View } from 'react-native';
import Profile from './(tabs)/profile';


export default function SettingsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Profile />
    </View>
  );
}