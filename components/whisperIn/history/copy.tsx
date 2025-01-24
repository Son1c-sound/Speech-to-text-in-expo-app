import React, { useState } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet, View , Platform} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from "@expo/vector-icons";

interface CopyProps {
  text: string;
  id: string;
}

const Copy: React.FC<CopyProps> = ({ text, id }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleCopy = async () => {
    await Clipboard.setString(text);
    setCopySuccess(id);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => setCopySuccess(null));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={handleCopy}
      >
        <Ionicons 
          name={copySuccess === id ? "checkmark-outline" : "copy-outline"} 
          size={17} 
          color="#6B7280" 
        />
        <Text style={styles.copyText}>
          {copySuccess === id ? 'Copied' : 'Copy'}
        </Text>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.tooltip, 
          { 
            opacity: fadeAnim,
            transform: [
              { translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 0]
              })}
            ]
          }
        ]}
        pointerEvents="none"
      >
        <Text style={styles.tooltipText}>Copied to clipboard</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 3,
    marginBottom: 3,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tooltip: {
    position: 'absolute',
    top: -36,
    left: '50%',
    transform: [{ translateX: -65 }], // Half of the width
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: 130,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Copy;