import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KosCard from '../../components/KosCard';
import FilterModal, { FilterOptions } from '../../components/FilterModal';
import { mockKosList } from '../../constants/mockData';
import { useFavorites } from '../../hooks/useFavorites';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    facilities: [],
    type: null,
    maxPrice: 5000000
  });

  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredKos = mockKosList.filter(kos => {
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

  const recommendations = filteredKos.slice(0, 3);
  const nearby = filteredKos.slice(3) || filteredKos.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi, Amanda 👋</Text>
              <Text style={styles.subtitle}>Mau cari kost di mana hari ini?</Text>
            </View>
            <View style={styles.profileBadge}>
              <Ionicons name="person" size={20} color="#1e90ff" />
            </View>
          </View>

          {/* Search & Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
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
              <Ionicons name="options" size={24} color="#ffffff" />
            </Pressable>
          </View>

          {/* Rekomendasi Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi untuk Kamu</Text>
            <Pressable><Text style={styles.seeAllText}>Lihat Semua</Text></Pressable>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recommendations.length > 0 ? recommendations : filteredKos.slice(0,3)}
            keyExtractor={(item) => 'rec-' + item.id}
            contentContainerStyle={styles.horizontalListContainer}
            renderItem={({ item }) => (
              <View style={{ width: 280, marginRight: 16 }}>
                <KosCard
                  kos={{ ...item, isFavorite: isFavorite(item.id) }}
                  onToggleFavorite={toggleFavorite}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada rekomendasi.</Text>
            }
          />

          {/* Kost Terdekat Section */}
          <View style={[styles.sectionHeader, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>Kost Terdekat</Text>
          </View>
          {nearby.length > 0 ? nearby.map(item => (
            <KosCard
              key={'nearby-' + item.id}
              kos={{ ...item, isFavorite: isFavorite(item.id) }}
              onToggleFavorite={toggleFavorite}
            />
          )) : filteredKos.map(item => (
            <KosCard
              key={'all-' + item.id}
              kos={{ ...item, isFavorite: isFavorite(item.id) }}
              onToggleFavorite={toggleFavorite}
            />
          ))}

          {filteredKos.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#dfe4ea" />
              <Text style={styles.emptyText}>Tidak ada kost yang sesuai kriteria.</Text>
            </View>
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
    backgroundColor: '#f1f6f9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#747d8c',
  },
  profileBadge: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 54,
    fontSize: 16,
    color: '#2f3542',
  },
  filterButton: {
    width: 54,
    height: 54,
    backgroundColor: '#1e90ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f3542',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e90ff',
  },
  horizontalListContainer: {
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#747d8c',
  },
});
