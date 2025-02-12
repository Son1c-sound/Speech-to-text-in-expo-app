import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export const presentPaywall = async (): Promise<boolean> => {
  try {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
    
    
    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
        return true;
      case PAYWALL_RESULT.RESTORED:
        return true;
      case PAYWALL_RESULT.NOT_PRESENTED:
        return false;
      case PAYWALL_RESULT.ERROR:
        return false;
      case PAYWALL_RESULT.CANCELLED:
        return false;
      default:
        return false;
    }
  } catch (e) {
    console.error('Error presenting paywall:', e);
    return false;
  }
};

export const presentPaywallIfNeeded = async (): Promise<boolean> => {
  try {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: "pro"
    });
    
    return paywallResult === PAYWALL_RESULT.PURCHASED || paywallResult === PAYWALL_RESULT.RESTORED;
  } catch (e) {
    console.error('Error in presentPaywallIfNeeded:', e);
    return false;
  }
};