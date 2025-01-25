import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@clerk/clerk-expo";

const SettingsComponent = () => {
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

  const renderSection = (title: string, items: { label: string; route?: string; onPress?: () => void; color?: string }[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        item.route ? (
          <Link href={item.route as any} asChild key={index}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, item.color ? { color: item.color } : {}]}>{item.label}</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={[styles.menuText, item.color ? { color: item.color } : {}]}>{item.label}</Text>
          </TouchableOpacity>
        )
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Settings</Text>

        {renderSection("Help", [
          { label: "Chat Support", route: "/chat-support" }
        ])}

        {renderSection("Customization", [
          { label: "Custom Prompts", route: "/custom-prompts" }
        ])}

        {renderSection("Recovery", [
          { label: "Recover Audio Files", route: "/recover-audio" }
        ])}

        {renderSection("Account", [
          { label: "Delete Account", route: "/delete-account", color: "#FF3B30" },
          { label: "Sign Out", onPress: handleSignOut }
        ])}
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
    width: 40,
    height: 40,
    borderRadius: 20,
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