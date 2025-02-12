import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { presentPaywall } from './plans';


interface PaywallButtonProps {
  onSuccess?: () => void;
  onFailure?: () => void;
  buttonText?: string;
  style?: object;
  children: React.ReactNode;

}

export const PaywallButton = ({
  onSuccess,
  onFailure,
  style,
  children,
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
    onPress={handlePress}
    disabled={loading}
    style={style}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      children
    )}
  </TouchableOpacity>
  );
};
