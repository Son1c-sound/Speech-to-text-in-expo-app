// import React, { useEffect } from "react"
// import { View, Text, StyleSheet } from "react-native"
// import { useAuth } from "@clerk/clerk-expo"
// import { useFetchUserData } from "@/hooks/useUserDataForLimits"

// export function Badge() {
//   const { userId } = useAuth()  
//   const { userData, isLoading, fetchUserData } = useFetchUserData(userId)

//   useEffect(() => {
//     if (userId) {
//       fetchUserData()  
//     }
//   }, [userId])

//   return (
//     <View style={styles.container}>
//       {isLoading ? (
//         <Text style={styles.text}>Loading...</Text>
//       ) : (
//         <Text style={styles.text}>
//           Free Generations: {userData ? userData.tokens : 'N/A'}
//         </Text>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 8,
//   },
//   text: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#2563EB",
//     textTransform: "uppercase",
//   },
// })
