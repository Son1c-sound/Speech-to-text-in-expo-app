import { Button } from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const PaywallScreen = () => {
  const showPaywall = async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall({
        offering: 'ofrng44bec31eec' 
      });
      
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          console.log('Success! Purchase or restoration completed');
          return true;
        case PAYWALL_RESULT.NOT_PRESENTED:
          console.log('Paywall was not presented');
          return false;
        case PAYWALL_RESULT.ERROR:
          console.log('An error occurred');
          return false;
        case PAYWALL_RESULT.CANCELLED:
          console.log('User cancelled the purchase');
          return false;
        default:
          console.log('Unknown result');
          return false;
      }
    } catch (error) {
      console.log('Purchase error:', error);
      return false;
    }
  };

  return (
    <Button 
      title="Show Paywall" 
      onPress={showPaywall}
    />
  );
};

export default PaywallScreen;