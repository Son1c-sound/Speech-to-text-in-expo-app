import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CloseButton = () => (
 <TouchableOpacity 
   style={styles.closeButton} 
   onPress={() => router.back()}
 >
   <Ionicons name="close" size={24} color="#000" />
 </TouchableOpacity>
);

const features = [
 'Unlimited recordings to AI notes',
 'Unlimited file uploads to AI notes',
 'Unlimited chat with your notes', 
 'Unlimited custom prompts to fit your workflow',
 'No payment due today'
];

const Plans = () => {
 const [isAnnual, setIsAnnual] = useState(false);

 return (
   <SafeAreaView style={styles.container}>
     <Stack.Screen options={{ headerShown: false }} />
     <CloseButton />
     <ScrollView style={styles.scrollView}>
       <View style={styles.header}>
         <Image 
           source={{ uri: 'https://i.ibb.co/yX55CFk/Untitled-1.png' }}
           style={styles.logo}
         />
         <Text style={styles.title}>Speak once, share everywhere.</Text>
       </View>
       <View style={styles.featuresContainer}>
         {features.map((feature, index) => (
           <View key={index} style={styles.featureRow}>
             <View style={styles.checkCircle}>
               <Ionicons name="checkmark" size={20} color="#fff" />
             </View>
             <Text style={styles.featureText}>{feature}</Text>
           </View>
         ))}
       </View>
       <View style={styles.pricingContainer}>
         <View style={styles.planToggle}>
           <TouchableOpacity 
             style={[styles.planOption, !isAnnual && styles.selectedPlan]}
             onPress={() => setIsAnnual(false)}
           >
             <Text style={[styles.planText, !isAnnual && styles.selectedPlanText]}>Monthly</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.planOption, isAnnual && styles.selectedPlan]}
             onPress={() => setIsAnnual(true)}
           >
             <View style={styles.annualContainer}>
               <Text style={[styles.planText, isAnnual && styles.selectedPlanText]}>Annual</Text>
               <View style={styles.discountBadge}>
                 <Text style={styles.discountText}>45% OFF</Text>
               </View>
             </View>
           </TouchableOpacity>
         </View>
         <View style={styles.priceSection}>
           <Text style={styles.priceText}>
             First 3 days free, then {isAnnual ? 'GEL 29.00' : 'GEL 49.00'}/{isAnnual ? 'yr' : 'mth'}
           </Text>
         </View>
       </View>

       {/* CTA Button */}
       <TouchableOpacity style={styles.ctaButton}>
         <Text style={styles.ctaButtonText}>Start Your Free Trial</Text>
       </TouchableOpacity>

       {/* Footer Links */}
       <View style={styles.footer}>
         <Text style={styles.footerLink}>Restore</Text>
         <Text style={styles.footerDot}>•</Text>
         <Text style={styles.footerLink}>Terms</Text>
         <Text style={styles.footerDot}>•</Text>
         <Text style={styles.footerLink}>Privacy</Text>
       </View>
     </ScrollView>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
 },
 scrollView: {
   flex: 1,
   paddingHorizontal: 24,
 },
 closeButton: {
   position: 'absolute',
   top: 12,
   left: 24,
   zIndex: 1,
   width: 40,
   height: 40,
   borderRadius: 20,
   backgroundColor: '#F5F5F5',
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: 40,
 },
 header: {
   alignItems: 'center',
   marginTop: 80,
   marginBottom: 16,
 },
 logo: {
   width: 200,
   height: 70,
   resizeMode: 'contain',
   marginBottom: 55,
   marginTop: 35,
   
 },
 title: {
   fontSize: 25,
   fontWeight: 'bold',
   textAlign: 'center',
   marginBottom: 16,
 },
 featuresContainer: {
   marginBottom: 32,
   gap: 16,
 },
 featureRow: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: 4,
   gap: 12,
 },
 checkCircle: {
   width: 24,
   height: 24,
   borderRadius: 12,
   backgroundColor: '#0A66C2',
   justifyContent: 'center',
   alignItems: 'center',
 },
 featureText: {
   fontSize: 16,
   flex: 1,
   lineHeight: 24,
 },
 pricingContainer: {
   backgroundColor: '#F5F5F5',
   borderRadius: 16,
   padding: 16,
   marginBottom: 24,
 },
 planToggle: {
   flexDirection: 'row',
   backgroundColor: '#EEEEEE',
   borderRadius: 8,
   padding: 4,
   marginBottom: 16,
 },
 planOption: {
   flex: 1,
   padding: 12,
   borderRadius: 6,
 },
 selectedPlan: {
   backgroundColor: '#fff',
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 1,
   },
   shadowOpacity: 0.1,
   shadowRadius: 2,
   elevation: 2,
 },
 planText: {
   textAlign: 'center',
   fontSize: 15,
 },
 selectedPlanText: {
   fontWeight: '600',
 },
 annualContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   gap: 6,
 },
 discountBadge: {
   backgroundColor: '#0A66C2',
   paddingHorizontal: 6,
   paddingVertical: 3,
   borderRadius: 10,
 },
 discountText: {
   color: '#fff',
   fontSize: 11,
   fontWeight: '600',
 },
 priceSection: {
   alignItems: 'center',
   marginTop: 8,
 },
 priceText: {
   fontSize: 15,
   color: '#666',
 },
 ctaButton: {
   backgroundColor: '#0A66C2',
   borderRadius: 28,
   padding: 18,
   alignItems: 'center',
   marginBottom: 32,
   marginTop: 8,
 },
 ctaButtonText: {
   color: '#fff',
   fontSize: 17,
   fontWeight: '600',
 },
 footer: {
   flexDirection: 'row',
   justifyContent: 'center',
   gap: 12,
   marginBottom: 24,
   paddingBottom: 24,
 },
 footerLink: {
   color: '#666',
   fontSize: 14,
 },
 footerDot: {
   color: '#666',
 },
});

export default Plans;