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
import { useHandleEdit } from "@/app/actions/useHandleEdit"
import * as FileSystem from 'expo-file-system';


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
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        console.log('Test API works:', data);
      } catch (err) {
        console.error('Test API failed:', err);
      }
    };
    testConnection();
  }, []);
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
                <View style={styles.recordingControls}>
                  {!isRecording ? (
                    <TouchableOpacity
                      style={styles.recordButton}
                      onPress={() => {
                        startRecording()
                        setIsRecording(true)
                      }}
                      disabled={isProcessing}
                    >
                      <View style={styles.recordButtonInner} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.controlsRow}>
                      <TouchableOpacity
                        style={[styles.controlButton, isPaused ? styles.playButton : styles.pauseButton]}
                        onPress={() => {
                          pauseRecording()
                          setIsPaused(!isPaused)
                        }}
                      >
                        <Ionicons name={isPaused ? "play" : "pause"} size={24} color="#FFFFFF" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.controlButton, styles.stopButton]}
                        onPress={() => {
                          stopRecording()
                          setIsRecording(false)
                          setIsPaused(false)
                          setView("preview")
                        }}
                      >
                        <Ionicons name="stop" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.recordingText}>
                  {isRecording ? (isPaused ? "Paused" : `Recording... ${recordingTime}s`) : "Tap to Start Recording"}
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
                <TouchableOpacity onPress={() => handleCopy(originalText, "original")}>
                  <Text style={styles.copyButton}>{copyStatus.original || "Copy"}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>{originalText}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>LinkedIn Optimized</Text>
                <TouchableOpacity onPress={() => handleCopy(optimizedText, "optimized")}>
                  <Text style={styles.copyButton}>{copyStatus.optimized || "Copy"}</Text>
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

            <TouchableOpacity style={styles.recordAgainButton} onPress={() => setView("record")}>
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
    backgroundColor: "#F3F2EF",
  },
  content: {
    flex: 1,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingControls: {
    alignItems: "center",
  },
  controlsRow: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#0A66C2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0077B5",
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: "#0077B5",
  },
  playButton: {
    backgroundColor: "#0A66C2",
  },
  stopButton: {
    backgroundColor: "#B74134",
  },
  recordingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  previewContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  copyButton: {
    color: "#0A66C2",
    fontSize: 14,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: "top",
    padding: 12,
    backgroundColor: "#F3F2EF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  recordAgainButton: {
    backgroundColor: "#0A66C2",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#0A66C2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordAgainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default WhisperIn