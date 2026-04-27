import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import KosCard from '../../components/KosCard';
import FilterModal, { FilterOptions } from '../../components/FilterModal';
import { useFavorites } from '../../hooks/useFavorites';
import { useKostData } from '../../hooks/useKostData';
import { useAuth } from '../../hooks/useAuth';

// Haversine distance calculation (km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fixed user location (Airmadidi - Unklab area)
const USER_LAT = 1.417;
const USER_LNG = 124.987;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    facilities: [],
    type: null,
    maxPrice: 5000000
  });

  const { toggleFavorite, isFavorite } = useFavorites();
  const { kostList } = useKostData();
  const { username, logout } = useAuth();
  const router = useRouter();

  const filteredKos = kostList.filter(kos => {
    if (searchQuery && !kos.location.toLowerCase().includes(searchQuery.toLowerCase()) && !kos.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.type && kos.type !== filters.type) { return false; }
    const numericPrice = parseInt(kos.price.replace(/[^0-9]/g, ''));
    if (numericPrice > filters.maxPrice) { return false; }
    if (filters.facilities.length > 0) {
      const hasAllFacilities = filters.facilities.every(f => kos.facilities.includes(f));
      if (!hasAllFacilities) { return false; }
    }
    return true;
  });

  // Sort by distance (nearest first)
  const sortedByDistance = [...filteredKos].sort((a, b) => {
    const distA = getDistanceKm(USER_LAT, USER_LNG, a.latitude ?? 0, a.longitude ?? 0);
    const distB = getDistanceKm(USER_LAT, USER_LNG, b.latitude ?? 0, b.longitude ?? 0);
    return distA - distB;
  });

  const recommendations = sortedByDistance.slice(0, 3);
  const nearby = sortedByDistance.slice(3);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hai, Amanda 👋</Text>
              <Text style={styles.subtitle}>Temukan kost terbaik untukmu hari ini!</Text>
            </View>
            <View style={styles.headerRight}>
              <Pressable style={styles.profileBadge} onPress={() => router.push('/(tabs)/profile')}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}} style={{width: '100%', height: '100%', borderRadius: 24}} />
              </Pressable>
              
              <Pressable style={styles.logoutButtonTop} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color="#FF4757" />
                <Text style={styles.logoutTextTop}>Keluar</Text>
              </Pressable>
            </View>
          </View>

          {/* Search & Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#747d8c" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari kost di sini..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#a4b0be"
              />
            </View>
            <Pressable style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="filter" size={24} color="#ffffff" />
            </Pressable>
          </View>

          {/* Conditional Rendering for Live Search */}
          {searchQuery === '' ? (
            <>
              {/* Rekomendasi Section */}
              <View style={styles.heroSection}>
                <Text style={styles.sectionTitle}>Rekomendasi untukmu ✨</Text>
                <View style={styles.heroCard}>
                  <View style={styles.heroTextContent}>
                    <Text style={styles.heroTitle}>Kost Ter-Hits di 2026!</Text>
                    <Text style={styles.heroSubtitle}>Tempat nyaman dengan fasilitas super lengkap.</Text>
                    <Pressable style={styles.heroButton} onPress={() => {}}>
                      <Text style={styles.heroButtonText}>Lihat Rekomendasi</Text>
                    </Pressable>
                  </View>
                  <Image 
                    source={{uri: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600'}} 
                    style={styles.heroImage} 
                  />
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kost Terdekat</Text>
                <Pressable><Text style={styles.seeAllText}>Lihat Semua</Text></Pressable>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={recommendations}
                keyExtractor={(item) => 'rec-' + item.id}
                contentContainerStyle={styles.horizontalListContainer}
                renderItem={({ item }) => {
                  const dist = getDistanceKm(USER_LAT, USER_LNG, item.latitude ?? 0, item.longitude ?? 0);
                  return (
                    <View style={{ width: 280, marginRight: 16 }}>
                      <KosCard
                        kos={{ ...item, isFavorite: isFavorite(item.id) }}
                        onToggleFavorite={toggleFavorite}
                      />
                      <View style={styles.distanceBadge}>
                        <Ionicons name="navigate" size={12} color="#007AFF" />
                        <Text style={styles.distanceText}>{dist.toFixed(1)} km</Text>
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <Text style={{ paddingHorizontal: 24, color: '#8A95A5' }}>Belum ada rekomendasi.</Text>
                }
              />

              {/* Kost Terdekat Section */}
              <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>Pilihan Lainnya</Text>
              </View>
              {nearby.length > 0 ? nearby.map(item => {
                return (
                  <View key={'nearby-' + item.id} style={{ paddingHorizontal: 24, marginBottom: 16 }}>
                    <KosCard
                      kos={{ ...item, isFavorite: isFavorite(item.id) }}
                      onToggleFavorite={toggleFavorite}
                    />
                  </View>
                );
              }) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={60} color="#dfe4ea" />
                  <Text style={styles.emptyText}>Tidak ada kost yang sesuai kriteria.</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Hasil Pencarian Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hasil Pencarian</Text>
              </View>
              {sortedByDistance.length > 0 ? sortedByDistance.map(item => {
                return (
                  <View key={'search-' + item.id} style={{ paddingHorizontal: 24, marginBottom: 16 }}>
                    <KosCard
                      kos={{ ...item, isFavorite: isFavorite(item.id) }}
                      onToggleFavorite={toggleFavorite}
                    />
                  </View>
                );
              }) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={60} color="#dfe4ea" />
                  <Text style={styles.emptyText}>"{searchQuery}" tidak ditemukan.</Text>
                </View>
              )}
            </>
          )}

        </ScrollView>
        
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={setFilters}
          initialFilters={filters}
        />
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 28,
  },
  greeting: {
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
  profileBadge: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  logoutButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  logoutTextTop: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF4757',
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 16,
    zIndex: 2,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 13,
  },
  heroImage: {
    width: 140,
    height: 140,
    position: 'absolute',
    right: -20,
    bottom: -20,
    borderRadius: 70,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 36,
    paddingHorizontal: 24,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 15,
    color: '#1A1D23',
    fontWeight: '500',
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  filterActiveBadge: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  filterActiveText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1D23',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  horizontalListContainer: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 28,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginHorizontal: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#747d8c',
  },
});
