import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KosCard from '../../components/KosCard';
import { mockKosList } from '../../constants/mockData';
import { useFavorites } from '../../hooks/useFavorites';

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

const USER_LAT = 1.417;
const USER_LNG = 124.987;

export default function SearchScreen() {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Pending State (UI level, not yet applied)
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingType, setPendingType] = useState('Semua');
  const [pendingPrice, setPendingPrice] = useState('Semua');
  const [pendingDistance, setPendingDistance] = useState('Semua');
  const [pendingFacilities, setPendingFacilities] = useState<string[]>([]);
  
  // Applied State (Triggers result recalculation)
  const [appliedType, setAppliedType] = useState('Semua');
  const [appliedPrice, setAppliedPrice] = useState('Semua');
  const [appliedDistance, setAppliedDistance] = useState('Semua');
  const [appliedFacilities, setAppliedFacilities] = useState<string[]>([]);
  const [hasApplied, setHasApplied] = useState(false);

  const typeChips = ['Semua', 'Putra', 'Putri', 'Campur'];

  const priceChips = ['Semua', '< Rp 1jt', 'Rp 1jt–1.5jt', '> Rp 1.5jt'];
  const distanceChips = ['Semua', '1 KM', '3 KM', '5 KM'];
  
  const facilitiesData = [
    { id: 'WiFi', icon: 'wifi', label: 'WiFi' },
    { id: 'AC', icon: 'snow', label: 'AC' },
    { id: 'Kamar mandi dalam', icon: 'water', label: 'KM Dalam' },
    { id: 'Parkir Luas', icon: 'car', label: 'Parkir' },
    { id: 'Dapur Bersama', icon: 'restaurant', label: 'Dapur' },
  ];

  const handleFacilityToggle = (id: string) => {
    setPendingFacilities(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleApplyFilter = () => {
    setAppliedType(pendingType);
    setAppliedPrice(pendingPrice);
    setAppliedDistance(pendingDistance);
    setAppliedFacilities(pendingFacilities);
    setHasApplied(true);
  };

  const isFilterChanged = 
    pendingType !== appliedType ||
    pendingPrice !== appliedPrice || 
    pendingDistance !== appliedDistance || 
    JSON.stringify(pendingFacilities) !== JSON.stringify(appliedFacilities);

  // Filter Logic based entirely on APPLIED states
  const filteredKos = mockKosList.filter(kos => {
    // text search
    if (searchQuery && !kos.location.toLowerCase().includes(searchQuery.toLowerCase()) && !kos.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // type search
    if (appliedType !== 'Semua' && kos.type !== appliedType) return false;
    
    // price search
    const numPrice = parseInt(kos.price.replace(/[^0-9]/g, ''));
    if (appliedPrice === '< Rp 1jt' && numPrice >= 1000000) return false;
    if (appliedPrice === 'Rp 1jt–1.5jt' && (numPrice < 1000000 || numPrice > 1500000)) return false;
    if (appliedPrice === '> Rp 1.5jt' && numPrice <= 1500000) return false;
    
    // distance
    const dist = getDistanceKm(USER_LAT, USER_LNG, kos.latitude ?? 0, kos.longitude ?? 0);
    if (appliedDistance === '1 KM' && dist > 1) return false;
    if (appliedDistance === '3 KM' && dist > 3) return false;
    if (appliedDistance === '5 KM' && dist > 5) return false;

    // facilities
    if (appliedFacilities.length > 0) {
      const hasAll = appliedFacilities.every(f => kos.facilities.includes(f));
      if (!hasAll) return false;
    }

    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#747d8c" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari lokasi, nama kost..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#a4b0be"
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Type Chips */}
          <Text style={styles.sectionTitle}>Tipe Kost</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {typeChips.map(chip => (
              <Pressable 
                key={chip} 
                style={[styles.chip, pendingType === chip && styles.chipActive]}
                onPress={() => setPendingType(chip)}
              >
                <Text style={[styles.chipText, pendingType === chip && styles.chipTextActive]}>{chip}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Price Chips */}
          <Text style={styles.sectionTitle}>Harga Maksimal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {priceChips.map(chip => (
              <Pressable 
                key={chip} 
                style={[styles.chip, pendingPrice === chip && styles.chipActive]}
                onPress={() => setPendingPrice(chip)}
              >
                <Text style={[styles.chipText, pendingPrice === chip && styles.chipTextActive]}>{chip}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Facility Chips with Icons */}
          <Text style={styles.sectionTitle}>Fasilitas Harus Ada</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {facilitiesData.map(fac => {
              const isActive = pendingFacilities.includes(fac.id);
              return (
                <Pressable 
                  key={fac.id} 
                  style={[styles.chip, isActive && styles.chipActive, { flexDirection: 'row', alignItems: 'center' }]}
                  onPress={() => handleFacilityToggle(fac.id)}
                >
                  <Ionicons name={fac.icon as any} size={16} color={isActive ? '#ffffff' : '#8A95A5'} style={{marginRight: 6}} />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{fac.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Distance Chips Custom Logic */}
          <Text style={styles.sectionTitle}>Jarak Maksimal (Area Kampus)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
             {distanceChips.map(chip => (
              <Pressable 
                key={chip} 
                style={[styles.chip, pendingDistance === chip && styles.chipActive]}
                onPress={() => setPendingDistance(chip)}
              >
                <Text style={[styles.chipText, pendingDistance === chip && styles.chipTextActive]}>{chip}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Apply Button - Only show if filters changed or not applied yet */}
          {(isFilterChanged || !hasApplied) && (
            <Pressable style={styles.applyButton} onPress={handleApplyFilter}>
              <Text style={styles.applyButtonText}>Terapkan Filter</Text>
            </Pressable>
          )}

          {/* Results Area */}
          {!hasApplied ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="options-outline" size={48} color="#007AFF" />
              </View>
              <Text style={styles.emptyTitle}>Sesuaikan Kost Spesifikmu</Text>
              <Text style={styles.emptySubtitle}>Pilih filter harga, jarak, dan fasilitas, lalu tekan 'Terapkan Filter' untuk melihat hasilnya di sini.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Rekomendasi Kost ({filteredKos.length})</Text>
              </View>
              <View style={{ paddingHorizontal: 24 }}>
                {filteredKos.map(item => (
                  <View key={item.id} style={{ marginBottom: 16 }}>
                     <KosCard
                        kos={{ ...item, isFavorite: isFavorite(item.id) }}
                        onToggleFavorite={toggleFavorite}
                      />
                  </View>
                ))}
                {filteredKos.length === 0 && (
                  <View style={[styles.emptyContainer, { marginTop: 0 }]}>
                    <Ionicons name="search-outline" size={54} color="#dfe4ea" />
                    <Text style={styles.emptyTitle}>Tidak Ada Hasil</Text>
                    <Text style={styles.emptySubtitle}>Coba ubah kriteria pencarian atau filter Anda.</Text>
                  </View>
                )}
              </View>
            </View>
          )}

        </ScrollView>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#F4F9FF',
  },
  searchInputWrapper: {
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
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D23',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 12,
  },
  chipsContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.08)',
    backgroundColor: '#ffffff',
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    color: '#8A95A5',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  applyButton: {
    marginHorizontal: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 32,
    marginBottom: 32,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D23',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#E8F4FD',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8A95A5',
    textAlign: 'center',
    lineHeight: 22,
  },
});
