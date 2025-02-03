import { useUser } from "@clerk/clerk-expo";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";

export const usePaywall = () => {
  const { user } = useUser();

  const updateServerSubscriptionStatus = async (status: 'active' | 'inactive') => {
    try {
      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/verifyPayment', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Server update error:', error);
      return false;
    }
  };

  const checkTrialStatus = async () => {
    try {
      const purchaserInfo = await Purchases.getCustomerInfo()
      console.log("Purchaser Info:", purchaserInfo)
      const entitlement = purchaserInfo?.entitlements.active["entl72cd6e5769"];

      if (entitlement?.isActive) {
        const trialEndDate = entitlement?.expirationDate;
        console.log("Trial End Date:", trialEndDate); 
        if (trialEndDate && new Date() > new Date(trialEndDate)) {
          return false;
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  };

  const showPaywall = async () => {
    try {
      const isTrialActive = await checkTrialStatus();
      if (!isTrialActive) {
        console.log('Trial has ended or no active subscription');
        return false;
      }

      const offerings = await Purchases.getOfferings();
      const offering = offerings.all['ofrng44bec31eec'];

      if (!offering) {
        console.log('Offering not found');
        return false;
      }

      const paywallResult = await RevenueCatUI.presentPaywall({
        offering
      });

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          console.log('Success! Purchase or restoration completed');
          const success = await updateServerSubscriptionStatus('active');
          if (!success) {
            console.error('Failed to update server subscription status');
          }
          return true;

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
      console.error('Purchase error:', error);
      return false;
    }
  };

  return {
    showPaywall
  };
};
