import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';

// Main App Component
export default function App() {
  const initializeIAP = async () => {
    try {
      const isAvailable = await InAppPurchases.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'In-app purchases are not available on this device.');
        return;
      }

      // Connect to the in-app purchase service
      await InAppPurchases.connectAsync();

      // Set up a listener for purchase updates
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results.forEach((purchase) => {
            if (!purchase.acknowledged) {
              console.log('Purchase received:', purchase);
              // Acknowledge or consume the purchase here
            }
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          Alert.alert('Purchase Canceled', 'You canceled the purchase.');
        } else {
          console.error('Purchase failed:', errorCode);
          Alert.alert('Error', `Purchase failed with code: ${errorCode}`);
        }
      });
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  };

  useEffect(() => {
    initializeIAP();
    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const handleBuySubscription = async () => {
    try {
      const products = await InAppPurchases.getProductsAsync(['MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5DM6ll44XzgDiJJv28JXj4xf84Y9qr3gQ9wxRqeQPkKiIQRws+hGhj78SYk91zYIs6vp6Nqv+cLWbf9HOp+Ki39NFfBUT+oed8Bgoh1d6RqX3ifhhjbER+ONpDjuyziZoqxQR0xemO6S6TTzFPbf1NwLHEDzYnfCcyqv4MwvaJMFL2P5ZKYm3ywa9YZRGk7nWcIO2rzL/R0Sn/2QSaQrlvMW9yFDBvktI3j0QTH05sFx+NQ2mrPSL0RHLHCjQinxAXwtcCNdmyvV9f2kdifVkRRYOqKNxpnOVxM78J4+VKwDb46lQo1r1Q5/yAf+3eIDyGx8TcXte6i5xTKoPzsSAwIDAQAB']);
      console.log('Available products:', products);

      await InAppPurchases.purchaseItemAsync('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5DM6ll44XzgDiJJv28JXj4xf84Y9qr3gQ9wxRqeQPkKiIQRws+hGhj78SYk91zYIs6vp6Nqv+cLWbf9HOp+Ki39NFfBUT+oed8Bgoh1d6RqX3ifhhjbER+ONpDjuyziZoqxQR0xemO6S6TTzFPbf1NwLHEDzYnfCcyqv4MwvaJMFL2P5ZKYm3ywa9YZRGk7nWcIO2rzL/R0Sn/2QSaQrlvMW9yFDBvktI3j0QTH05sFx+NQ2mrPSL0RHLHCjQinxAXwtcCNdmyvV9f2kdifVkRRYOqKNxpnOVxM78J4+VKwDb46lQo1r1Q5/yAf+3eIDyGx8TcXte6i5xTKoPzsSAwIDAQAB');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Error', 'Failed to initiate the purchase.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Buy Subscription" onPress={handleBuySubscription} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
