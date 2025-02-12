import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export const presentPaywall = async (): Promise<boolean> => {
  try {
    console.log('Presenting paywall...');
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
    
    console.log('Paywall result:', paywallResult);
    
    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
        console.log('Purchase successful');
        return true;
      case PAYWALL_RESULT.RESTORED:
        console.log('Purchase restored');
        return true;
      case PAYWALL_RESULT.NOT_PRESENTED:
        console.log('Paywall not presented');
        return false;
      case PAYWALL_RESULT.ERROR:
        console.log('Paywall error occurred');
        return false;
      case PAYWALL_RESULT.CANCELLED:
        console.log('Purchase cancelled');
        return false;
      default:
        console.log('Unknown paywall result');
        return false;
    }
  } catch (e) {
    console.log('Full error details:', JSON.stringify(e));
    console.error('Error presenting paywall:', e);
    return false;
  }
};

export const presentPaywallIfNeeded = async (): Promise<boolean> => {
  try {
    console.log('Checking if paywall needs to be presented...');
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: "pro"
    });
    
    console.log('Conditional paywall result:', paywallResult);
    return paywallResult === PAYWALL_RESULT.PURCHASED || paywallResult === PAYWALL_RESULT.RESTORED;
  } catch (e) {
    console.log('Full error details:', JSON.stringify(e));
    console.error('Error in presentPaywallIfNeeded:', e);
    return false;
  }
};