import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useKostData } from '../../hooks/useKostData';

export default function ExploreScreen() {
  const router = useRouter();
  const { kostList } = useKostData();
  const [selectedKos, setSelectedKos] = useState<any>(null);

  // Airmadidi roughly
  const UNKLAB_REGION = {
    latitude: 1.4173,
    longitude: 124.9829,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Peta Lokasi Kost</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={UNKLAB_REGION}
        showsUserLocation={true}
        onPress={() => setSelectedKos(null)} // Click elsewhere to dismiss
      >
        {kostList.map((kos) => (
          <Marker
            key={kos.id}
            coordinate={{
              latitude: kos.latitude!,
              longitude: kos.longitude!,
            }}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedKos(kos);
            }}
          >
            <View style={[
              styles.markerDot, 
              selectedKos?.id === kos.id && styles.markerDotActive
            ]}>
              <Ionicons 
                name="home" 
                size={16} 
                color="#ffffff" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Modern Floating Bottom Card */}
      {selectedKos && (
        <View style={styles.floatingCard}>
          <Image source={{ uri: selectedKos.imageUrl }} style={styles.cardCover} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{selectedKos.title}</Text>
            
            <View style={styles.cardRow}>
              <Ionicons name="location" size={12} color="#007AFF" />
              <Text style={styles.cardLocation} numberOfLines={1}>{selectedKos.location}</Text>
            </View>

            <View style={styles.cardPriceRow}>
              <Text style={styles.cardPrice}>{selectedKos.price}</Text>
              <Text style={styles.cardDuration}>/bln</Text>
            </View>

            <Pressable 
              style={styles.detailButton}
              onPress={() => router.push(`/kos/${selectedKos.id}` as any)}
            >
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 10,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D23',
    textAlign: 'center',
    marginTop: 10,
  },
  map: {
    width: '100%',
    flex: 1,
  },
  markerDot: {
    backgroundColor: '#ff4757',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  markerDotActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }],
    shadowColor: '#007AFF',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 30, // Above bottom tabs
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  cardCover: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1A1D23',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLocation: {
    color: '#8A95A5',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
    flex: 1,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  cardPrice: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cardDuration: {
    color: '#8A95A5',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  detailButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
