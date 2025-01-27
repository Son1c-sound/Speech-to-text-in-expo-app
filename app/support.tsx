import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '@/components/whisperIn/custom-components/navbar';

interface SupportCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
}

const SupportCard = React.memo(({ 
  title, 
  description,
  icon, 
  onPress,
  color 
}: SupportCardProps) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
    </Animated.View>
  );
});

const Support = () => {
  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: "mail-outline",
      color: "#007AFF",
      onPress: () => Linking.openURL('mailto:support@yourapp.com')
    },
    {
      title: "Twitter",
      description: "Follow us for quick updates and support",
      icon: "logo-twitter",
      color: "#1DA1F2",
      onPress: () => Linking.openURL('https://twitter.com/youraccount')
    },
    {
      title: "Facebook",
      description: "Join our community on Facebook",
      icon: "logo-facebook",
      color: "#4267B2",
      onPress: () => Linking.openURL('https://facebook.com/youraccount')
    },
    {
      title: "Instagram",
      description: "Follow our Instagram for visual updates",
      icon: "logo-instagram",
      color: "#E4405F",
      onPress: () => Linking.openURL('https://instagram.com/youraccount')
    },
    {
      title: "FAQ",
      description: "Browse our frequently asked questions",
      icon: "help-circle-outline",
      color: "#32C759",
      onPress: () => Linking.openURL('https://yourapp.com/faq')
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: "chatbubble-ellipses-outline",
      color: "#5856D6",
      onPress: () => console.log("Open chat")
    }
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
                icon={option.icon as keyof typeof Ionicons.glyphMap}
                onPress={option.onPress}
                color={option.color}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Still need help?</Text>
            <Text style={styles.footerText}>
              Our support team is available 24/7 to assist you with any questions or concerns.
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
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