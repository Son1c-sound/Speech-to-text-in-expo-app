import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="small" color="#3b82f6" />
    <Text style={styles.text}>Processing, please wait</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  }
});

export default Loading;