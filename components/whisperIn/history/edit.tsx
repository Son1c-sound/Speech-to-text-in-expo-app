import React, { useState, useEffect, useRef } from 'react'
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface EditModalProps {
  visible: boolean
  editingItem: any
  activeTab: 'twitter' | 'linkedin' | 'reddit'
  onChangeText: (optimizations: any) => void
  onClose: () => void
  onSave: () => void
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  editingItem,
  activeTab,
  onChangeText,
  onClose,
  onSave,
}) => {
  const insets = useSafeAreaInsets()
  const [localText, setLocalText] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const screenHeight = Dimensions.get('window').height

  useEffect(() => {
    if (editingItem?.optimizations) {
      setLocalText(editingItem.optimizations[activeTab] || '')
    }
  }, [editingItem, activeTab])

  const handleTextChange = (text: string) => {
    setLocalText(text)
    onChangeText({
      ...editingItem?.optimizations,
      [activeTab]: text,
    })
  }

  const handleSave = () => {
    onSave()
    onClose()
  }

  const modalHeight = screenHeight * 0.9

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <SafeAreaView
          style={[
            styles.content,
            {
              height: modalHeight,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Edit {activeTab} Post</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
          >
            <TextInput
              style={styles.input}
              value={localText}
              onChangeText={handleTextChange}
              multiline
              autoFocus
              textAlignVertical="top"
              placeholder={`Write your ${activeTab} post here...`}
              onContentSizeChange={() => {
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    minHeight: 200,
    flex: 1,
  },
})

export default EditModal