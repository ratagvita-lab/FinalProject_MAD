import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="home" size={32} color="#1e90ff" />
          </View>
          <Text style={styles.brandName}>SmartKost</Text>
        </View>

        {/* Illustration Placeholder - We'll use a clean icon combination since we might not have custom illustration assets */}
        <View style={styles.illustrationContainer}>
          <View style={styles.circleBig}>
            <Ionicons name="map" size={80} color="#1e90ff" />
            <View style={styles.pinBadge}>
              <Ionicons name="location" size={24} color="#ff4757" />
            </View>
          </View>
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Temukan Kost Idamanmu</Text>
          <Text style={styles.titleHL}>dengan Cepat & Mudah</Text>
          <Text style={styles.subtitle}>
            Cari, bandingkan, dan temukan kost yang paling sesuai dengan kebutuhanmu, semua dalam satu aplikasi.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.primaryButtonText}>Cari Kost Sekarang</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
          </Pressable>

          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.secondaryButtonText}>Lihat Rekomendasi</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f6f9', // Soft blue/white background
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2f3542',
    letterSpacing: -0.5,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBig: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#e6f2ff',
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  pinBadge: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2f3542',
    textAlign: 'center',
  },
  titleHL: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e90ff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#747d8c',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#1e90ff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#dfe4ea',
  },
  secondaryButtonText: {
    color: '#747d8c',
    fontSize: 18,
    fontWeight: '700',
  },
});
