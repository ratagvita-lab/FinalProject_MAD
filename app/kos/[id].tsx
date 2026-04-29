import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../hooks/useFavorites';
import { useKostData } from '../../hooks/useKostData';

export default function KosDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getKostById } = useKostData();

  const kos = getKostById(id);

  if (!kos) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data Kost tidak ditemukan</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(kos.id);

  // ✅ INI PENTING (NGE-OPEN CHAT AI)
  const handleContactOwner = () => {
    router.push(`/chat/${kos.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: kos.imageUrl }} style={styles.image} />

          <View style={styles.headerButtons}>
            <Pressable style={styles.circleButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#2f3542" />
            </Pressable>

            <Pressable style={styles.circleButton} onPress={() => toggleFavorite(kos.id)}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={28}
                color={favorite ? '#ff4757' : '#2f3542'}
              />
            </Pressable>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{kos.title}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{kos.type}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.locationText}>{kos.location}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{kos.price}</Text>
            <Text style={styles.duration}> / bulan</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Fasilitas Kost</Text>
          <View style={styles.facilitiesContainer}>
            {kos.facilities.map((facility, index) => (
              <View key={index} style={styles.facilityItem}>
                <View style={styles.facilityIconContainer}>
                  <Ionicons
                    name={
                      facility === 'WiFi' ? 'wifi' :
                        facility === 'AC' ? 'snow' :
                          facility === 'Kamar mandi dalam' ? 'water' :
                            facility === 'Parkir Luas' ? 'car' : 'home'
                    }
                    size={22}
                    color="#007AFF"
                  />
                </View>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {kos.description || 'Kost nyaman dan strategis dekat kampus.'}
          </Text>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* ✅ BOTTOM BAR */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>

          <View style={styles.bottomPriceContainer}>
            <Text style={styles.bottomPriceLabel}>Total Harga</Text>
            <Text style={styles.bottomPrice}>{kos.price}</Text>
          </View>

          <Pressable
            style={styles.contactButton}
            onPress={handleContactOwner}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#ffffff" />
            <Text style={styles.contactButtonText}>Hubungi</Text>
          </Pressable>

        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },

  scrollContent: { paddingBottom: 20 },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  errorText: { fontSize: 18, marginBottom: 20 },

  backButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 10 },

  backButtonText: { color: '#fff' },

  imageContainer: { height: 300 },

  image: { width: '100%', height: '100%' },

  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  circleButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50
  },

  contentContainer: { padding: 20 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },

  title: { fontSize: 24, fontWeight: 'bold' },

  typeBadge: { backgroundColor: '#eee', padding: 6, borderRadius: 10 },

  typeText: { fontWeight: 'bold' },

  locationContainer: { flexDirection: 'row', marginTop: 10 },

  locationText: { marginLeft: 5 },

  priceContainer: { flexDirection: 'row', marginTop: 10 },

  price: { fontSize: 20, color: '#007AFF' },

  duration: { marginLeft: 5 },

  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold' },

  facilitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },

  facilityItem: { width: '30%', margin: 5, alignItems: 'center' },

  facilityIconContainer: {
    backgroundColor: '#E8F4FD',
    padding: 10,
    borderRadius: 50
  },

  facilityText: { marginTop: 5 },

  descriptionText: { marginTop: 10 },

  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20
  },

  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center'
  },

  bottomPriceContainer: { flex: 1 },

  bottomPriceLabel: { fontSize: 12 },

  bottomPrice: { fontSize: 18, fontWeight: 'bold' },

  contactButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },

  contactButtonText: {
    color: '#fff',
    marginLeft: 5
  }
});