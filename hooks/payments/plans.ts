// @ts-nocheck
import { useUser } from "@clerk/clerk-expo"
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
    const { user } = useUser()
    const [hasSubscription, setHasSubscription] = useState(false)
  
    const checkSubscriptionStatus = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo()
        return customerInfo.entitlements.active['free-trial-expo']?.isActive === true
      } catch (error) {
        console.error('Error checking subscription:', error)
        return false
      }
    }
  
    const initializeRevenueCat = async () => {
      if (!user?.id) return false
  
      try {
        if (Platform.OS === 'ios') {
          await Purchases.configure({
            apiKey: 'appl_OumtDNxlBUHHDWxfQurCzuXzuQe',
            appUserID: user.id,
          })
        } else if (Platform.OS === 'android') {
          await Purchases.configure({
            apiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY,
            appUserID: user.id,
          })
        }
  
        const isActive = await checkSubscriptionStatus()
        setHasSubscription(isActive)
        return true
      } catch (error) {
        console.error('RevenueCat initialization error:', error)
        return false
      }
    }
  
    useEffect(() => {
      if (user?.id) {
        initializeRevenueCat()
        
        const purchasesUpdatedListener = Purchases.addCustomerInfoUpdateListener(async () => {
          const isActive = await checkSubscriptionStatus()
          setHasSubscription(isActive)
        })
  
        return () => {
          purchasesUpdatedListener?.remove()
        }
      }
    }, [user?.id])
  
    const showPaywall = async () => {
      try {
        if (!user?.id) {
          onError?.('User not logged in')
          return false
        }
  
        await initializeRevenueCat()
        
        if (await checkSubscriptionStatus()) {
          onSuccess?.()
          return true
        }
  
        const offerings = await Purchases.getOfferings()
        const offering = offerings.all[offeringId]
  
        if (!offering) {
          onError?.('Offering not found')
          return false
        }
  
        const paywallResult = await RevenueCatUI.presentPaywall({ offering })
  
        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
          case PAYWALL_RESULT.RESTORED:
            const hasActiveSubscription = await checkSubscriptionStatus()
            setHasSubscription(hasActiveSubscription)
            if (hasActiveSubscription) {
              onSuccess?.()
            }
            return hasActiveSubscription
          case PAYWALL_RESULT.ERROR:
            onError?.('An error occurred')
            return false
          case PAYWALL_RESULT.CANCELLED:
            onError?.('User cancelled the purchase')
            return false
          case PAYWALL_RESULT.NOT_PRESENTED:
            onError?.('Paywall was not presented')
            return false
          default:
            onError?.('Unknown result')
            return false
        }
      } catch (error) {
        onError?.('Purchase error')
        console.error('Purchase error:', error)
        return false
      }
    }
  
    return {
      showPaywall,
      isUserLoggedIn: !!user?.id,
      hasSubscription
    }
  }