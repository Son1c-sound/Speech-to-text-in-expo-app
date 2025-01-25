import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from '@expo/vector-icons'
import Loading from "../custom-components/Loading"
import { useHandleEdit } from "@/hooks/useHandleEdit"
import * as FileSystem from 'expo-file-system';
import { useAuth } from "@clerk/clerk-expo";
import OptimizedPreview from "./optimizedPreview"
import { usePostUserData } from "@/hooks/usePostUserData"
import Navbar from "../custom-components/navbar"


interface CopyStatus {
  original: string
  optimized: string
}

const WhisperIn: React.FC = () => {
  const [view, setView] = useState<'record' | 'preview'>('record')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [originalText, setOriginalText] = useState<string>('')
  const [optimizedText, setOptimizedText] = useState<string>('')
  const [transcriptionId, setTranscriptionId] = useState<string>('')
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ original: '', optimized: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [history, setHistory] = useState<any[]>([]) 
  const { handleEdit, setEditingItem, setEditedText } = useHandleEdit(history, setHistory)
  const { userId } = useAuth()
  const { postUserData } = usePostUserData()

  useEffect(() => {
    postUserData();
  }, []);

  useEffect(() => {
    if (!optimizedText || !transcriptionId) return;
  
    const timer = setTimeout(() => {
      const editItem = {
        _id: transcriptionId,
        optimizedText
      };
      
      setEditingItem(editItem);
      setEditedText(optimizedText);
      handleEdit();
    }, 500);
  
    return () => clearTimeout(timer);
  }, [optimizedText, transcriptionId, handleEdit]);

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
  };
 
  const handleOptimize = async (transcriptionId: string) => {
    try {
      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/optimizeSpeech', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptionId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setOptimizedText(data.optimizedText || '')
        setView('preview')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err: any) {
      console.error("Text optimization error:", err.message || err)
    }
  }

 
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
            <View style={styles.loadingContainer}>
              <View style={styles.loadingCard}>
                <Loading />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.visualFeedback}>
                <View style={[
                  styles.recordingCircle,
                  isRecording && styles.recordingCircleActive
                ]}>
                  <View style={[
                    styles.innerCircle,
                    isRecording && styles.innerCircleActive
                  ]}>
                    <Ionicons 
                      name={isPaused ? "pause" : "mic"} 
                      size={40} 
                      color={isRecording ? "#2563EB" : "#6B7280"} 
                    />
                  </View>
                </View>
                <Text style={styles.recordingTime}>
                  {isRecording ? formatTime(recordingTime) : "00:00"}
                </Text>
                <Text style={styles.recordingStatus}>
                  {isRecording 
                    ? (isPaused ? "Paused" : "Recording") 
                    : "Ready to Start"}
                </Text>
              </View>

              <View style={styles.controlsContainer}>
                {!isRecording ? (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={startRecording}
                    disabled={isProcessing}
                  >
                    <Text style={styles.primaryButtonText}>Start Recording   </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.activeControls}>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.pauseButton]}
                      onPress={pauseRecording}
                    >
                      <Ionicons 
                        name={isPaused ? "play" : "pause"} 
                        size={32} 
                        color="#6366F1" 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.controlButton, styles.stopButton]}
                      onPress={stopRecording}
                    >
                      <Ionicons name="stop" size={32} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      )}
        {view === "preview" && (
          <OptimizedPreview 
            setView={setView}
            originalText={originalText}
            optimizedText={optimizedText}
            setOptimizedText={setOptimizedText}
            transcriptionId={transcriptionId}
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
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  visualFeedback: {
    alignItems: "center",
    marginBottom: 60,
  },
  recordingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  recordingCircleActive: {
    backgroundColor: "#EFF6FF",
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  innerCircleActive: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },
  recordingTime: {
    fontSize: 42,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 1,
  },
  recordingStatus: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  activeControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  pauseButton: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  stopButton: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  }
});

export default WhisperIn