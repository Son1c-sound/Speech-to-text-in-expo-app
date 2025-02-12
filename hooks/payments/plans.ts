// @ts-nocheck
import { useAuth } from "@clerk/clerk-expo"
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui"
import Purchases from 'react-native-purchases'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

interface UsePaywallOptions {
  offeringId?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const usePaywall = ({offeringId = 'free-trial-expo', onSuccess, onError }: UsePaywallOptions = {}) => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const [hasSubscription, setHasSubscription] = useState(false)
  
    const checkSubscriptionStatus = async () => {
      try {
        console.log('Checking subscription status for userId:', userId);
        const customerInfo = await Purchases.getCustomerInfo()
        console.log('RevenueCat customer info:', customerInfo);
        const isActive = customerInfo.entitlements.active['free-trial-expo']?.isActive === true;
        console.log('Subscription status:', isActive ? 'ACTIVE' : 'INACTIVE');
        return isActive;
      } catch (error) {
        console.error('Error checking subscription:', error)
        return false
      }
    }
  
    const initializeRevenueCat = async () => {
      console.log('Initializing RevenueCat with userId:', userId);
      console.log('Auth state:', { isLoaded, isSignedIn, userId });
      
      if (!userId) {
        console.log('No userId available, skipping RevenueCat initialization');
        return false;
      }
 
      try {
        if (Platform.OS === 'ios') {
          console.log('Configuring RevenueCat for iOS');
          await Purchases.configure({
            apiKey: 'appl_OumtDNxlBUHHDWxfQurCzuXzuQe',
            appUserID: userId,
          })
        } else if (Platform.OS === 'android') {
          console.log('Configuring RevenueCat for Android');
          await Purchases.configure({
            apiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY,
            appUserID: userId,
          })
        }
        console.log('RevenueCat configured successfully');
  
        const isActive = await checkSubscriptionStatus()
        setHasSubscription(isActive)
        return true
      } catch (error) {
        console.error('RevenueCat initialization error:', error)
        return false
      }
    }
  
    useEffect(() => {
      console.log('Auth state changed:', { isSignedIn, userId });
      
      if (isSignedIn && userId) {
        console.log('User authenticated, initializing RevenueCat');
        initializeRevenueCat()
        
        console.log('Setting up RevenueCat listener');
        const purchasesUpdatedListener = Purchases.addCustomerInfoUpdateListener(async (info) => {
          console.log('RevenueCat update received:', info);
          const isActive = await checkSubscriptionStatus()
          setHasSubscription(isActive)
        })
  
        return () => {
          console.log('Cleaning up RevenueCat listener');
          purchasesUpdatedListener?.remove()
        }
      }
    }, [isSignedIn, userId])
  
    const showPaywall = async () => {
      try {
        console.log('Showing paywall, auth state:', { isSignedIn, userId });
        
        if (!isSignedIn || !userId) {
          console.log('User not logged in, cannot show paywall');
          onError?.('User not logged in')
          return false
        }
  
        await initializeRevenueCat()
        
        if (await checkSubscriptionStatus()) {
          console.log('User already has active subscription');
          onSuccess?.()
          return true
        }
  
        console.log('Fetching RevenueCat offerings');
        const offerings = await Purchases.getOfferings()
        console.log('Available offerings:', offerings);
        const offering = offerings.all[offeringId]
  
        if (!offering) {
          console.log('Offering not found:', offeringId);
          onError?.('Offering not found')
          return false
        }
  
        console.log('Presenting paywall with offering:', offering);
        const paywallResult = await RevenueCatUI.presentPaywall({ offering })
        console.log('Paywall result:', paywallResult);
  
        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
            console.log('Purchase successful');
            const hasActiveSubscription = await checkSubscriptionStatus()
            setHasSubscription(hasActiveSubscription)
            if (hasActiveSubscription) {
              onSuccess?.()
            }
            return hasActiveSubscription
          case PAYWALL_RESULT.RESTORED:
            console.log('Purchase restored');
            const hasRestoredSubscription = await checkSubscriptionStatus()
            setHasSubscription(hasRestoredSubscription)
            if (hasRestoredSubscription) {
              onSuccess?.()
            }
            return hasRestoredSubscription
          case PAYWALL_RESULT.ERROR:
            console.log('Paywall error occurred');
            onError?.('An error occurred')
            return false
          case PAYWALL_RESULT.CANCELLED:
            console.log('Purchase cancelled by user');
            onError?.('User cancelled the purchase')
            return false
          case PAYWALL_RESULT.NOT_PRESENTED:
            console.log('Paywall was not presented');
            onError?.('Paywall was not presented')
            return false
          default:
            console.log('Unknown paywall result:', paywallResult);
            onError?.('Unknown result')
            return false
        }
      } catch (error) {
        console.error('Purchase error:', error)
        onError?.('Purchase error')
        return false
      }
    }
  
    return {
      showPaywall,
      isUserLoggedIn: isSignedIn && !!userId,
      hasSubscription
    }
  }