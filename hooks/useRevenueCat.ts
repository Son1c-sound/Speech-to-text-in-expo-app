import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY!;
const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY!;

export const initializeRevenueCat = async () => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
    
    if (!apiKey) {
      throw new Error('RevenueCat API key not found');
    }

    console.log('Configuring RevenueCat...');
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    await Purchases.configure({ apiKey });
    
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('RevenueCat initialized successfully', customerInfo);
  } catch (error) {
    console.error('RevenueCat initialization error:', error);
  }
};