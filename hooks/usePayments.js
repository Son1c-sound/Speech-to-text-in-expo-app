import { useState, useEffect } from 'react';

export const usePurchases = () => {
  const [offerings, setOfferings] = useState(null);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings.current);
      setLoading(false);
    } catch (error) {
      console.error('Error loading offerings:', error);
      setLoading(false);
    }
  };

  const purchasePackage = async (pkg) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    } catch (error) {
      if (!error.userCancelled) {
        console.error('Error purchasing package:', error);
      }
      throw error;
    }
  };

  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  return {
    offerings,
    loading,
    purchasePackage,
    restorePurchases
  };
};