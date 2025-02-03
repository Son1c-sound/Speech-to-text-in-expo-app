import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,

} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from '@expo/vector-icons'
import Loading from "../custom-components/Loading"
import * as FileSystem from 'expo-file-system';
import { useAuth } from "@clerk/clerk-expo";
import OptimizedPreview from "./optimizedPreview"
import Navbar from "../custom-components/navbar"



interface Optimizations {
  twitter?: string
  linkedin?: string
  reddit?: string
}
const WhisperIn: React.FC = () => {
  const [view, setView] = useState<'record' | 'preview'>('record')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [originalText, setOriginalText] = useState<string>('')
  const [transcriptionId, setTranscriptionId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [optimizations, setOptimizations] = useState<Optimizations>({})
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'reddit'>('twitter')
  const { userId } = useAuth()

  const startRecording = async (): Promise<void> => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      setRecordingInterval(interval)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  const pauseRecording = async (): Promise<void> => {
    if (!recording) return
    
    try {
      if (isPaused) {
        await recording.startAsync()
        setIsPaused(false)
        const interval = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
        setRecordingInterval(interval)
      } else {
        await recording.pauseAsync()
        setIsPaused(true)
        if (recordingInterval) {
          clearInterval(recordingInterval)
          setRecordingInterval(null)
        }
      }
    } catch (err) {
      console.error('Failed to pause/resume recording', err)
    }
  }

  const handleSpeechToText = async (audioUri: string): Promise<void> => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      const response = await fetch(
        'https://linkedin-voice-backend.vercel.app/api/speech-to-text',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            audioData: base64Data,
            fileName: 'recording.m4a',
            fileType: 'audio/m4a',
            userId
          })
        }
      )
  
      const data = await response.json();
  
      if (data.success) {
        setTranscriptionId(data.transcriptionId)
        setOriginalText(data.text)
        await handleOptimize(data.transcriptionId)
      } else {
        throw new Error(data.error || "Failed to process audio");
      }
    } catch (err) {
      console.error("Error message:", );
    }
  }


 
  const handleOptimize = async (transcriptionId: string) => {
    try {
      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/optimizeSpeech', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptionId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        setOptimizations(data.optimizations || {});
        setView('preview');
  
        // Start polling for Twitter and Reddit results
        const checkResults = async () => {
          const pollResponse = await fetch('https://linkedin-voice-backend.vercel.app/api/optimizeSpeech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcriptionId }),
          });
          
          const pollData = await pollResponse.json();
          if (pollData.success && pollData.optimizations) {
            setOptimizations(pollData.optimizations);
            
            // Stop polling if we have all platforms
            if (pollData.optimizations.twitter && pollData.optimizations.reddit) {
              return;
            }
            // Continue polling every 3 seconds
            setTimeout(checkResults, 3000);
          }
        };
  
        // Start checking for other platforms
        setTimeout(checkResults, 3000);
      }
    } catch (err: any) {
      console.error("Text optimization error:", err.message || err);
    }
  };

 
const stopRecording = async (): Promise<void> => {
  if (!recording) return

  setIsRecording(false)
  setIsPaused(false)
  if (recordingInterval) {
    clearInterval(recordingInterval)
    setRecordingInterval(null)
  }
  
  setIsProcessing(true)
  try {
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    if (uri) {
      await handleSpeechToText(uri) 
    }
  } catch (err) {
    console.error('Error stopping recording:', err)
  } finally {
    setIsProcessing(false)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
return (
  <SafeAreaView style={styles.container}>
    <Navbar />
    <View style={styles.content}>
      {view === "record" && (
        <View style={styles.recordContainer}>
          {isProcessing ? (
                <Loading />
          ) : (
            <>
              {!isRecording ? (
                <View style={styles.startRecordingContainer}>
                    <View style={styles.clockIconContainer}>
                <Ionicons name="mic" size={32} color="#666" />
              </View>
                  <Text style={styles.emptyStateText}>
                Create your recording by clicking the button below
              </Text>
              <TouchableOpacity 
                  style={styles.newRecordingButton}
                  onPress={startRecording}
                  disabled={isProcessing}
                >
                  <Text style={styles.buttonText}>+ New Recording</Text>
</TouchableOpacity>
                </View>
              ) : (
                <View style={styles.recordingContainer}>
  <View style={styles.timerContainer}>
    <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
  </View>
  
  <View style={styles.controlsContainer}>
    <TouchableOpacity 
      style={styles.controlButton}
      onPress={pauseRecording}
    >
      <Ionicons name={isPaused ? "play" : "pause"} size={28} color="#333" />
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.stopButton}
      onPress={stopRecording}
    >
      <Ionicons name="stop" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
</View>
              )}
            </>
          )}
        </View>
      )}
      {view === "preview" && (
       <OptimizedPreview 
       setView={setView}
       originalText={originalText}
       optimizedText={optimizations}
       setOptimizedText={setOptimizations}
       transcriptionId={transcriptionId}
       activeTab={activeTab}
       setActiveTab={setActiveTab}
     />
      )}
    </View>
  </SafeAreaView>
 )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  clockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  startRecordingContainer: {
    alignItems: "center",
    gap: 16,
  },
  noRecordingText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 10,
  },
  newRecordingButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#0A66C2', 
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#0A66C2",
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  purchaseText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#black",
  },
  recordingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  timerContainer: {
    marginBottom: 30,
  },
  timerText: {
    fontSize: 32,
    color: '#333',
    fontWeight: '500'
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeControls: {
    flexDirection: "row",
    gap: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    shadowColor: "#000",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingCard: {
    alignItems: "center",
    width: "100%",
  }
 })

export default WhisperIn