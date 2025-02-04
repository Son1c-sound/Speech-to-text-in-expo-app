import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { usePaywall } from "@/hooks/payments/plans";

const useSignOut = () => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error signing out", error.message || "Something went wrong.");
      console.error(error);
    }
  };

  return handleSignOut;
};

type MenuItem = {
  label: string;
  route?: string;
  onPress?: () => void;
  description?: string;
};

type SectionProps = {
  title: string;
  description?: string;
  items: MenuItem[];
};

const BackButton = () => (
  <TouchableOpacity onPress={() => router.back()}>
    <Text>Back</Text>
  </TouchableOpacity>
);

const Section: React.FC<SectionProps> = ({ title, description, items }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description && <Text style={styles.sectionDescription}>{description}</Text>}
    </View>
    <View style={styles.menuItemsContainer}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.route ? (
            <Link href={item.route as any} asChild>
              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  index === 0 && styles.menuItemFirst,
                  index === items.length - 1 && styles.menuItemLast,
                ]}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuText}>{item.label}</Text>
                    {item.description && (
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ) : (
            <TouchableOpacity 
              style={[
                styles.menuItem,
                index === 0 && styles.menuItemFirst,
                index === items.length - 1 && styles.menuItemLast,
              ]} 
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuText}>{item.label}</Text>
                  {item.description && (
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}
    </View>
  </View>
);

const SettingsComponent: React.FC = () => {
  const handleSignOut = useSignOut();
  const { showPaywall, isUserLoggedIn, hasSubscription } = usePaywall({
    onSuccess: () => Alert.alert("Success", "Subscription purchased successfully"),
    onError: (error) => Alert.alert("Error", error)
  });
  const [email, setEmail] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  const sections: SectionProps[] = [
    ...(hasSubscription ? [] : [{
      title: "Premium Features",
      description: "Unlock more possibilities with our premium plans",
      items: [
        { 
          label: "Upgrade Plan",
          onPress: showPaywall,
          description: "Get access to advanced features"
        }
      ]
    }]),
    {
      title: "Help & Support",
      description: "Get help with your account",
      items: [
        { 
          label: "Contact Support",
          route: "/support",
          description: "Reach out to our support team"
        }
      ]
    },
    {
      title: "FAQ",
      description: "Find answers to common questions",
      items: [
        { 
          label: "FAQ",
          route: "/faq",
          description: "Browse frequently asked questions"
        }
      ]
    },
    {
      title: "Account",
      items: [
        { 
          label: "Sign Out",
          onPress: handleSignOut
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <BackButton />
        <Text style={styles.title}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Signed in as:</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        {sections.map((section, index) => (
          <Section 
            key={index} 
            title={section.title} 
            description={section.description}
            items={section.items} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7"
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 3,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 4,
    fontWeight: "600",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  menuItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  menuItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuText: {
    fontSize: 17,
  },
  menuItemDescription: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
});

export default SettingsComponent;