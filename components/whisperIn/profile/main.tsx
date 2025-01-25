import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
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
      Alert.alert(
        "Error signing out",
        error.message || "Something went wrong."
      );
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
};

type SectionProps = {
  title: string;
  items: MenuItem[];
};

const ICON_SIZE = 24;
const BACK_BUTTON_SIZE = 40;


const BackButton = () => (
  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={ICON_SIZE} color="black" />
  </TouchableOpacity>
);

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.map((item, index) => (
      item.route ? (
        <Link href={item.route as any} asChild key={index}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, item.color && { color: item.color }]}>{item.label}</Text>
          </TouchableOpacity>
        </Link>
      ) : (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
          <Text style={[styles.menuText, item.color && { color: item.color }]}>{item.label}</Text>
        </TouchableOpacity>
      )
    ))}
  </View>
);

const SettingsComponent: React.FC = () => {
  const handleSignOut = useSignOut();

  const sections: SectionProps[] = [
    {
      title: "Plans",
      items: [{ label: "Upgrade Plan", route: "/chat-support" }]
    },
    {
      title: "Help",
      items: [{ label: "Chat Support", route: "/chat-support" }]
    },
    {
      title: "Account",
      items: [{ label: "Sign Out", onPress: handleSignOut }]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <BackButton />
        <Text style={styles.title}>Settings</Text>
        {sections.map((section, index) => (
          <Section key={index} title={section.title} items={section.items} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_SIZE / 2,
    backgroundColor: '#FFFFFF',
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
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    color: "#000000"
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 12,
    fontWeight: "400"
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "400"
  }
});

export default SettingsComponent;