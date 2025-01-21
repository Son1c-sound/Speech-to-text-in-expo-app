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
import * as Clipboard from "expo-clipboard"
import { Audio } from "expo-av"
import { Ionicons } from '@expo/vector-icons'
import Loading from "./Loading"
import { useHandleEdit } from "@/app/hooks/useHandleEdit"
import * as FileSystem from 'expo-file-system';
import Copy from "./history/copy"



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
                <View style={styles.recordingStatus}>
                  <View style={styles.statusBadge}>
                    <Ionicons 
                      name={isRecording ? (isPaused ? "pause-circle" : "radio") : "mic"} 
                      size={20} 
                      color={isRecording ? "#059669" : "#6B7280"} 
                    />
                    <Text style={[
                      styles.statusText,
                      isRecording && styles.activeStatusText
                    ]}>
                      {isRecording 
                        ? (isPaused 
                          ? "Recording Paused" 
                          : `Recording in Progress ${recordingTime}s`)
                        : "Ready to Record"
                      }
                    </Text>
                  </View>
                </View>

                <View style={styles.recordingControls}>
                  {!isRecording ? (
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={startRecording}
                      disabled={isProcessing}
                    >
                      <Ionicons name="mic" size={24} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Start Recording</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.activeControls}>
                      <TouchableOpacity
                        style={styles.controlButton}
                        onPress={pauseRecording}
                      >
                        <Ionicons 
                          name={isPaused ? "play" : "pause"} 
                          size={24} 
                          color="#374151" 
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.controlButton, styles.stopButton]}
                        onPress={stopRecording}
                      >
                        <Ionicons name="stop" size={24} color="#DC2626" />
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
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.badgeText}>Original Text</Text>
                </View>
              </View>
              <Text style={styles.cardText}>{originalText}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Ionicons name="sparkles-outline" size={16} color="#059669" />
                  <Text style={[styles.badgeText, styles.optimizedBadge]}>
                    LinkedIn Optimized
                  </Text>
                </View>
                <Copy text={optimizedText} id={transcriptionId} />
              </View>
              <TextInput
                style={styles.optimizedInput}
                value={optimizedText}
                onChangeText={setOptimizedText}
                multiline
                placeholder="Optimized text will appear here"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setView("record")}
            >
              <Ionicons name="mic-outline" size={20} color="#2563EB" />
              <Text style={styles.secondaryButtonText}>Record New</Text>
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
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  recordingStatus: {
    marginBottom: 40,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeStatusText: {
    color: '#059669',
  },
  recordingControls: {
    alignItems: "center",
    gap: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stopButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FEE2E2',
  },
  previewContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  optimizedBadge: {
    color: '#059669',
  },
  cardText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  optimizedInput: {
    minHeight: 120,
    fontSize: 15,
    lineHeight: 22,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
   
  },
})

export default WhisperIn