import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CloseButton = () => (
  <TouchableOpacity 
    style={styles.closeButton} 
    onPress={() => router.back()}
  >
    <Ionicons name="close" size={24} color="#000" />
  </TouchableOpacity>
);

const features = [
  {
    title: 'Unlimited Recording',
    description: 'Record as many posts as you want, whenever you want'
  },
  {
    title: 'Unlimited Generation of posts',
    description: 'Generate optimized content for all platforms'
  },
  {
    title: 'Unlimited Storage',
    description: 'Keep all your recordings and generated content'
  },
  {
    title: 'Priority Support',
    description: '24/7 premium customer support'
  },
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
          <Text style={styles.subtitle}>Transform your voice into engaging content across all platforms</Text>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Text style={styles.priceTitle}>Premium Plan</Text>
            <Text style={styles.price}>$7.99<Text style={styles.period}>/month</Text></Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Upgrade Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 40,
    marginTop: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 20,
  },
  priceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A66C2',
  },
  period: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A66C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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