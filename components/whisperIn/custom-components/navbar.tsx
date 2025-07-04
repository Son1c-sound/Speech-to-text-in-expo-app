import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native"
import { router } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface NavbarProps {
  children?: React.ReactNode
  onMenuPress?: () => void
  showBackButton?: boolean
  title?: string
}

const NAVBAR_HEIGHT = 52

function Navbar({ 
  children, 
  showBackButton = false,
  title
}: NavbarProps) {
  const insets = useSafeAreaInsets()

  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Ionicons name="chevron-back" size={24} color="#2563EB" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.logoSection}
                onPress={() => router.push('/')}
              >
                <Text style={styles.brandText}>Recording</Text>
              </TouchableOpacity>
            )}
          </View>

          {title && (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          )}

          <View style={styles.actionsSection}>
           
            <Ionicons 
              onPress={() => router.push('/profile')} 
              name="settings" 
              size={25} 
              color="black" 
            />
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
    height: NAVBAR_HEIGHT,
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -8,
    padding: 8,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#00000',
    letterSpacing: -0.5,
  },
  titleText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 88,
  },
  actionsSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  planBadge: {
    transform: [{ scale: 0.96 }],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: '#EEF2FF',
  },
  freeBadge: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  premiumBadgeText: {
    color: '#2563EB',
  },
  freeBadgeText: {
    color: '#6B7280',
  },
  avatarButton: {
    padding: 4,
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
})

export default Navbar