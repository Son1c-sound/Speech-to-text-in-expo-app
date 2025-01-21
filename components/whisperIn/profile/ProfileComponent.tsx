import { Link, router } from 'expo-router';
import { 
  Feather,
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ProfileComponent = () => {
  const userEmail = 'makaradze98.s@gmail.com';
  
  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>WhisperIn Profile</Text>
          <View style={styles.userBadge}>
            <Feather name="user" size={18} color="#4B5563" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.email}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Usage</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Total Posts</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Optimized</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.generationRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#059669" />
              <Text style={styles.generationText}>25 generations remaining</Text>
            </View>
          </View>
        </View>

        <Link href="/premium" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <FontAwesome5 name="crown" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.actionButtons}>
          <Link href="/feature-request" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="message-square" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>Feature request</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/support" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="headphones" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>Support</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  userBadge: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  generationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generationText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
    gap: 6,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileComponent;