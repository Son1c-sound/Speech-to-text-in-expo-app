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
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
    textTransform: "uppercase",
  },
})

