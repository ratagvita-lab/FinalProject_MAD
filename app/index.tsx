import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStart = () => {
    // Navigate strictly to login page
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Large modern house image at sunset */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200' }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Soft overlay gradient equivalent (using views) */}
        <View style={styles.gradientOverlayTop} />
        <View style={styles.gradientOverlayBottom} />
      </View>

      {/* Glassmorphic content area */}
      <View style={styles.contentContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoLogo}>🏠</Text>
        </View>
        <Text style={styles.brandName}>SmartKost</Text>
        <Text style={styles.subtitle}></Text>

        <Text style={styles.tagline}>
          Cari kost jadi mudah, cepat, dan sesuai kebutuhanmu.
        </Text>

        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Mulai Sekarang</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  imageContainer: {
    width: width,
    height: height * 0.65,
    position: 'absolute',
    top: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 300,
    backgroundColor: 'rgba(244, 249, 255, 0.95)', // Fades into the safe area
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 20,
    alignItems: 'center',
  },
  logoBadge: {
    width: 64,
    height: 64,
    backgroundColor: '#E8F4FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoLogo: {
    fontSize: 32,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1D23',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 16,
    color: '#8A95A5',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,122,255,0.2)',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
