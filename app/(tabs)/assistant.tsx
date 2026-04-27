import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AssistantScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Assistant 🤖</Text>
          <Text style={styles.subtitle}>Biar AI kami yang mencarikan untukmu.</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.robotContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500&q=80' }} 
              style={styles.robotImage}
            />
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>Hai Amanda! Butuh rekomendasi kost putri yang dekat dengan mikrolet?</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)')}>
            <Ionicons name="sparkles" size={20} color="#ffffff" style={{marginRight: 8}} />
            <Text style={styles.primaryButtonText}>Cari Rekomendasi</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.secondaryButtonText}>Nanti Saja</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8A95A5',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  robotContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  robotImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8F4FD',
    marginBottom: -20,
    borderWidth: 6,
    borderColor: '#ffffff',
    zIndex: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  chatBubble: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    borderTopLeftRadius: 0,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginLeft: 40,
    marginTop: -20,
    maxWidth: '85%',
  },
  chatText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1A1D23',
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#8A95A5',
    fontSize: 16,
    fontWeight: '700',
  },
});
