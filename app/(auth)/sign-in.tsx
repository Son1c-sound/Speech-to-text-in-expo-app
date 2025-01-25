import React from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import SignInWithOAuth from "./oauth"
import AppPreview from "@/components/whisperIn/custom-components/appPreview"

export default function Page() {

  const [showPreview, setShowPreview] = React.useState(true)
  const handlePreviewComplete = () => setShowPreview(false)
  
  if (showPreview) return <AppPreview onComplete={handlePreviewComplete} />
  
 return (
   <View style={styles.container}>
     <View style={styles.content}>
       <View style={styles.logoContainer}>
         <Image 
           source={{ uri: "your_logo_url" }}
           style={styles.logo}
         />
         <Text style={styles.title}>WhisperIn</Text>
         <Text style={styles.subtitle}>Transform your voice into LinkedIn posts</Text>
       </View>
       
       <View style={styles.authContainer}>
         <SignInWithOAuth />
       </View>
       
       <Text style={styles.terms}>
         By signing in, you agree to our Terms and Privacy Policy
       </Text>
     </View>
   </View>
 )
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#FFFFFF",
   justifyContent: "center",
 },
 content: {
   alignItems: "center",
   padding: 24,
   gap: 48,
 },
 logoContainer: {
   alignItems: "center",
   gap: 12,
 },
 logo: {
   width: 64,
   height: 64,
 },
 title: {
   fontSize: 32,
   fontWeight: "700",
   color: "#000000",
 },
 subtitle: {
   fontSize: 16,
   color: "#666666",
 },
 authContainer: {
   width: "100%",
   maxWidth: 320,
 },
 terms: {
   fontSize: 12,
   color: "#666666",
   textAlign: "center",
 }
})