// @ts-nocheck
import { useUser } from "@clerk/clerk-expo"
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui"
import Purchases from 'react-native-purchases'
import { useEffect, useState } from 'react'

interface UsePaywallOptions {
  offeringId?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const usePaywall = ({
  offeringId = 'free-trial-expo',
  onSuccess,
  onError
}: UsePaywallOptions = {}) => {
  const { user } = useUser()
  const [hasSubscription, setHasSubscription] = useState(false)

  const checkSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      const hasActiveSubscription = customerInfo.entitlements.active.pro !== undefined || customerInfo.entitlements.active.trial !== undefined
      setHasSubscription(hasActiveSubscription)
      return hasActiveSubscription
    } catch (error) {
      console.log('Error checking subscription:', error)
      return false
    }
  }

  useEffect(() => {
    const setupUser = async () => {
      if (user?.id) {
        try {
          await Purchases.logIn(user.id)
          await checkSubscription()
        } catch (error) {
          onError?.('Error identifying user to RevenueCat')
          console.log('Error identifying user to RevenueCat:', error)
        }
      }
    }

    setupUser()

    const purchasesUpdatedListener = Purchases.addCustomerInfoUpdateListener(async () => {
      await checkSubscription()
    })

    return () => {
      purchasesUpdatedListener?.remove()
    }
  }, [user?.id])

  const showPaywall = async () => {
    if (!user?.id) {
      onError?.('User not logged in');
      return false;
    }
  
    const isSubscribed = await checkSubscription();
    if (isSubscribed) {
      onSuccess?.();
      return true;
    }
  
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[offeringId];
  
      if (!offering) {
        onError?.('Offering not found');
        return false;
      }
  
      const paywallResult = await RevenueCatUI.presentPaywall({ offering });
  
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          await checkSubscription();
          onSuccess?.();
          return true;
        case PAYWALL_RESULT.ERROR:
          onError?.('An error occurred');
          return false;
        case PAYWALL_RESULT.CANCELLED:
          onError?.('User cancelled the purchase');
          return false;
        case PAYWALL_RESULT.NOT_PRESENTED:
          onError?.('Paywall was not presented');
          return false;
        default:
          onError?.('Unknown result');
          return false;
      }
    } catch (error) {
      onError?.('Purchase error');
      console.log('Purchase error:', error);
      return false;
    }
  };
  

  return {
    showPaywall,
    isUserLoggedIn: !!user?.id,
    hasSubscription
  }
}
