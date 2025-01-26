import React, { useState, useEffect } from 'react'
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

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
  const [localText, setLocalText] = useState('')

  useEffect(() => {
    if (editingItem?.optimizations) {
      setLocalText(editingItem.optimizations[activeTab] || '')
    }
  }, [editingItem, activeTab])

  const handleTextChange = (text: string) => {
    setLocalText(text)
    onChangeText({
      ...editingItem?.optimizations,
      [activeTab]: text
    })
  }

  const handleSave = () => {
    onSave()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit {activeTab} Post</Text>
          <TextInput
            style={styles.input}
            value={localText}
            onChangeText={handleTextChange}
            multiline
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    gap: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  saveButtonText: {
    color: '#fff',
  },
})

export default EditModal