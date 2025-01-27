import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PayButton from '@/components/whisperIn/googleBilling';

const CloseButton = () => (
  <TouchableOpacity 
    style={styles.closeButton} 
    onPress={() => router.back()}
  >
    <Ionicons name="close" size={24} color="#000" />
  </TouchableOpacity>
);

const features = [
  'Unlimited Recording',
  'Unlimited Generation of posts',
  'Unlimited Storage', 
  'Priority Support',
];

const Plans = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CloseButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://i.ibb.co/yX55CFk/Untitled-1.png' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Speak once, share everywhere.</Text>
        </View>
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <View style={styles.pricingContainer}>
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>9.99 USD/mo</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.ctaButton}>
          <PayButton></PayButton>
          <Text style={styles.ctaButtonText}>Get the app</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerLink}>Restore</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Terms</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Privacy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 24,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 16,
  },
  logo: {
    width: 200,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 55,
    marginTop: 35,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 32,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A66C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  pricingContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  priceSection: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 24,
  },
  footerLink: {
    color: '#666',
    fontSize: 14,
  },
  footerDot: {
    color: '#666',
  },
});

export default Plans;