import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Dimensions, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Plus, RotateCcw, Save, ArrowLeft, CreditCard as Edit3, X } from 'lucide-react-native';
import { Session } from '@/types/session';
import { sessionStorage } from '@/utils/sessionStorage';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function CounterScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    if (!sessionId) {
      Alert.alert('Error', 'No session ID provided');
      router.back();
      return;
    }

    try {
      const loadedSession = await sessionStorage.getSession(sessionId);
      if (!loadedSession) {
        Alert.alert('Error', 'Session not found');
        router.back();
        return;
      }
      setSession(loadedSession);
      setEditName(loadedSession.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to load session');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (updatedSession: Session) => {
    try {
      await sessionStorage.saveSession(updatedSession);
      setSession(updatedSession);
    } catch (error) {
      Alert.alert('Error', 'Failed to save session');
    }
  };

  const incrementCount = () => {
    if (!session) return;
    const updatedSession = { ...session, count: session.count + 1 };
    saveSession(updatedSession);
  };

  const resetCount = () => {
    if (!session) return;
    Alert.alert(
      'Reset Counter',
      'Are you sure you want to reset the counter to 0?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const updatedSession = { ...session, count: 0 };
            saveSession(updatedSession);
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    if (!session) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedSession = { ...session, image: result.assets[0].uri };
      saveSession(updatedSession);
    }
  };

  const updateSessionName = async () => {
    if (!session || !editName.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    const updatedSession = { ...session, name: editName.trim() };
    await saveSession(updatedSession);
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageSize = {
    width: isTablet ? Math.min(width * 0.6, 500) : width * 0.85,
    height: isTablet ? Math.min(width * 0.45, 375) : width * 0.64,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.sessionTitle} numberOfLines={1}>
            {session.name}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit3 size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.content, isTablet && styles.tabletContent]}>
        <TouchableOpacity style={styles.browseButton} onPress={pickImage}>
          <Upload size={20} color="#3b82f6" />
          <Text style={styles.browseButtonText}>Browse Image</Text>
        </TouchableOpacity>

        {session.image && (
          <View style={[styles.imageContainer, imageSize]}>
            <Image source={{ uri: session.image }} style={styles.image} />
          </View>
        )}

        <View style={[styles.display, isTablet && styles.tabletDisplay]}>
          <Text style={[styles.counterText, isTablet && styles.tabletCounterText]}>
            {session.count}
          </Text>
        </View>

        <View style={[styles.buttonContainer, isTablet && styles.tabletButtonContainer]}>
          <TouchableOpacity style={[styles.countButton, isTablet && styles.tabletButton]} onPress={incrementCount}>
            <Plus size={isTablet ? 28 : 24} color="#ffffff" />
            <Text style={[styles.countButtonText, isTablet && styles.tabletButtonText]}>Count +</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.resetButton, isTablet && styles.tabletButton]} onPress={resetCount}>
            <RotateCcw size={isTablet ? 24 : 20} color="#6b7280" />
            <Text style={[styles.resetButtonText, isTablet && styles.tabletButtonText]}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Session Name</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter session name"
              value={editName}
              onChangeText={setEditName}
              autoFocus
              maxLength={50}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={updateSessionName}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabletContent: {
    paddingHorizontal: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: isTablet ? 28 : 20,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  browseButtonText: {
    marginLeft: 8,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    color: '#3b82f6',
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  display: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginBottom: 40,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  tabletDisplay: {
    paddingHorizontal: 60,
    paddingVertical: 40,
    minWidth: 300,
  },
  counterText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  tabletCounterText: {
    fontSize: 64,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  tabletButtonContainer: {
    maxWidth: 400,
    gap: 20,
  },
  countButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabletButton: {
    paddingVertical: 22,
    paddingHorizontal: 40,
  },
  countButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  tabletButtonText: {
    fontSize: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});