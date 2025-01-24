import { Link, router } from "expo-router";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";

interface UserStats {
  totalPosts: number;
  optimizedPosts: number;
  remainingGenerations: number;
}

const ProfileComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const { userId } = useAuth()
  const { user } = useUser();
  const [email, setEmail] = useState<string>("");

  const [stats] = useState<UserStats>({
    totalPosts: 4,
    optimizedPosts: 2,
    remainingGenerations: 25,
  })

  React.useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert(
        "Error signing out",
        error.message || "Something went wrong."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatBox: React.FC<{ number: number; label: string }> = ({
    number,
    label,
  }) => (
    <View style={styles.statBox} accessible={true} accessibilityRole="text">
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Profile
          </Text>
          <View style={styles.userBadge}>
            <Feather name="user" size={18} color="#4B5563" />
          </View>
        </View>
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <StatBox number={stats.totalPosts} label="Total Posts" />
            <StatBox number={stats.optimizedPosts} label="Optimized" />
          </View>

          <View style={styles.generationCard}>
            <View style={styles.generationRow}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={18}
                color="#059669"
              />
              <Text style={styles.generationText}>
                {stats.remainingGenerations} generations remaining
              </Text>
            </View>
          </View>
        </View>

        <Link href="/premium" asChild>
          <TouchableOpacity
            style={styles.primaryButton}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to Premium"
          >
            <FontAwesome5 name="crown" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.actionButtons}>
          <Link href="/feature-request" asChild>
            <TouchableOpacity
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Feature request"
            >
              <Feather name="message-square" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>Feature request</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/support" asChild>
            <TouchableOpacity
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Support"
            >
              <Feather name="headphones" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>Support</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sign Out"
          disabled={isLoading}
        >
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  userBadge: {
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  profileSection: {
    marginBottom: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  generationCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  generationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  generationText: {
    fontSize: 15,
    color: "#059669",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 24,
    gap: 6,
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ProfileComponent;