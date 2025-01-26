import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Loading = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1); // Cycle dots from 1 to 3
    }, 500);

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Processing your voice{'.'.repeat(dotCount)}
      </Text>
      <Text style={styles.subtitle}>This may take a few moments...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000', // Black text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default Loading;
