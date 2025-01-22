import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from '@expo/vector-icons'
import Loading from "../custom-components/Loading"
import { useHandleEdit } from "@/app/hooks/useHandleEdit"
import * as FileSystem from 'expo-file-system';
import Copy from "../history/copy"



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
            fileType: 'audio/m4a'
          })
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        setTranscriptionId(data.transcriptionId);
        setOriginalText(data.text);
        await handleOptimize(data.transcriptionId);
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
                    <Text style={styles.primaryButtonText}>Start Recording</Text>
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
        <ScrollView 
          style={styles.previewContainer}
          contentContainerStyle={styles.previewContent}
        >
          <View style={styles.previewCard}>
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={24} color="#6366F1" />
                <Text style={styles.sectionTitle}>Original Recording</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.transcribedText}>{originalText}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles-outline" size={24} color="#6366F1" />
                <Text style={styles.sectionTitle}>LinkedIn Optimized</Text>
                <View style={styles.copyContainer}>
                  <Copy text={optimizedText} id={transcriptionId} />
                </View>
              </View>
              <TextInput
                style={styles.optimizedInput}
                value={optimizedText}
                onChangeText={setOptimizedText}
                multiline
                placeholder="Your optimized content will appear here..."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.newRecordingButton}
            onPress={() => setView("record")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.newRecordingText}>New Recording</Text>
          </TouchableOpacity>
        </ScrollView>
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
  gradientHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  content: {
    flex: 1,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "space-between",
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
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  visualFeedback: {
    alignItems: "center",
    paddingTop: 20,
  },
  recordingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  recordingCircleActive: {
    backgroundColor: "#EFF6FF",
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  innerCircleActive: {
    borderColor: "#2563EB",
  },
  recordingTime: {
    fontSize: 48,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  recordingStatus: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "500",
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  activeControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pauseButton: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  stopButton: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  previewContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 20,
    gap: 20,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  textContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  transcribedText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#111827",
  },
  optimizedInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    fontSize: 16,
    lineHeight: 24,
    color: "#111827",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  copyContainer: {
    marginLeft: "auto",
  },
  newRecordingButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  newRecordingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
})

export default WhisperIn