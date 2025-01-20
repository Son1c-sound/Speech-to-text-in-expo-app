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

interface NavbarProps {
  children?: React.ReactNode;
}

function Navbar({ children }: NavbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => router.push('/')}
        >
          <Text style={styles.headerTitle}>WhisperIn</Text>
          <View style={styles.logoAccent} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.badgeContainer}
          onPress={() => router.push("/history")}
        >
          <Badge text="Hobby" variant="outline" />
        </TouchableOpacity>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomWidth: 0.6,
    borderBottomColor: 'rgba(241, 241, 241, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  logoAccent: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginLeft: 2,
    marginTop: -12,
  },
  badgeContainer: {
    transform: [{scale: 1.1}],
  },
});

export default Navbar;