import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Loading = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Dots animation
    const animateDots = () => {
      Animated.sequence([
        // Reset all dots
        Animated.parallel([
          Animated.timing(fadeAnim1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim3, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        // Animate first dot
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Animate second dot
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Animate third dot
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Hold for a moment
        Animated.delay(300),
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Ionicons name="mic" size={40} color="#0A66C2" />
      </Animated.View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Processing your voice
          <Animated.Text style={[styles.dot, { opacity: fadeAnim1 }]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, { opacity: fadeAnim2 }]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, { opacity: fadeAnim3 }]}>.</Animated.Text>
        </Text>
        <Text style={styles.subtitle}>This may take a few moments</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  dot: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A66C2',
  },
});

export default Loading;