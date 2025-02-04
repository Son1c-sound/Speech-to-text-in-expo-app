import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Navbar from '@/components/whisperIn/custom-components/navbar';

interface SupportCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const SupportCard = React.memo(({ 
  title, 
  description,
  onPress,
}: SupportCardProps) => (
  <TouchableOpacity 
    style={styles.card}
    onPress={onPress}
  >
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
));

const Support = () => {
  const supportOptions = [
    {
      title: "Email Support",
      description: "korelabsofficial@gmail.com",
      onPress: () => Linking.openURL('korelabsofficial@gmail.com')
    },
    {
      title: "Twitter",
      description: "Follow us for quick updates and support",
      onPress: () => Linking.openURL('https://x.com/korelabs?s=21')
    },
    {
      title: "Facebook",
      description: "Join our community on Facebook",
      onPress: () => Linking.openURL('https://www.facebook.com/profile.php?id=61572665752229&mibextid=wwXIfr&rdid=v4qp97jXBxuZ8LCH&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15B8YSKRws%2F%3Fmibextid%3DwwXIfr')
    },
    {
      title: "Instagram",
      description: "Follow our Instagram for visual updates",
      onPress: () => Linking.openURL('https://www.instagram.com/korelabsofficial?utm_source=qr')
    },
    {
      title: "FAQ",
      description: "Browse our frequently asked questions",
      onPress: () => Linking.openURL('https://yourapp.com/faq')
    },
  ];

  return (
    <>
      <Navbar />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <Stack.Screen 
          options={{
            headerShown: false
          }}
        />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Support</Text>
            <Text style={styles.subtitle}>How can we help you today?</Text>
          </View>
          <View style={styles.cardsContainer}>
            {supportOptions.map((option, index) => (
              <SupportCard
                key={index}
                title={option.title}
                description={option.description}
                onPress={option.onPress}
              />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    marginTop: 8,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});

export default Support;