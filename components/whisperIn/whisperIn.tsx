import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Audio } from "expo-av";

interface HistoryItem {
  id: string;
  original: string;
  optimized: string;
  date: string;
}

interface CopyStatus {
  original: string;
  optimized: string;
}

const WhisperIn: React.FC = () => {
  const [view, setView] = useState<'record' | 'preview' | 'history'>('record');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [optimizedText, setOptimizedText] = useState<string>('');
  const [transcriptionId, setTranscriptionId] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ original: '', optimized: '' });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const startRecording = async (): Promise<void> => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleSpeechToText = async (audioUri: string): Promise<void> => {
    try {
      const response = await fetch(audioUri);
      const blob = await response.blob();
      
      const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
      
      const formData = new FormData();
      formData.append('audioData', file);
  
      console.log("Sending file:", file);
  
      const apiResponse = await fetch('https://linkedin-voice-backend.vercel.app/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });
  
      const data = await apiResponse.json();
      if (data.success) {
        setTranscriptionId(data.transcriptionId);
        setOriginalText(data.text);
        handleOptimize(data.transcriptionId);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  
  

  const handleOptimize = async (id: string): Promise<void> => {
    try {
      const response = await fetch('https://linkedin-voice-backend.vercel.app/api/optimizeSpeech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptionId: id }),
      });

      const data = await response.json();
      if (data.success) {
        setOptimizedText(data.optimizedText);
        setView('preview');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      await handleSpeechToText(uri);
    }
  };

  const handleCopy = async (text: string, type: keyof CopyStatus): Promise<void> => {
    await Clipboard.setStringAsync(text);
    setCopyStatus({ ...copyStatus, [type]: 'Copied!' });
    setTimeout(() => setCopyStatus({ ...copyStatus, [type]: '' }), 2000);
  };

  const handleSave = async (): Promise<void> => {
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
      });

      const data = await response.json();
      if (data.success) {
        const newPost: HistoryItem = {
          id: transcriptionId,
          original: originalText,
          optimized: optimizedText,
          date: new Date().toISOString().split('T')[0]
        };
        setHistory([newPost, ...history]);
        setView('record');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhisperIn</Text>
        <TouchableOpacity
          onPress={() => setView(view === "history" ? "record" : "history")}
        >
          <Text style={styles.headerButton}>
            {view === "history" ? "Record" : "History"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {view === "record" && (
          <View style={styles.recordContainer}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View
                style={[
                  styles.recordButtonInner,
                  isRecording && styles.recordingButtonInner,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.recordingText}>
              {isRecording ? "Recording..." : "Tap to Record"}
            </Text>
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
              <Text style={styles.cardText}>{optimizedText}</Text>
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save to History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#3b82f6" }]} 
              onPress={() => setView("record")}
            >
              <Text style={styles.saveButtonText}>Record Again</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {view === "history" && (
          <ScrollView style={styles.historyContainer}>
            {history.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.cardText}>{item.optimized}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerButton: {
    color: "#3b82f6",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  recordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  recordingButton: {
    backgroundColor: "#ef4444",
  },
  recordingButtonInner: {
    backgroundColor: "#dc2626",
  },
  recordingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4b5563",
  },
  previewContainer: {
    padding: 16,
  },
  historyContainer: {
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
  dateText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default WhisperIn;