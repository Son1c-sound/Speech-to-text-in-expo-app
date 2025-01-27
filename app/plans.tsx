import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/whisperIn/custom-components/navbar';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  buttonText: string;
  recommended?: boolean;
}

const plans: Plan[] = [
    {
      name: 'Free',
      price: '$0',
      period: 'month',
      features: [
        { name: '10 Total Generations', included: true },
        { name: 'Basic Text Optimization', included: true },
        { name: 'Cross Platform Support', included: true },
        { name: 'Standard Quality Audio', included: true },
        { name: 'Community Support', included: true },
        { name: 'Priority Processing', included: false },
      ],
      buttonText: 'Current Plan'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      features: [
        { name: 'Everything included in Free plan', included: true },
        { name: 'Unlimited Voice Notes', included: true },
        { name: 'Unlimited Text Optimization', included: true },
        { name: 'Unlimited storage', included: true },
        { name: 'Cross Platform Support', included: true },
        { name: 'High Quality Audio', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Priority Processing', included: true },
      ],
      buttonText: 'Upgrade to Pro',
      recommended: true
    }
]

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
  <View style={[
    styles.planCard,
    plan.recommended && styles.recommendedCard
  ]}>
    {plan.recommended && (
      <View style={styles.recommendedBadge}>
        <Text style={styles.recommendedText}>Recommended</Text>
      </View>
    )}
    
    <Text style={styles.planName}>{plan.name}</Text>
    
    <View style={styles.priceContainer}>
      <Text style={styles.price}>{plan.price}</Text>
      <Text style={styles.period}>/{plan.period}</Text>
    </View>
    
    <View style={styles.featuresContainer}>
      {plan.features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Ionicons
            name={feature.included ? "checkmark-circle" : "close-circle"}
            size={20}
            color={feature.included ? "#0A66C2" : "#9CA3AF"}
          />
          <Text style={[
            styles.featureText,
            !feature.included && styles.featureDisabled
          ]}>
            {feature.name}
          </Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity
      style={[
        styles.button,
        plan.recommended ? styles.recommendedButton : styles.standardButton
      ]}
    >
      <Text style={[
        styles.buttonText,
        plan.recommended ? styles.recommendedButtonText : styles.standardButtonText
      ]}>
        {plan.buttonText}
      </Text>
    </TouchableOpacity>
  </View>
);

export default function Plans() {
  return (
    <>
    <Navbar />
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the perfect plan for your needs
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
  },
  plansContainer: {
    gap: 24,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: '#0A66C2',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 24,
    backgroundColor: '#0A66C2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  period: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#000000',
  },
  featureDisabled: {
    color: '#9CA3AF',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  standardButton: {
    backgroundColor: '#F3F4F6',
  },
  recommendedButton: {
    backgroundColor: '#0A66C2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  standardButtonText: {
    color: '#374151',
  },
  recommendedButtonText: {
    color: '#FFFFFF',
  },
});