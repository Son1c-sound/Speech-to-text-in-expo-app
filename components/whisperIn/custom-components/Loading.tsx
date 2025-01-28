import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Loading = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = [
    "Extracting your voice",
    "Optimizing for Twitter",
    "Translating for LinkedIn",
    "Processing for Reddit"
  ];

  useEffect(() => {
    // Stage transitions
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(stageTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => {
      clearInterval(stageTimer);
    };
  }, []);

  useEffect(() => {
    // Pulse animation
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
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="mic" size={40} color="#0A66C2" />
        </Animated.View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {stages[currentStage]}
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
  iconWrapper: {
    position: 'relative',
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