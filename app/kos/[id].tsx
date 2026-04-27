import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Platform, Linking, StatusBar } from 'react-native';
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

  const handleContactOwner = () => {
    router.push(`/chat/${kos.id}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Parallax Image Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: kos.imageUrl }} style={styles.image} />
          {/* Top Gradient/Shadow usually handled by ImageBackground but simplified here */}
          
          <View style={styles.headerButtons}>
            <Pressable style={styles.circleButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#2f3542" />
            </Pressable>
            <Pressable style={styles.circleButton} onPress={() => toggleFavorite(kos.id)}>
              <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={28} color={favorite ? '#ff4757' : '#2f3542'} />
            </Pressable>
          </View>
        </View>

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
          
          <Text style={styles.sectionTitle}>Review & Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {kos.description || 'Kost nyaman dengan lingkungan tenang, cocok untuk mahasiswa maupun pekerja profesional. Lokasi strategis dekat pusat kota.'}
          </Text>

          {/* Room Availability */}
          {kos.availableRooms != null && (
            <View style={styles.roomAvailSection}>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Ketersediaan Kamar</Text>
              <View style={styles.roomAvailRow}>
                <View style={styles.roomAvailItem}>
                  <Text style={styles.roomAvailNumber}>{kos.availableRooms}</Text>
                  <Text style={styles.roomAvailLabel}>Kosong</Text>
                </View>
                <View style={styles.roomAvailDivider} />
                <View style={styles.roomAvailItem}>
                  <Text style={styles.roomAvailNumber}>{(kos.totalRooms ?? 0) - (kos.availableRooms ?? 0)}</Text>
                  <Text style={styles.roomAvailLabel}>Terisi</Text>
                </View>
                <View style={styles.roomAvailDivider} />
                <View style={styles.roomAvailItem}>
                  <Text style={styles.roomAvailNumber}>{kos.totalRooms ?? 0}</Text>
                  <Text style={styles.roomAvailLabel}>Total</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Spacer for bottom action bar */}
          <View style={{height: 120}} />
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <View style={styles.bottomPriceContainer}>
            <Text style={styles.bottomPriceLabel}>Total Harga</Text>
            <Text style={styles.bottomPrice}>{kos.price}</Text>
          </View>
          <Pressable style={styles.contactButton} onPress={handleContactOwner}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#ffffff" style={styles.contactIcon} />
            <Text style={styles.contactButtonText}>Hubungi</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F9FF',
  },
  errorText: {
    fontSize: 18,
    color: '#1A1D23',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
    backgroundColor: '#dfe4ea',
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  contentContainer: {
    padding: 24,
    marginTop: -32,
    backgroundColor: '#F4F9FF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D23',
    marginRight: 10,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  typeBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1D23',
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 15,
    color: '#8A95A5',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#007AFF',
  },
  duration: {
    fontSize: 16,
    color: '#8A95A5',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,122,255,0.06)',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  facilityItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '21%',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.03)',
  },
  facilityIconContainer: {
    width: 46,
    height: 46,
    backgroundColor: '#E8F4FD',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  facilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1D23',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#717D8A',
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 13,
    color: '#8A95A5',
    marginBottom: 4,
    fontWeight: '600',
  },
  bottomPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D23',
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  roomAvailSection: {
    marginTop: 4,
  },
  roomAvailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  roomAvailItem: {
    alignItems: 'center',
  },
  roomAvailNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007AFF',
    marginBottom: 4,
  },
  roomAvailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A95A5',
  },
  roomAvailDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
});
