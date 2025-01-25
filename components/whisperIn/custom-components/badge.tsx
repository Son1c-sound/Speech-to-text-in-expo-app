import React from "react"
import { View, Text, StyleSheet } from "react-native"

export function Badge() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Free Generations: 25</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
    textTransform: "uppercase",
  },
})

