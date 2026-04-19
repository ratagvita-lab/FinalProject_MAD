import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Platform, Linking, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockKosList } from '../../constants/mockData';
import { useFavorites } from '../../hooks/useFavorites';

export default function KosDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const kos = mockKosList.find(k => k.id === id);

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
    if (Platform.OS !== 'web') {
      Linking.openURL(`whatsapp://send?phone=+6281234567890&text=Halo,%20saya%20tertarik%20dengan%20${kos.title}`);
    } else {
      window.open(`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${kos.title}`, '_blank');
    }
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
            <Ionicons name="location" size={20} color="#1e90ff" />
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
                    color="#1e90ff" 
                  />
                </View>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Review & Deskripsi</Text>
          <Text style={styles.descriptionText}>
            Kost eksklusif yang sangat nyaman dengan lingkungan tenang, sangat cocok untuk mahasiswa maupun pekerja profesional. Lokasi strategis hanya 5 menit dari kampus dan dekat dengan pusat perbelanjaan, minimarket, serta fasilitas umum lainnya. Desain modern minimalis memberikan kenyamanan ekstra.
          </Text>
          
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
    backgroundColor: '#f1f6f9',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#2f3542',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1e90ff',
    borderRadius: 12,
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
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    padding: 24,
    marginTop: -30,
    backgroundColor: '#f1f6f9',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: '#2f3542',
    marginRight: 10,
    lineHeight: 32,
  },
  typeBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2f3542',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 15,
    color: '#747d8c',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e90ff',
  },
  duration: {
    fontSize: 16,
    color: '#747d8c',
    fontWeight: '600',
  },
  divider: {
    height: 2,
    backgroundColor: '#e6eaef',
    marginVertical: 24,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 20,
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
    borderRadius: 16,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#e6f2ff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2f3542',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#57606f',
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 13,
    color: '#747d8c',
    marginBottom: 4,
    fontWeight: '600',
  },
  bottomPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2f3542',
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#1e90ff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
