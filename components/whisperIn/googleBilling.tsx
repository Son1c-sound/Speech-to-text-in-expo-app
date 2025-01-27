import React, { useEffect, useState } from 'react';
import { Button, View, Text, Alert, Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import { IAPQueryResponse, InAppPurchase } from 'expo-in-app-purchases';

const productIds: string[] = ['com.example.product1']; // Replace with your product IDs

interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
}

const PayButton: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        // Connect to the store
        await InAppPurchases.connectAsync();

        // Set up purchase listener
        InAppPurchases.setPurchaseListener((result: IAPQueryResponse<InAppPurchase>) => {
          if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
            result.results?.forEach(async (purchase) => {
              if (!purchase.acknowledged) {
                // Acknowledge the purchase
                await InAppPurchases.finishTransactionAsync(purchase, true);
                
                // Handle the successful purchase
                handleSuccessfulPurchase(purchase);
              }
            });
          } else if (result.responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            Alert.alert('Purchase cancelled');
          } else {
            Alert.alert('Purchase failed', `Error code: ${result.errorCode}`);
          }
          setIsPurchasing(false);
        });

        // Load products
        const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
        
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          setProducts(results as Product[]);
        } else {
          console.warn('Failed to load products');
        }
      } catch (error) {
        console.error('IAP Initialization error:', error);
        Alert.alert('Error', 'Failed to initialize in-app purchases');
      }
    };

    initializeIAP();

    return () => {
      // Cleanup
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const handleSuccessfulPurchase = async (purchase: InAppPurchase): Promise<void> => {
    try {
      console.log('Purchase successful:', purchase);
      Alert.alert('Success', 'Thank you for your purchase!');
      
      // Here you would typically:
      // 1. Send purchase details to your backend
      // 2. Validate the purchase receipt
      // 3. Grant the user access to the purchased content
      
    } catch (error) {
      console.error('Error handling purchase:', error);
      Alert.alert('Error', 'Failed to process purchase. Please contact support.');
    }
  };

  const handlePurchase = async (productId: string): Promise<void> => {
    if (isPurchasing) return;

    try {
      setIsPurchasing(true);
      await InAppPurchases.purchaseItemAsync(productId);
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to initiate purchase');
      setIsPurchasing(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Available Products</Text>
      {products.map((product: Product) => (
        <View key={product.productId} style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16 }}>{product.title}</Text>
          <Text style={{ marginBottom: 5 }}>{product.description}</Text>
          <Text style={{ fontWeight: 'bold' }}>{product.price}</Text>
          <Button
            title={isPurchasing ? 'Processing...' : `Buy ${product.price}`}
            onPress={() => handlePurchase(product.productId)}
            disabled={isPurchasing}
          />
        </View>
      ))}
    </View>
  );
};

export default PayButton;