import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'outline';
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default',
  color = '#2563EB' 
}) => {
  const getStyles = () => {
    if (variant === 'outline') {
      return {
        badge: {
          ...styles.badge,
          backgroundColor: '#EFF6FF',
          borderWidth: 1,
          borderColor: color,
        },
        text: {
          ...styles.text,
          color: color,
        }
      };
    }
    
    return {
      badge: {
        ...styles.badge,
        backgroundColor: color,
      },
      text: {
        ...styles.text,
        color: '#FFFFFF',
      }
    };
  };

  const computedStyles = getStyles();

  return (
    <View style={computedStyles.badge}>
      <Text style={computedStyles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});