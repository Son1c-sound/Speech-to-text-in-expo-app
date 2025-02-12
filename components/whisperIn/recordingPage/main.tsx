import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system';
import { useAuth } from "@clerk/clerk-expo";
import OptimizedPreview from "./optimizedPreview"


interface OptimizationStatus {
  twitter: boolean;
  linkedin: boolean;
  reddit: boolean;
}

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
  const [optimizationStatus, setOptimizationStatus] = useState<OptimizationStatus>({twitter: false, linkedin: false,reddit: false })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const { userId } = useAuth()
  const [permissionResponse, setPermissionResponse] = useState<Audio.PermissionResponse | null>(null);
  const [permissionError, setPermissionError] = useState<string>('')

  // const { showPaywall, hasSubscription } = usePaywall({
  //   onSuccess: () => {
  //     initiateRecordingFlow()
  //   },
  //   onError: (error) => {
  //     setPermissionError(error)
  //     setTimeout(() => setPermissionError(''), 3000)
  //   }
  // })


  // const handleNewRecording = async () => {
  //   if (!hasSubscription) {
  //     await showPaywall()
  //   } else {
  //     await initiateRecording()
  //   }
  // }

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        console.log('[AUDIO] Starting audio initialization');
        const permission = await Audio.requestPermissionsAsync();
        console.log('[AUDIO] Permission result:', permission);
        setPermissionResponse(permission);
        
        if (permission.status !== 'granted') {
          setPermissionError('Microphone permission is required to record audio');
          return;
        }
  
        console.log('[AUDIO] Setting audio mode');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,       
          playsInSilentModeIOS: true,
          staysActiveInBackground: false, 
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
  
      } catch (error) {
        console.error('[AUDIO] Error initializing audio:', error);
        setPermissionError('Failed to initialize audio. Please check your device settings.');
      }
    };
  
    initializeAudio();
  }, []);

  const initiateRecordingFlow = async (): Promise<void> => {
    if (!permissionResponse || permissionResponse.status !== 'granted') {
      const permission = await Audio.requestPermissionsAsync();
      setPermissionResponse(permission);
      
      if (permission.status !== 'granted') {
        setPermissionError('Microphone permission is required to record audio');
        return;
      }
    }

    try {
      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        }
      });
      
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
      setPermissionError('Failed to start recording. Please check your device settings.');
    }
  };

  const initiateRecording = async (): Promise<void> => {
    await initiateRecordingFlow()
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
      setIsOptimizing(true);
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
        if (data.optimizations) {
          setOptimizations(data.optimizations);
          setOptimizationStatus(prevStatus => ({
            ...prevStatus,
            ...(data.optimizations.twitter && { twitter: true }),
            ...(data.optimizations.linkedin && { linkedin: true }),
            ...(data.optimizations.reddit && { reddit: true })
          }));
        }
        setView('preview');
  
        const checkResults = async () => {
          const pollResponse = await fetch('https://linkedin-voice-backend.vercel.app/api/optimizeSpeech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcriptionId }),
          });
          
          const pollData = await pollResponse.json();
          if (pollData.success && pollData.optimizations) {
            setOptimizations(prevOptimizations => ({
              ...prevOptimizations,
              ...pollData.optimizations
            }));
            
            setOptimizationStatus(prevStatus => ({
              ...prevStatus,
              ...(pollData.optimizations.twitter && { twitter: true }),
              ...(pollData.optimizations.linkedin && { linkedin: true }),
              ...(pollData.optimizations.reddit && { reddit: true })
            }));
            
            if (pollData.optimizations.twitter && 
                pollData.optimizations.linkedin && 
                pollData.optimizations.reddit) {
              setIsOptimizing(false);
              return;
            }
            setTimeout(checkResults, 3000);
          }
        };
  
        setTimeout(checkResults, 3000);
      }
    } catch (err: any) {
      console.error("Text optimization error:", err.message || err);
      setIsOptimizing(false);
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (!recording) return

    setIsRecording(false)
    setIsPaused(false)
    setIsProcessing(true)
    setIsOptimizing(true)
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

  if (permissionError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={32} color="#ff4444" />
          <Text style={styles.errorText}>{permissionError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={async () => {
              setPermissionError('');
              const permission = await Audio.requestPermissionsAsync();
              setPermissionResponse(permission);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {isLoading && <LoadingOverlay message={loadingMessage} />}
          {view === "record" && (
            <View style={styles.recordContainer}>
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
                    // onPress={handleNewRecording}
                  >
                    <Text style={styles.buttonText}>
                      {"+ New Recording"}
                    </Text>
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
            </View>
          )}
          {isOptimizing ? (
            <View style={styles.optimizingOverlay}>
              <ActivityIndicator size="large" color="#0A66C2" />
              <Text style={styles.optimizingText}>
                Crafting your perfect social media posts 
              </Text>
              <Text style={styles.optimizingSubText}>
                Quick Tip: The longer the speech, the easier and faster to generate 📱
              </Text>
            </View>
          ) : null}
          {view === "preview" && (
            <OptimizedPreview 
              setView={setView}
              originalText={originalText}
              optimizedText={optimizations}
              setOptimizedText={setOptimizations}
              transcriptionId={transcriptionId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOptimizing={isOptimizing}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

const LoadingOverlay = ({ message }: { message: string }) => (
  <View style={styles.optimizingOverlay}>
    <ActivityIndicator size="large" color="#0A66C2" />
    <Text style={styles.optimizingText}>
      {message}
    </Text>
    <Text style={styles.optimizingSubText}>
      This usually takes 3-5 seconds. Feel free to minimize the app - we'll keep working! 🚀
    </Text>
  </View>
)

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optimizingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  optimizingText: {
    fontSize: 20,
    color: '#000000',
    marginTop: 24,
    marginBottom: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  optimizationProgress: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  platformStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  platformText: {
    fontSize: 16,
    color: '#000000',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: -22,
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
  optimizingSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '80%',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginTop: 16,
    textAlign: 'center',
  },
  celebrationSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
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