import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '@/components/whisperIn/custom-components/navbar';

const SupportCard = ({ 
  title, 
  icon, 
  onPress 
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#0A66C2" />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const Support = () => {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@yourapp.com');
  };

  const handleTwitterSupport = () => {
    Linking.openURL('https://twitter.com/youraccount');
  };

  const handleFacebookSupport = () => {
    Linking.openURL('https://facebook.com/youraccount');
  };

  const handleInstagramSupport = () => {
    Linking.openURL('https://instagram.com/youraccount');
  };

  return (
    <>
    <Navbar />
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Support</Text>
        
        <View style={styles.cardsContainer}>
          <SupportCard
            title="Email Support"
            icon="mail-outline"
            onPress={handleEmailSupport}
          />
          
          <SupportCard
            title="Twitter"
            icon="logo-twitter"
            onPress={handleTwitterSupport}
          />

          <SupportCard
            title="Facebook"
            icon="logo-facebook"
            onPress={handleFacebookSupport}
          />

          <SupportCard
            title="Instagram"
            icon="logo-instagram"
            onPress={handleInstagramSupport}
          />
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default Support;