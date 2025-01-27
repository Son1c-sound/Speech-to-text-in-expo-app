import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@clerk/clerk-expo";

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
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
};

type SectionProps = {
  title: string;
  description?: string;
  items: MenuItem[];
};

const ICON_SIZE = 24;

const BackButton = () => (
  <TouchableOpacity 
    style={styles.backButton} 
    onPress={() => router.back()}
    activeOpacity={0.7}
  >
    <Ionicons name="arrow-back" size={ICON_SIZE} color="#000" />
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
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  {item.icon && (
                    <View style={[styles.iconContainer, item.color && { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color || '#007AFF'} />
                    </View>
                  )}
                  <View style={styles.menuItemText}>
                    <Text style={[styles.menuText, item.color && { color: item.color }]}>
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                {item.icon && (
                  <View style={[styles.iconContainer, item.color && { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color || '#007AFF'} />
                  </View>
                )}
                <View style={styles.menuItemText}>
                  <Text style={[styles.menuText, item.color && { color: item.color }]}>
                    {item.label}
                  </Text>
                  {item.description && (
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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

  const sections: SectionProps[] = [
    {
      title: "Premium Features",
      description: "Unlock more possibilities with our premium plans",
      items: [
        { 
          label: "Upgrade Plan",
          route: "/plans",
          icon: "star",
          color: "#007AFF",
          description: "Get access to advanced features"
        }
      ]
    },
    {
      title: "Support",
      description: "We're here to help you",
      items: [
        { 
          label: "Contact Support",
          route: "/support",
          icon: "chatbubble-ellipses",
          color: "#32C759",
          description: "Get help with your account"
        },
        { 
          label: "FAQ",
          route: "/faq",
          icon: "help-circle",
          color: "#32C759"
        }
      ]
    },
    {
      title: "Account",
      items: [
        { 
          label: "Sign Out",
          onPress: handleSignOut,
          icon: "log-out",
          color: "#FF3B30"
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <Text style={styles.title}>Settings</Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 32,
    color: "#000000",
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  menuItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuText: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "400",
  },
  menuItemDescription: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
});

export default SettingsComponent;