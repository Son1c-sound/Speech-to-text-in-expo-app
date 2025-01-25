import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from "react-native"

interface AppPreviewProps {
 onComplete: () => void
}

export default function AppPreview({ onComplete }: AppPreviewProps) {
 const [currentPage, setCurrentPage] = useState(1)

 const previewPages = [
   {
     image: "https://i.ibb.co/cLMh7vm/4444444444444444444444-jpg.png",
     title: "LinkedIn Post Optimizer",
     description: "Transform your voice into engaging LinkedIn posts. Just speak and let AI craft the perfect post.",
     type: "text-and-image"
   },
   {
     image: "https://i.ibb.co/RcWY0YK/55555555555555555555555555555.png", 
     title: "Speech to Text & AI Magic",
     description: "Advanced AI converts your speech to text and optimizes it for maximum engagement on LinkedIn.",
     type: "image-only"
   },
   {
     image: "https://media.istockphoto.com/id/1456452524/vector/data-analysis-research-statistics-concept-strategy-business-development-results-of.jpg?s=2048x2048&w=is&k=20&c=-CLVbMpBMqclN7upmp3VafLg9D642PuHZdSYq8X2yzk=",
     title: "AI-Powered Results",
     description: "See your voice transform into professional, engaging LinkedIn content in real-time.",
     type: "image-top"
   }
 ]

 const PreviewPage = ({ image, title, description, type }: { image: string; title: string; description: string; type: string }) => {
   if (type === "text-and-image") {
     return (
       <View style={styles.pageContainer}>
         <View style={styles.imageSection}>
           <View style={styles.blueBackground}>
             <Image source={{ uri: image }} style={styles.phoneImage} resizeMode="contain" />
             <Text style={styles.headerText}>Speak and create LinkedIn posts</Text>
           </View>
         </View>
         <View style={styles.contentContainer}>
           <Text style={styles.title}>{title}</Text>
           <Text style={styles.description}>{description}</Text>
         </View>
       </View>
     )
   }
   
   if (type === "image-only") {
     return (
       <View style={styles.pageContainer}>
         <View style={styles.imageOnlySection}>
           <View style={styles.twoImagesContainer}>
             <Image source={{ uri: image }} style={styles.phoneImageHalf} resizeMode="contain" />
             <Image source={{ uri: image }} style={styles.phoneImageHalf} resizeMode="contain" />
           </View>
         </View>
         <View style={styles.contentContainer}>
           <Text style={styles.title}>{title}</Text>
           <Text style={styles.description}>{description}</Text>
         </View>
       </View>
     )
   }

   return (
     <View style={styles.pageContainer}>
       <View style={styles.imageTopSection}>
         <Image source={{ uri: image }} style={styles.topImage} resizeMode="contain" />
       </View>
       <View style={styles.contentContainer}>
         <Text style={styles.title}>{title}</Text>
         <Text style={styles.description}>{description}</Text>
       </View>
     </View>
   )
 }

 const handleNext = () => {
   if (currentPage < previewPages.length) {
     setCurrentPage((prev) => prev + 1)
   } else {
     onComplete()
   }
 }

 return (
   <SafeAreaView style={styles.container}>
     <PreviewPage {...previewPages[currentPage - 1]} />
     <View style={styles.footer}>
       <View style={styles.dots}>
         {previewPages.map((_, index) => (
           <View key={index} style={[styles.dot, currentPage === index + 1 && styles.activeDot]} />
         ))}
       </View>
       <TouchableOpacity onPress={handleNext} style={styles.button}>
         <Text style={styles.buttonText}>{currentPage === previewPages.length ? "Get Started" : "Next"}</Text>
       </TouchableOpacity>
     </View>
   </SafeAreaView>
 )
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#FFFFFF",
 },
 pageContainer: {
   flex: 1,
 },
 imageSection: {
   height: Dimensions.get("window").height * 0.45,
 },
 blueBackground: {
   backgroundColor: "#0A66C2",
   height: "100%",
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-around",
   paddingHorizontal: 20,
 },
 imageOnlySection: {
   height: Dimensions.get("window").height * 0.45,
   backgroundColor: "#0A66C2",
   justifyContent: "center",
 },
 twoImagesContainer: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
   width: '100%',
   height: '100%',
   paddingHorizontal: 20,
 },
 phoneImageHalf: {
   width: Dimensions.get("window").width * 0.4,
   height: Dimensions.get("window").height * 0.35,
 },
 fullImage: {
   width: "100%",
   height: "100%",
 },
 imageTopSection: {
   height: Dimensions.get("window").height * 0.45,
   backgroundColor: "#0A66C2",
   justifyContent: "center",
   alignItems: "center",
 },
 topImage: {
   width: "80%",
   height: "80%",
 },
 phoneImage: {
   width: Dimensions.get("window").width * 0.4,
   height: Dimensions.get("window").height * 0.35,
 },
 headerText: {
   color: "#FFFFFF",
   fontSize: 32,
   fontWeight: "700",
   flex: 1,
   marginLeft: 20,
 },
 contentContainer: {
   flex: 1,
   paddingHorizontal: 24,
   paddingTop: 40,
   alignItems: "center",
 },
 title: {
   fontSize: 32,
   fontWeight: "700",
   textAlign: "center",
   color: "#000000",
   marginBottom: 24,
 },
 description: {
   fontSize: 18,
   color: "#333333",
   textAlign: "center",
   lineHeight: 28,
 },
 footer: {
   paddingHorizontal: 24,
   paddingBottom: 40,
   gap: 24,
 },
 dots: {
   flexDirection: "row",
   justifyContent: "center",
   gap: 8,
 },
 dot: {
   width: 8,
   height: 8,
   borderRadius: 4,
   backgroundColor: "#E0E0E0",
 },
 activeDot: {
   backgroundColor: "#0A66C2",
 },
 button: {
   backgroundColor: "#0A66C2",
   padding: 16,
   borderRadius: 32,
   alignItems: "center",
 },
 buttonText: {
   color: "#FFFFFF",
   fontSize: 18,
   fontWeight: "600",
 },
})