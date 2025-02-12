import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { presentPaywall } from './plans';


interface PaywallButtonProps {
  onSuccess?: () => void;
  onFailure?: () => void;
  buttonText?: string;
  style?: object;
}

export const PaywallButton = ({
  onSuccess,
  onFailure,
  buttonText = "👑 Subscribe to Pro",
  style
}: PaywallButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const purchased = await presentPaywall();
      if (purchased) {
        onSuccess?.();
      } else {
        onFailure?.();
      }
    } catch (error) {
      console.error('Error in PaywallButton:', error);
      onFailure?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0A66C2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});