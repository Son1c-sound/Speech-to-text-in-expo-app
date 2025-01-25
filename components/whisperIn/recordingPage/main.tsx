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
              {!isRecording ? (
                <View style={styles.startRecordingContainer}>
                  <Ionicons name="mic-outline" size={32} color="#0A66C2" />
                  <Text style={styles.noRecordingText}>No recording yet</Text>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startRecording}
                    disabled={isProcessing}
                  >
                    <Ionicons name="radio-button-on" size={24} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.recordingContainer}>
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording {formatTime(recordingTime)}</Text>
                  </View>
                  <View style={styles.activeControls}>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={pauseRecording}
                    >
                      <Ionicons name={isPaused ? "play" : "pause"} size={24} color="#0A66C2" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={stopRecording}
                    >
                      <Ionicons name="stop" size={24} color="#0A66C2" />
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
    paddingHorizontal: 24,
  },
  startRecordingContainer: {
    alignItems: "center",
    gap: 16,
  },
  noRecordingText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 32,
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  recordingContainer: {
    alignItems: "center",
    gap: 32,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DC2626",
  },
  recordingText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  activeControls: {
    flexDirection: "row",
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0A66C2",
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