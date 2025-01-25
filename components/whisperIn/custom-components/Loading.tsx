import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Loading = () => {
 const spinValue = React.useRef(new Animated.Value(0)).current;

 React.useEffect(() => {
   Animated.loop(
     Animated.sequence([
       Animated.timing(spinValue, {
         toValue: 1,
         duration: 1500,
         easing: Easing.linear,
         useNativeDriver: true
       }),
       Animated.timing(spinValue, {
         toValue: 0,
         duration: 0,
         useNativeDriver: true
       })
     ])
   ).start();
 }, []);

 const spin = spinValue.interpolate({
   inputRange: [0, 1],
   outputRange: ['0deg', '360deg']
 });

 return (
   <View style={styles.container}>
     <View style={styles.content}>
       <Animated.View style={{ transform: [{ rotate: spin }] }}>
         <Ionicons name="sync" size={32} color="#0A66C2" />
       </Animated.View>
       <Text style={styles.title}>Processing your voice</Text>
       <Text style={styles.subtitle}>Converting to optimized LinkedIn post...</Text>
       <View style={styles.progressBar}>
         <Animated.View style={[styles.progress]} />
       </View>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 24,
 },
 content: {
   alignItems: 'center',
   gap: 16,
 },
 title: {
   fontSize: 20,
   fontWeight: '600',
   color: '#0A66C2',
 },
 subtitle: {
   fontSize: 14,
   color: '#666666',
   textAlign: 'center',
 },
 progressBar: {
   width: 200,
   height: 4,
   overflow: 'hidden',
 },
 progress: {
   width: '100%',
   height: '100%',
   backgroundColor: '#0A66C2',
   opacity: 0.7,
 }
});

export default Loading;