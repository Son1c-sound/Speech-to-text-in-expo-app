import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

interface AppPreviewProps {
  onComplete: () => void;
}

export default function AppPreview({ onComplete }: AppPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const PreviewPage1 = () => (
    <View style={styles.pageContainer}>
      <Image
        src={('https://i.ibb.co/cLMh7vm/4444444444444444444444-jpg.png')}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>Speak & Share</Text>
      <Text style={styles.description}>Transform your voice into engaging LinkedIn posts</Text>
    </View>
  );

  const PreviewPage2 = () => (
    <View style={styles.pageContainer}>
      <Image
        src={('https://i.ibb.co/RcWY0YK/55555555555555555555555555555.png')}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>AI-Powered Optimization</Text>
      <Text style={styles.description}>Get professional, engaging posts crafted by AI</Text>
    </View>
  );

  const PreviewPage3 = () => (
    <View style={styles.pageContainer}>
      <Image
        src={('https://media.istockphoto.com/id/1456452524/vector/data-analysis-research-statistics-concept-strategy-business-development-results-of.jpg?s=2048x2048&w=is&k=20&c=-CLVbMpBMqclN7upmp3VafLg9D642PuHZdSYq8X2yzk=')}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>Start Growing</Text>
      <Text style={styles.description}>Boost your LinkedIn presence effortlessly</Text>
    </View>
  );

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {currentPage === 1 && <PreviewPage1 />}
      {currentPage === 2 && <PreviewPage2 />}
      {currentPage === 3 && <PreviewPage3 />}
      
      <View style={styles.footer}>
        <View style={styles.dots}>
          {[1, 2, 3].map(page => (
            <View
              key={page}
              style={[styles.dot, currentPage === page && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {currentPage === 3 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  previewImage: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});