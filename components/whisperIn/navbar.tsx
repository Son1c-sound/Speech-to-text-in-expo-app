import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native"
import { Badge } from '../badge'
import { router } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

interface NavbarProps {
  children?: React.ReactNode;
}

function Navbar({ children }: NavbarProps) {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Logo Section */}
          <TouchableOpacity 
            style={styles.logoSection}
            onPress={() => router.push('/')}
          >
            {/* You could add your logo image here */}
            <Text style={styles.brandText}>WhisperIn</Text>
            <View style={styles.dot} />
          </TouchableOpacity>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <View style={styles.planBadge}>
              <Badge text="Hobby" variant="outline" />
            </View>
            
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.avatarButton}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={18} color="#2563EB" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 47 : 0,
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 16,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginLeft: 2,
    marginTop: -14,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planBadge: {
    transform: [{ scale: 0.96 }],
  },
  avatarButton: {
    padding: 4,  // Increased touch target
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
});

export default Navbar;