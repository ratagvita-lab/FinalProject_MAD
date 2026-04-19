import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KosCard from '../../components/KosCard';
import { mockKosList } from '../../constants/mockData';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  const favoriteKos = mockKosList.filter(kos => favorites.includes(kos.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kost Favoritku ❤️</Text>
          <Text style={styles.subtitle}>Pilihan terbaik yang kamu simpan</Text>
        </View>

        <FlatList
          data={favoriteKos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="heart-dislike-outline" size={60} color="#dfe4ea" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
              <Text style={styles.emptyText}>Cari kost idamanmu dan tekan tombol hati untuk menyimpannya di sini.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <KosCard
              kos={{ ...item, isFavorite: isFavorite(item.id) }}
              onToggleFavorite={toggleFavorite}
            />
          )}
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#747d8c',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2f3542',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#747d8c',
    textAlign: 'center',
    lineHeight: 24,
  },
});
