import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native"
import * as Clipboard from "expo-clipboard"
import { Audio } from "expo-av"
import { useRouter } from "expo-router"
import { Ionicons } from '@expo/vector-icons'
import Loading from "./Loading"

interface CopyStatus {
  original: string
  optimized: string
}

const WhisperIn: React.FC = () => {
  const router = useRouter()
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

  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (optimizedText && transcriptionId) {
        try {
          const response = await fetch('https://linkedin-voice-backend.vercel.app/api/editText', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcriptionId,
              updatedText: optimizedText
            }),
          })

          const data = await response.json()
          if (!data.success) {
            console.error('Error saving:', data.error)
          }
        } catch (err) {
          console.error('Error auto-saving:', err)
        }
      }
    }, 500)

    return () => clearTimeout(saveTimeout)
  }, [optimizedText])

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
      const response = await fetch(audioUri)
      const blob = await response.blob()
      
      const file = new File([blob], 'audio.wav', { type: 'audio/wav' })
      
      const formData = new FormData()
      formData.append('audioData', file)
  
      const apiResponse = await fetch('https://linkedin-voice-backend.vercel.app/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })
  
      const data = await apiResponse.json()
      if (data.success) {
        setTranscriptionId(data.transcriptionId)
        setOriginalText(data.text)
        await handleOptimize(data.transcriptionId) // Wait for optimization to complete
      } else {
        console.error("Error sending data")
      }
    } catch (err) {
      console.error('Error:', err)
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
      await handleSpeechToText(uri) // Wait for the entire process to complete
    }
  } catch (err) {
    console.error('Error stopping recording:', err)
  } finally {
    setIsProcessing(false) // Only set to false after everything is done
  }
}

  const handleCopy = async (text: string, type: keyof CopyStatus): Promise<void> => {
    await Clipboard.setStringAsync(text)
    setCopyStatus({ ...copyStatus, [type]: 'Copied!' })
    setTimeout(() => setCopyStatus({ ...copyStatus, [type]: '' }), 2000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      {view === "record" && (
  <View style={styles.recordContainer}>
    {isProcessing ? (
      <Loading />
    ) : (
      <>
        <View style={styles.recordingControls}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={startRecording}
              disabled={isProcessing}
            >
              <View style={styles.recordButtonInner} />
            </TouchableOpacity>
          ) : (
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.controlButton, isPaused ? styles.playButton : styles.pauseButton]}
                onPress={pauseRecording}
              >
                <Ionicons 
                  name={isPaused ? "play" : "pause"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={stopRecording}
              >
                <Ionicons name="stop" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.recordingText}>
          {isRecording ? (isPaused ? "Paused" : `Recording... ${recordingTime}s`) : "Tap to Record"}
        </Text>
      </>
    )}
  </View>
)}

        {view === "preview" && (
          <ScrollView style={styles.previewContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Original Text</Text>
                <TouchableOpacity
                  onPress={() => handleCopy(originalText, "original")}
                >
                  <Text style={styles.copyButton}>
                    {copyStatus.original || "Copy"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>{originalText}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>LinkedIn Optimized</Text>
                <TouchableOpacity
                  onPress={() => handleCopy(optimizedText, "optimized")}
                >
                  <Text style={styles.copyButton}>
                    {copyStatus.optimized || "Copy"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.cardText, styles.textInput]}
                value={optimizedText}
                onChangeText={setOptimizedText}
                multiline
                placeholder="Optimized text will appear here"
              />
            </View>

            <TouchableOpacity style={styles.recordAgainButton}  onPress={() => setView("record")} >
              <Text style={styles.recordAgainButtonText}>Record Again</Text>
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
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  recordingControls: {
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563eb",
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  playButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  recordingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4b5563",
  },
  previewContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  copyButton: {
    color: "#3b82f6",
    fontSize: 14,
  },
  cardText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  textInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  recordAgainButton: {
    backgroundColor: '#2563EB',  
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recordAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default WhisperIn