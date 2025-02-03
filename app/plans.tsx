import { usePaywall } from '@/hooks/payments/usePayWall';
import React from 'react';
import { Button } from 'react-native';

const PaywallScreen = () => {
  const { showPaywall } = usePaywall();

  return (
    <Button 
      title="Show Paywall" 
      onPress={showPaywall} 
      disabled={false}
    />
  );
};

export default PaywallScreen;
